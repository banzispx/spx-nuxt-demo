<template>
  <section class="gis">
    <div
      v-show="!showOrNt"
      id="map"
      class="main-map"
    />
    <div class="auxiliary_tool">
      <div>
        流域：
        <el-select
          v-model="value"
          filterable
          placeholder="请选择河流"
          @change="riverChange"
        >
          <el-option
            v-for="(item,index) in rootRivers"
            :key="index"
            :label="item.riverName"
            :value="item.riverId"
          />
        </el-select>
      </div>
      <div>
        河流：
        <el-select
          v-model="childvalue"
          placeholder="请选择支流"
          @change="childriverChange"
        >
          <el-option
            v-for="(item, index) in riverChild"
            :key="item.name + index"
            :label="item.name"
            :value="item.riverId"
          />
        </el-select>
      </div>
    </div>
    <el-button
      type="primary"
      class="auxiliary_tool2"
      @click="togle"
    >
      {{ !showOrNt? '剖面图' : '平面图' }}
    </el-button>
    <el-button
      type="primary"
      class="auxiliary_tool1"
      @click="damsTotip"
    >
      大坝名称{{ damShow ? '显示' : '隐藏' }}
    </el-button>
    <div
      v-if="showOrNt"
      class="drawing_content"
    >
      <drawing-profile
        v-if="riverData"
        :river-data="riverData"
        :msg="drawingData"
      />
    </div>
  </section>
</template>
<script>
// import FileSaver from 'file-saver';
import drawingProfile from '@/components/drawingProfile/newDrawingProfile';
import L from 'leaflet';
import * as _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import chinaBouder from '~/static/geojson/china_bouder.json';
// import connectRiver from '~/static/geojson/connectRiver.json';
// import allRiverJson from '~/static/geojson/allriver.json';
import yellowIcon from '@/static/images/palceIcon/yellow.png';
export default {
  // layout: 'none',
  head() {
    return {
      link: [
        { rel: 'stylesheet', href: '/libs/leaflet/leaflet.css' },
        { rel: 'stylesheet', href: '/libs/iclient-leaflet/iclient-leaflet.min.css' }
      ],
      script: [
        { src: '/libs/leaflet/leaflet.js' },
        { src: '/libs/iclient-leaflet/iclient-leaflet-es6.min.js' }
      ]
    };
  },
  components: {
    drawingProfile
  },
  data() {
    return {
      connectRiver: null,
      allRiverJson: null,
      shuixi: null,
      damShow: false,
      riverData: [],
      showOrNt: false,
      riverId: 'ADA00000',
      drawingData: '流域',
      childvalue: '',
      riverChild: [],
      rootRivers: [],
      value: '',
      chinaBouder: chinaBouder,
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
  mounted() {
    this.init();
  },
  methods: {
    async getJSON() {
      // 打包出来的静态文件里面有这个东西，这样请求不跨域
      this.shuixi = await this.$axios.get('/geojson/reservetwo.json').then(res => {
        return res.data;
      }, response => {
        console.log('2222');
      });
      this.connectRiver = await this.$axios.get('/geojson/connectRiver.json').then(res => {
        return res.data;
      }, response => {
        console.log('2222');
      });
      this.allRiverJson = await this.$axios.get('/geojson/allriver.json').then(res => {
        return res.data;
      }, response => {
        console.log('2222');
      });
      // this.shuixi = await this.$axios.get('json/reservetwo.json').then(res => {
      //   return res.data;
      // }, response => {
      //   console.log('2222');
      // });
      // this.connectRiver = await this.$axios.get('json/connectRiver.json').then(res => {
      //   return res.data;
      // }, response => {
      //   console.log('2222');
      // });
      // this.allRiverJson = await this.$axios.get('json/allriver.json').then(res => {
      //   return res.data;
      // }, response => {
      //   console.log('2222');
      // });
      this.getAllRiver();
    },
    togle() {
      this.showOrNt = !this.showOrNt;
    },
    // 大坝名称的显示影藏
    damsTotip() {
      this.damShow = !this.damShow;
      if (this.damShow) {
        this.earthquakeMap.eachLayer((layer) => {
          layer.closeTooltip();
        });
      } else {
        this.earthquakeMap.eachLayer((layer) => {
          layer.openTooltip();
        });
      }
    },
    // 生成流域文件的函数
    creatLiuYuFiles(content) {
      const arr = [];
      content.forEach(item => {
        const { riverId, riverLevel, riverSys, rootId, riverName, startX, starY, endX, endY, subRiverList, shieldRiverList } = item;
        arr.push({
          riverId, riverLevel, riverSys, rootId, riverName, startX, starY, endX, endY, subRiverList, shieldRiverList
        });
      });
      console.log(JSON.stringify(arr), 'arr');
      // var blob = new Blob(arr, { type: 'text/plain;charset=utf-8' });

      // FileSaver.saveAs(blob, 'allriver1.json');
    },
    init() {
      const imgC = L.tileLayer(
        'http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=1a905b663dde38d7c6169e1ea9ca418f'
      );
      const cvacm = L.tileLayer(
        'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=1a905b663dde38d7c6169e1ea9ca418f'
      );
      const image = L.layerGroup([imgC, cvacm]);
      if (!this.eventMap) {
        this.eventMap = new L.Map('map', {
          // crs: L.CRS.EPSG4326,
          maxZoom: 18,
          minZoom: 3,
          zoom: 3,
          zoomSnap: 0.5,
          zoomControl: false, // 这里拒绝缩放
          attributionControl: false, // 是否显示右下角的地图介绍
          layers: [image]
        }).setView([30.01, 109.16653009033203], 3);
      }
      this.eventMap.on({
        click: (e) => {
          console.log(e, 'e');
        }
      });

      const chinaBouder = L.geoJSON(this.chinaBouder, {
        style: {
          color: 'yellow',
          fillColor: '#FFFFFF',
          opacity: 0.65,
          weight: 2
        }
      });
      this.eventMap.addLayer(chinaBouder);
      // 这个是添加图表的图层
      this.earthquakeMap = L.layerGroup().addTo(this.eventMap);

      // 添加水系的layer
      this.riversLayer = L.layerGroup().addTo(this.eventMap);
      this.lineLayer = L.layerGroup().addTo(this.eventMap);

      this.addLine = L.layerGroup().addTo(this.eventMap);

      this.getJSON();
      // 下面是各种图表的添加方式
      // this.getAllRiver();
    },
    // 添加河流大坝
    addDamMaker(damList) {
      this.earthquakeMap.clearLayers();
      damList.forEach(item => {
        // 过滤大坝名字
        const name = this.filterDamName(item.damName);
        var icon = L.icon({
          iconUrl: yellowIcon,
          iconSize: [13, 15]
        });
        L.marker([item.latitude, item.longitude], { icon: icon }).addTo(this.earthquakeMap).bindTooltip(name, { permanent: !this.damShow });
      });
    },
    // 过滤大坝名字
    filterDamName(damName) {
      let name = damName;
      const filterArr = ['大坝', '水电站', '闸坝', '电站'];
      let isLoop = false;
      const dealFun = () => {
        isLoop = false;
        filterArr.forEach(item => {
          if (name.endsWith(item)) {
            isLoop = true;
            name = name.substring(0, name.length - item.length);
          }
        });
        if (isLoop) {
          dealFun(name);
        }
      };
      dealFun();
      return name;
    },
    //  获取所有河流的信息
    getAllRiver() {
      this.riversArr = this.allRiverJson;
      this.dealRiver(this.riversArr);
    },
    dealRiver(riversArr) {
      riversArr.map(item => {
        const riverList = [];
        item.subRiverList.forEach(item => {
          riverList.push({
            riverId: item.riverId,
            riverLevel: item.riverLevel * 1
          });
        });
        this.rootRivers.push({
          shieldRiverList: item.shieldRiverList,
          riverName: item.riverName,
          riverId: item.riverId,
          riverList: riverList,
          startX: item.startX,
          startY: item.starY,
          endX: item.endX,
          endY: item.endY
        });
      });
      // 在此获取所有大坝ID
      // this.dealrootRivers(this.riversArr);
      // 设置默认代码
      this.value = 'ADA00000';
      this.riverChange('ADA00000');
      this.childriverChange('ADA00000');
      this.childvalue = 'ADA00000';
    },
    // 处理rootRiver数据
    async dealrootRivers(rootRivers) {
      const arr = [];
      rootRivers.forEach(riverRoot => {
        riverRoot.subRiverList.forEach((item, index) => {
          if ((item.riverId !== riverRoot.riverId && item.subDamToRiverList.length > 0 && riverRoot.shieldRiverList.indexOf(item.riverId) < 0) || index === 0) {
            arr.push(item.riverId);
          }
        });
      });
      // const content = await this.crossIdget('AAA00001');
      const connectRiver = {};
      for (let index = 0; index < arr.length; index++) {
        const riverId = arr[index];
        const content = await this.crossIdget(riverId);
        connectRiver[riverId] = JSON.stringify(content.data);
      }
      console.log(JSON.stringify(connectRiver));
    },
    riverChange(event) {
      this.riversLayer.clearLayers();
      this.addLine.clearLayers();
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
    childriverChange(riverId) {
      const damList = this.riverChild.filter(item => {
        return item.riverId === riverId;
      });
      // 画出所选择的线
      this.riverId = riverId;
      this.drawCheckLine(damList[0].riverId);
    },
    // 画出所选的线
    drawCheckLine(riverId) {
      const connectRiverArr = JSON.parse(this.connectRiver[riverId]);
      // 获取剖面图的数据
      this.riverData = _.cloneDeep(connectRiverArr);
      const arr = [];
      const newArr = [];
      let riverAndchildDams = [];
      _.cloneDeep(connectRiverArr).reverse().forEach(item => {
        arr.push(item.riverId);
        newArr.push({
          riverId: item.riverId,
          riverLevel: item.riverLevel
        });
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
      if (arr.length > 1) {
        this.dealchildRiverArr(newArr);
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
          color: '#8b0000',
          fillColor: '#ffffff',
          opacity: 1,
          weight: 2
        }
      });
      this.lineLayer.addLayer(lineBoundary);
    },
    async crossIdget(riverId) {
      return this.$axios.post('/riverinstance/basin.getRiverChildToHead', '"' + riverId + '"');
      // this.$axios
      //   .post(
      //     '/riverinstance/basin.getRiverChildToHead',
      //     '"' + riverId + '"'
      //   )
      //   .then(res => {
      //     if (res.status === 200) {
      //       return res.data;
      //     }
      //   });
    },
    // 通过给定的数组画出不同颜色的线段 测试函数
    drawArrLineWithDifColors(arr) {
      const colors = ['black', 'blue', 'purple', 'white', 'red', 'black', 'blue', 'purple', 'white'];
      this.lineLayer.clearLayers();
      arr.forEach((item, index) => {
        const featute = this.gitFeatureByRiverId('ADA00000');
        this.liuyu = {
          type: 'FeatureCollection',
          features: [featute]
        };
        const lineBoundary = L.geoJSON(this.liuyu, {
          style: {
            color: colors[index],
            fillColor: '#ffffff',
            opacity: 0.65,
            weight: 2
          }
        });
        this.lineLayer.addLayer(lineBoundary);
      });
    },
    // 通过给出的支流arr画出线
    dealchildRiverArr(toarr) {
      // this.drawArrLineWithDifColors(['AGA04006']);

      // 传入数组，返回红色和黄色的feature
      this.lineLayer.clearLayers();
      const { redFeature, yellowFeature } = this.getRedYellowFeatureByArr([...toarr].reverse());

      const riverLevelColors = ['#8b0000', '#B22222', '#ff0000', '#ff6600', '#ff9999', '#ff99ff', '#ffcccc', '#ffccff'];
      // const riverLevelColors = ['#008b8b', '#00ced1', '#48d1cc', '#40e0d0', '#87cecb', '#afeeee'];
      redFeature.forEach(item => {
        const feature = item.feature;
        const liuyu = {
          type: 'FeatureCollection',
          features: [feature]
        };
        const lineBoundary = L.geoJSON(liuyu, {
          style: {
            color: riverLevelColors[item.riverLevel * 1 - 1],
            fillColor: riverLevelColors[item.riverLevel * 1 - 1],
            opacity: 1,
            weight: 3
          }
        });
        this.lineLayer.addLayer(lineBoundary);
      });
      this.addlineByfeature(yellowFeature);
    },
    getRedYellowFeatureByArr(arr) {
      // 根据前后两条riverId获取后一条riverId的红色和黄色的feature
      const redFeature = [];
      const yellowFeature = [];
      arr.forEach((item, index) => {
        if (index === 0) {
          const getfeature = this.gitFeatureByRiverId(item.riverId);
          redFeature.push({
            riverLevel: item.riverLevel,
            feature: getfeature
          });
          const { red, yellow } = this.getFeatureByTwoRivers(item.riverId, arr[index + 1].riverId);
          redFeature.push({
            riverLevel: arr[index + 1].riverLevel,
            feature: red
          });
          yellowFeature.push(yellow);
        } else if (index < arr.length - 1) {
          const { red, yellow } = this.getFeatureByTwoRivers(item.riverId, arr[index + 1].riverId);
          // redFeature.push(red);
          redFeature.push({
            riverLevel: arr[index + 1].riverLevel,
            feature: red
          });
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
        const first = firstFeature[0].geometry.coordinates[firstFeature[0].geometry.coordinates.length - 1][0];
        const firstTwo = secondFeature[0].geometry.coordinates[0][0];
        const second = firstFeature[0].geometry.coordinates[firstFeature[0].geometry.coordinates.length - 1][1];
        const secondTwo = secondFeature[0].geometry.coordinates[0][1];
        const distance = (firstTwo - first) * (firstTwo - first) + (secondTwo - second) * (secondTwo - second);
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
          color: '#33ff00',
          fillColor: '#ffffff',
          opacity: 0.65,
          weight: 2
        }
      });
      this.addLine.addLayer(lineBoundary);
    },
    // 画root河流的流域
    drawRiverByArr(arr) {
      // const riverLevelColors = ['#33ff00', '#33ff00', '#33ff00', '#33ff00', '#33ff00', '#33ff00', '#33ff00'];
      const riverLevelColors = ['#008b8b', '#00ced1', '#48d1cc', '#40e0d0', '#87cecb', '#afeeee'];
      this.riversLayer.clearLayers();
      arr.forEach(item => {
        const featute = this.gitFeatureByRiverId(item.riverId);
        const liuyu = {
          type: 'FeatureCollection',
          features: [featute]
        };
        const waterBoundary = L.geoJSON(liuyu, {
          style: {
            color: riverLevelColors[item.riverLevel * 1 - 1],
            fillColor: '#FFFFFF',
            opacity: 0.65,
            weight: 2
          }
        });
        this.riversLayer.addLayer(waterBoundary); // 城市区市分界线
      });
    },
    // 根据河流Id获取有大坝的支流的ID
    getHasDamByRiverId(riverId) {
      const river = this.riversArr.filter(item => {
        return item.riverId === riverId;
      });
      const arr = [];
      // river[0].shieldRiverList.indexOf(item.riverId) < 0
      river[0].subRiverList.forEach((item, index) => {
        if ((item.riverId !== river[0].riverId && item.subDamToRiverList.length > 0 && river[0].shieldRiverList.indexOf(item.riverId) < 0) || index === 0) {
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
  // position: absolute;
  // left: 0px;
  // top: 0px;
  width: calc(100% - 0px);
  // width: 100%;
  height: 100%;
  .drawing_content{
    margin-top: 80px;
  width:100%;
  min-height:600px;
  position: absolute;
}
  .main-map {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .auxiliary_tool {
    padding: 5px;
    position: absolute;
    left: 25%;
    top: 30px;
    z-index: 20;
    width: 600px;
    height: 50px;
    background: #fff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .auxiliary_tool2{
position: absolute;
    left: 85%;
    top: 30px;
    z-index: 1500;
  }
  .auxiliary_tool1{
position: absolute;
    left: 75%;
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
