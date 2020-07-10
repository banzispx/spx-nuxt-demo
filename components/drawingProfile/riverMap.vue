<template>
  <section class="gis">
    <div
      v-show="!showOrNt"
      id="childmap"
      class="main-childmap"
    />
  </section>
</template>
<script>
import L from 'leaflet';
import * as _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import chinaBouder from '~/static/geojson/china_bouder.json';
import chinaBoundary from '~/static/geojson/china_boundary.json';
import shuixi from '~/static/geojson/shuixi.json';
import yellowIcon from '@/static/images/palceIcon/yellow.png';
export default {
  props: ['parentId', 'childId'],
  head() {
    return {
      link: [
        { rel: 'stylesheet', href: '/libs/leaflet/leaflet.css' },
        { rel: 'stylesheet', href: '/libs/iclient-leaflet/iclient-leaflet.min.css' }
      ],
      script: [
        { src: '/libs/leaflet/leaflet.js' },
        { src: '/libs/iclient-leaflet/iclient-leaflet-es6.min.js' },
        { src: '/libs/iclient-leaflet/turf.min.js' }
      ]
    };
  },
  data() {
    return {
      riverData: [],
      showOrNt: false,
      riverId: 'ADA00000',
      drawingData: '流域',
      childvalue: '',
      riverChild: [],
      rootRivers: [],
      value: '',
      chinaBoundary: chinaBoundary,
      chinaBouder: chinaBouder,
      shuixi: shuixi,
      mapYXlyr: {},
      mapZSlyr: {},
      mapZJlyr1: {},
      mapZJlyr2: {},
      measureGroup: {},
      popoverPosition: null,
      isShow: true,
      showSingleDam: true
    };
  },
  watch: {
    parentId(newValue) {
      console.log(newValue, 'newValue');
      this.riverChange(newValue);
    },
    childId(newValue) {
      this.childriverChange(newValue);
    }
  },
  mounted() {
    const _this = this;
    _this.init();
  },
  methods: {
    init() {
      if (!this.eventMap) {
        this.eventMap = new L.Map('childmap', {
          crs: L.CRS.EPSG4326,
          maxZoom: 18,
          minZoom: 3,
          zoom: 3,
          zoomSnap: 0.5,
          zoomControl: false, // 这里拒绝缩放
          attributionControl: false // 是否显示右下角的地图介绍
        // layers: [image]
        }).setView([30.01, 109.16653009033203], 3);
      }
      const chinaBouder = L.geoJSON(this.chinaBouder, {
        style: {
          color: 'yellow',
          fillColor: '#FFFFFF',
          opacity: 0.65,
          weight: 2
        }
      });
      this.eventMap.addLayer(chinaBouder);

      this.earthquakeMap = L.layerGroup().addTo(this.eventMap);

      // 添加水系的layer
      this.riversLayer = L.layerGroup().addTo(this.eventMap);
      this.lineLayer = L.layerGroup().addTo(this.eventMap);

      this.addLine = L.layerGroup().addTo(this.eventMap);
      // 下面是各种图表的添加方式
      this.getAllRiver();
    },
    // 添加河流大坝
    addDamMaker(damList) {
      this.earthquakeMap.clearLayers();
      damList.forEach(item => {
        var icon = L.icon({
          iconUrl: yellowIcon,
          iconSize: [13, 15]
        });
        L.marker([item.latitude, item.longitude], { icon: icon }).addTo(this.earthquakeMap).bindTooltip(item.damName, { permanent: true });
      });
    },
    //  获取所有河流的信息
    getAllRiver() {
      this.$axios
        .post(
          '/riverinstance/basin.getPAllRivers'
        )
        .then(res => {
          if (res.status === 200) {
            this.riversArr = res.data;
            this.dealRiver(res.data);
          }
        });
    },
    dealRiver(riversArr) {
      riversArr.map(item => {
        const riverList = [];
        item.subRiverList.forEach(item => {
          riverList.push(item.riverId);
        });
        this.rootRivers.push({
          riverName: item.riverName + '流域',
          riverId: item.riverId,
          riverList: riverList,
          startX: item.startX,
          startY: item.starY,
          endX: item.endX,
          endY: item.endY
        });
      });
      // 设置黄河为默认的值
      this.value = 'ADA00000';
      this.riverChange('ADA00000');
      this.childriverChange('ADA00000');
      this.childvalue = 'ADA00000';
    },
    riverChange(event) {
      this.earthquakeMap.clearLayers();
      this.lineLayer.clearLayers();
      this.childvalue = '';
      this.waterBoundary = null;
      const item = this.rootRivers.filter(item => {
        return item.riverId === event;
      });
      // item 是主支流的信息 再次从新定位地图
      const { startX, startY, endX, endY } = item[0];
      this.eventMap.setView([(endY * 1 + startY * 1) / 2, (endX * 1 + startX * 1) / 2], 5);
      this.drawRiverByArr(item[0].riverList);
      // 获取有大坝的支流
      this.getHasDamByRiverId(event);
    },
    // 处理支流的改变
    async childriverChange(riverId) {
      const damList = this.riverChild.filter(item => {
        return item.riverId === riverId;
      });
      // 画出所选择的线
      this.riverId = riverId;
      this.drawCheckLine(damList[0].riverId);
      // 根据大坝列表画大坝
      // this.addDamMaker([...damList[0].subDamToRiverList]);
    },
    // 画出所选的线
    drawCheckLine(riverId) {
      this.$axios
        .post(
          '/riverinstance/basin.getRiverChildToHead',
          '"' + riverId + '"'
        )
        .then(res => {
          if (res.status === 200) {
            // 获取剖面图的数据
            this.riverData = _.cloneDeep(res.data);
            const arr = [];
            let riverAndchildDams = [];
            _.cloneDeep(res.data).reverse().forEach(item => {
              arr.push(item.riverId);
              if (item.subDamToRiverList && item.subDamToRiverList.length > 0) {
                riverAndchildDams = [...riverAndchildDams, ...item.subDamToRiverList];
              }
            });
            // 画出支流和干流下游的大坝
            this.addDamMaker([...riverAndchildDams]);
            this.lineLayer.clearLayers();
            const features = this.shuixi.features.filter(item => {
              return arr.indexOf(item.properties.RiverCode) >= 0;
              // return arr[0] === item.properties.RiverId;
            });
            if (arr.length > 3) {
              this.dealchildRiverArr(arr);
              return;
            }
            if (features.length === 0) {
              return;
            }
            const rootFeature = _.cloneDeep(this.shuixi.features.filter(item => {
              return arr[0] === item.properties.RiverId;
            }));
            let childFeature = null;
            if (arr[1]) {
              childFeature = _.cloneDeep(this.shuixi.features.filter(item => {
                return arr[1] === item.properties.RiverId;
              }));
            }
            let childSecondFeature = null;
            if (arr[2]) {
              childSecondFeature = _.cloneDeep(this.shuixi.features.filter(item => {
                return arr[2] === item.properties.RiverId;
              }));
              // 在此处比较两条字河流相交的部分
            }
            let oldfeatures = _.cloneDeep(features);
            // features 数组 第一个是干流 第二个是支流
            if (arr[1] && rootFeature) {
              const lastchildfeatureloaction = _.cloneDeep(childFeature[0].geometry.coordinates[childFeature[0].geometry.coordinates.length - 1]);
              const rootFeatureArr = _.cloneDeep(rootFeature[0].geometry.coordinates);
              // 下面
              let distance = 0;
              let firstIndex = 0;
              rootFeatureArr.forEach((item, index) => {
                const newDistance = (item[0] * 1 - lastchildfeatureloaction[0] * 1) * (item[0] * 1 - lastchildfeatureloaction[0] * 1) + (item[1] * 1 - lastchildfeatureloaction[1] * 1) * (item[1] * 1 - lastchildfeatureloaction[1] * 1);
                if (index === 0) {
                  distance = newDistance;
                  firstIndex = index;
                }
                if (newDistance < distance) {
                  distance = newDistance;
                  firstIndex = index;
                }
              });
              const rootYellow = rootFeature[0].geometry.coordinates.splice(0, firstIndex);
              const yellowFeature = _.cloneDeep(rootFeature[0]);
              yellowFeature.geometry.coordinates = rootYellow;

              oldfeatures = [];
              oldfeatures[0] = _.cloneDeep(rootFeature[0]);
              oldfeatures[1] = _.cloneDeep(childFeature[0]);
              if (arr[2]) {
                oldfeatures[2] = _.cloneDeep(childSecondFeature[0]);
                // 此处需要比较oldfeatures[1]无大坝， oldfeatures[2]有大坝
                const childSecondFeaturehasDamlast = _.cloneDeep(childSecondFeature[0].geometry.coordinates[childSecondFeature[0].geometry.coordinates.length - 1]);
                const childFeatureArrNoDam = _.cloneDeep(childFeature[0].geometry.coordinates);
                let childFindIndex = 0;
                childFeatureArrNoDam.forEach((item, index) => {
                  const newDistance = (item[0] * 1 - childSecondFeaturehasDamlast[0] * 1) * (item[0] * 1 - childSecondFeaturehasDamlast[0] * 1) + (item[1] * 1 - childSecondFeaturehasDamlast[1] * 1) * (item[1] * 1 - childSecondFeaturehasDamlast[1] * 1);
                  if (index === 0) {
                    childFindIndex = index;
                    distance = newDistance;
                  }
                  if (newDistance < distance) {
                    childFindIndex = index;
                    distance = newDistance;
                  }
                });
                oldfeatures[1].geometry.coordinates = oldfeatures[1].geometry.coordinates.slice(childFindIndex);
              }
              // 根据feature添加线
              this.addlineByfeature([yellowFeature]);
            } else {
              oldfeatures = _.cloneDeep(features);
            }
            this.liuyu = {
              type: 'FeatureCollection',
              features: oldfeatures
            };
            const lineBoundary = L.geoJSON(this.liuyu, {
              style: {
                color: 'red',
                fillColor: '#ffffff',
                opacity: 0.65,
                weight: 2
              }
            });
            this.lineLayer.addLayer(lineBoundary);
          }
        });
    },
    // 通过给出的支流arr画出线
    dealchildRiverArr(toarr) {
      // 传入数组，返回红色和黄色的feature
      const { redFeature, yellowFeature } = this.getRedYellowFeatureByArr([...toarr].reverse());
      this.liuyu = {
        type: 'FeatureCollection',
        features: redFeature
      };
      const lineBoundary = L.geoJSON(this.liuyu, {
        style: {
          color: 'red',
          fillColor: '#ffffff',
          opacity: 0.65,
          weight: 2
        }
      });
      this.lineLayer.addLayer(lineBoundary);
      this.addlineByfeature(yellowFeature);
    },
    getRedYellowFeatureByArr(arr) {
      // 根据前后两条riverId获取后一条riverId的红色和黄色的feature
      const redFeature = [];
      const yellowFeature = [];
      arr.forEach((item, index) => {
        if (index === 0) {
          const getfeature = this.gitFeatureByRiverId(item);
          redFeature.push(getfeature);
          const { red, yellow } = this.getFeatureByTwoRivers(item, arr[index + 1]);
          console.log(red, yellow, 'red, yellow,');
          redFeature.push(red);
          yellowFeature.push(yellow);
        } else if (index < arr.length - 1) {
          const { red, yellow } = this.getFeatureByTwoRivers(item, arr[index + 1]);
          redFeature.push(red);
          yellowFeature.push(yellow);
        }
      });
      return {
        redFeature: redFeature,
        yellowFeature: yellowFeature
      };
    },
    gitFeatureByRiverId(riverId) {
      const getFeature = _.cloneDeep(this.shuixi.features.filter(item => {
        return riverId === item.properties.RiverId;
      }));
      return getFeature[0];
    },
    getFeatureByTwoRivers(fstRiverId, sedRiverId) {
      const fstRiverIdFeature = this.gitFeatureByRiverId(fstRiverId);
      const sedRiverIdFeature = this.gitFeatureByRiverId(sedRiverId);
      // 第一条河流的最后一个坐标点
      const fstRiverIdFeaturelast = _.cloneDeep(fstRiverIdFeature.geometry.coordinates[fstRiverIdFeature.geometry.coordinates.length - 1]);
      const sedRiverIdFeatureArr = _.cloneDeep(sedRiverIdFeature.geometry.coordinates);
      let distance = 0;
      let childFindIndex = 0; // 找到的第二个河流距离第一个最近的点
      sedRiverIdFeatureArr.forEach((item, index) => {
        const newDistance = (item[0] * 1 - fstRiverIdFeaturelast[0] * 1) * (item[0] * 1 - fstRiverIdFeaturelast[0] * 1) + (item[1] * 1 - fstRiverIdFeaturelast[1] * 1) * (item[1] * 1 - fstRiverIdFeaturelast[1] * 1);
        if (index === 0) {
          childFindIndex = index;
          distance = newDistance;
        }
        if (newDistance < distance) {
          childFindIndex = index;
          distance = newDistance;
        }
      });
      console.log(childFindIndex, 'childFindIndex');
      const redFeature = _.cloneDeep(sedRiverIdFeature);
      redFeature.geometry.coordinates.splice(0, childFindIndex);
      // redFeature.geometry.coordinates = _.cloneDeep(sedRiverIdFeature.geometry.coordinates).splice(0, childFindIndex);
      const YellowFeature = _.cloneDeep(sedRiverIdFeature);
      YellowFeature.geometry.coordinates = _.cloneDeep(sedRiverIdFeature.geometry.coordinates).slice(0, childFindIndex);
      return {
        red: redFeature, yellow: YellowFeature
      };
    },
    findIndexDiff(arr) {
      let firstFeature, secondFeature;
      const filterArr = arr.filter((item, index) => {
        if (index === arr.length - 1) {
          return;
        }
        firstFeature = _.cloneDeep(this.shuixi.features.filter(item => {
          return arr[index] === item.properties.RiverId;
        }));
        secondFeature = _.cloneDeep(this.shuixi.features.filter(item => {
          return arr[index + 1] === item.properties.RiverId;
        }));

        console.log(firstFeature, secondFeature);
        const first = firstFeature[0].geometry.coordinates[firstFeature[0].geometry.coordinates.length - 1][0];
        const firstTwo = secondFeature[0].geometry.coordinates[0][0];
        const second = firstFeature[0].geometry.coordinates[firstFeature[0].geometry.coordinates.length - 1][1];
        const secondTwo = secondFeature[0].geometry.coordinates[0][1];
        const distance = (firstTwo - first) * (firstTwo - first) + (secondTwo - second) * (secondTwo - second);
        console.log(distance, 'distance');
        if (secondTwo && distance < 0.1) {
          return true;
        }
      });
      return filterArr[0] ? filterArr[0] : arr[0];
    },
    // 根据feature添加线
    addlineByfeature(yellowFeature) {
      this.addLine.clearLayers();
      const line = {
        type: 'FeatureCollection',
        features: yellowFeature
      };
      const lineBoundary = L.geoJSON(line, {
        style: {
          color: 'yellow',
          fillColor: '#ffffff',
          opacity: 0.65,
          weight: 2
        }
      });
      this.addLine.addLayer(lineBoundary);
    },
    // 画root河流的流域
    drawRiverByArr(arr) {
      this.riversLayer.clearLayers();
      const features = this.shuixi.features.filter(item => {
        return arr.indexOf(item.properties.RiverId) > 0;
      });
      this.liuyu = {
        type: 'FeatureCollection',
        features: features
      };
      const waterBoundary = L.geoJSON(this.liuyu, {
        style: {
          color: 'yellow',
          fillColor: '#ffffff',
          opacity: 0.65,
          weight: 2
        }
      });
      this.riversLayer.addLayer(waterBoundary); // 城市区市分界线
    },
    // 根据河流Id获取有大坝的支流的ID
    getHasDamByRiverId(riverId) {
      const river = this.riversArr.filter(item => {
        return item.riverId === riverId;
      });
      const arr = [];
      river[0].subRiverList.forEach((item, index) => {
        if ((item.riverId !== river[0].riverId && item.subDamToRiverList.length > 0) || index === 0) {
          arr.push(
            {
              name: item.riverName,
              riverId: item.riverId,
              subDamToRiverList: item.subDamToRiverList,
              parentRiverDams: river[0].subRiverList[0].subDamToRiverList
            }
          );
        }
      });

      this.riverChild = arr;
      this.childvalue = riverId;
      this.childriverChange(riverId);
    }
  }
};
</script>
<style lang="scss" scoped>
.gis {
  position: absolute;
  left: 0px;
  top: 0px;
  width: calc(100% - 0px);
  // width: 100%;
  height: 100%;
  .drawing_content{
    margin-top: 80px;
  width:100%;
  min-height:600px;
  position: absolute;
}
  .main-childmap {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .auxiliary_tool {
    padding: 5px;
    position: absolute;
    left: 5%;
    top: 30px;
    z-index: 20;
    width: 500px;
    height: 50px;
    background: #fff;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
  }
  .auxiliary_tool2{
position: absolute;
    left: 85%;
    top: 30px;
    z-index: 1500;
  }
  .showSingleDamInfo{
    position: absolute;
    padding: 15px 15px 10px 15px;
    height: 300px;
    overflow: auto;
    .el-loading-spinner{
      top:50%;
    }
    .deletePopover{
      position: absolute;
      right: 5px;
      top: 2px;
      font-size: 18px;
      cursor: pointer;
      font-weight: 650;
    }
  }
  #tooltip {
    position: absolute;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    visibility: hidden;
    width: 150px;
    height: 50px;
    padding: 10px;
    z-index: 888;
  }
}
</style>
