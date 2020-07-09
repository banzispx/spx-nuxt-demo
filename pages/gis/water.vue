<template>
  <section class="gis">
    <div
      id="map"
      class="main-map"
    />
    <div class="auxiliary_tool">
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

      <el-select
        v-model="childvalue"
        placeholder="请选择支流"
        @change="childriverChange"
      >
        <el-option
          v-for="item in riverChild"
          :key="item.name"
          :label="item.name"
          :value="item.riverId"
        />
      </el-select>
    </div>
  </section>
</template>
<script>
import chinaBouder from '~/static/geojson/china_bouder.json';
import chinaBoundary from '~/static/geojson/china_boundary.json';
import shuixi from '~/static/geojson/shuixi.json';
import yellowIcon from '@/static/images/yellow.png';
export default {
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
      // link: [
      //   { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css' },
      //   { rel: 'stylesheet', href: 'https://iclient.supermap.io/dist/leaflet/iclient-leaflet.min.css' }
      // ],
      // script: [
      //   { src: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.js' },
      //   { src: 'https://iclient.supermap.io/dist/leaflet/iclient-leaflet.js' }
      // ]
    };
  },
  data() {
    return {
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
  mounted() {
    const _this = this;
    // console.log(this.$route.query, 222);
    // 判断L是否加载进来
    const time = window.setInterval(() => {
      if (L && L.supermap && window.turf) {
        _this.init();

        window.clearInterval(time);
      } else {
      }
    }, 200);
  },
  methods: {
    init() {
      // const changjianArr = [
      //   'AFG00006', 'AFAA0006', 'AFE16206', 'AFD20106', 'AFC13006', 'BAA11662', 'AFC11006', 'AFE24006', 'AFD16106', 'BAA11657', 'AFD20316', 'AFC17H56', 'AFC17F16', 'AFC17H06', 'AFG13006', 'AFG25006', 'AFA03000', 'AFD17106', 'AFE16106', 'AFE25006', 'AFG31206', 'AFF10006', 'AFD20006', 'AFE00006', 'AFD00006', 'AFE15006', 'AFF12106', 'AFE21006', 'AFD16006', 'AFAB3006', 'BAA11659', 'AFC22006', 'AFE24106', 'AFC17906', 'AFC12106', 'AFC17C16', 'AFE25106', 'AFE18006', 'AFE11206', 'AFC11106', 'AFC11306', 'AFC17F06', 'AFE26006', 'AFE13006', 'AFC17806', 'AFF12116', 'AFE16006', 'AFC17G06', 'AFC17D06', 'AFC17C06', 'AFC17H66', 'AFC17H46', 'AFC17B06', 'AFAB1106', 'AFA73006', 'AFF10B46', 'AFC12006', 'AFA85306', 'AFA62006', 'AFAA2006', 'AFC17706', 'AFC17A06', 'AFA85206', 'AFA78006', 'AFC19006', 'AFE11006', 'AFE20006', 'AFD20306', 'AFE12006', 'AFA70006', 'AFD13006', 'AFC17606', 'AFG19006', 'AFA79006', 'AFAB1006', 'AFE10006', 'AFE23006', 'AFG25306', 'AFA81006', 'AFD16506', 'AFF13206', 'AFA74006', 'AFF12306', 'AFF10306', 'AFAA5006', 'AFF12506', 'AFG25206', 'AFF13106', 'AFE22006', 'AFD19306', 'AFF11006', 'AFG26006', 'AFG22006', 'AFG29006', 'AFA85006', 'AFF13006', 'AFC17006', 'AFF12A06', 'AFC17406', 'AFF10A06', 'AFC00006', 'AFF12006', 'BAA11653', 'AFE19106', 'AFE37006', 'BAA11656', 'BAA11655', 'BAA11664', 'AFE38006', 'BAA11663', 'AFG23006', 'AFA85106', 'AFG18006', 'AFG25706', 'AFAA5406'
      // ];
      // const features = this.shuixi.features.filter(item => {
      //   return changjianArr.indexOf(item.properties.RiverId) > 0;
      // });
      // this.liuyu = {
      //   type: 'FeatureCollection',
      //   features: features
      // };
      // const zhiliufeatures = this.shuixi.features.filter(item => {
      //   return item.properties.RiverId === 'AFA03000';
      // });
      // this.zhiliu = {
      //   type: 'FeatureCollection',
      //   features: zhiliufeatures
      // };
      if (!this.eventMap) {
        this.eventMap = new L.Map('map', {
          crs: L.CRS.EPSG4326,
          maxZoom: 18,
          minZoom: 3,
          zoom: 10,
          zoomSnap: 0.5,
          zoomControl: false, // 这里拒绝缩放
          attributionControl: false // 是否显示右下角的地图介绍
        // layers: [image]
        }).setView([30.01, 109.16653009033203], 10);
      }
      this.eventMap.on({
        click: () => {
          // console.log('map click');
          this.isShow = false;
        }
      });

      // const zhiliuliu = L.geoJSON(this.zhiliu, {
      //   style: {
      //     color: 'blue',
      //     fillColor: '#ffffff',
      //     opacity: 1,
      //     weight: 2
      //   }
      // });
      // this.eventMap.addLayer(zhiliuliu); // 城市区市分界线

      // const waterBoundary = L.geoJSON(this.liuyu, {
      //   style: {
      //     color: 'yellow',
      //     fillColor: '#ffffff',
      //     opacity: 0.65,
      //     weight: 2
      //   }
      // });
      // this.eventMap.addLayer(waterBoundary); // 城市区市分界线

      // 添加国界线、省界线
      // const chinaBoundary = L.geoJSON(this.chinaBoundary, {
      //   style: {
      //     color: '#f3f3f3',
      //     fillColor: '#FFFFFF',
      //     opacity: 0.65,
      //     weight: 2
      //   }
      // });
      // this.eventMap.addLayer(chinaBoundary); // 城市区市分界线
      const chinaBouder = L.geoJSON(this.chinaBouder, {
        style: {
          color: 'yellow',
          fillColor: '#FFFFFF',
          opacity: 0.65,
          weight: 2
        }
      });
      this.eventMap.addLayer(chinaBouder);
      // 添加图层到eventMap
      this.measureGroup = L.layerGroup().addTo(this.eventMap);
      this.mapYXlyr = L.supermap.tiandituTileLayer({
        layerType: 'img',
        key: '34baaf505786df95a096a4214767f141',
        crs: L.CRS.TianDiTu_WGS84,
        transparent: true,
        opacity: 1
      });
      this.mapZJlyr1 = L.supermap.tiandituTileLayer({
        layerType: 'img',
        isLabel: true,
        key: '34baaf505786df95a096a4214767f141'
      });
      this.mapZSlyr = L.supermap.tiandituTileLayer({
        key: '34baaf505786df95a096a4214767f141',
        crs: L.CRS.TianDiTu_WGS84,
        transparent: true,
        opacity: 1
      });
      this.mapZJlyr2 = L.supermap.tiandituTileLayer({
        isLabel: true,
        key: '34baaf505786df95a096a4214767f141'
      });
      this.RasterLayer = L.layerGroup([this.mapZJlyr1, this.mapYXlyr]);
      this.ZSMapGroup = L.layerGroup([this.mapZJlyr2, this.mapZSlyr]);
      // this.RasterLayer.addTo(this.eventMap);

      this.earthquakeMap = L.layerGroup().addTo(this.eventMap);

      // 添加水系的layer
      this.riversLayer = L.layerGroup().addTo(this.eventMap);
      this.lineLayer = L.layerGroup().addTo(this.eventMap);
      // 下面是各种图表的添加方式
      // this.addMakers();
      // 在地图初始化成功之后添加地震
      // this.initEarthquake();

      // this.getDamsByReverId();
      this.getAllRiver();
    },
    // 根据河流ID获取大坝
    getDamsByReverId() {
      const param = 'AFA03000';
      this.$axios
        .post(
          '/riverinstance/jsonrpc/basin.getDamIdsByRootRivers',
          '"' + param + '"'
        )
        .then(res => {
          if (res.status === 200) {
            this.damList = res.data;
            this.addDamMaker(res.data);
          }
        });
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
          if (riversArr.riverId !== item.riverId) {
            riverList.push(item.riverId);
          }
        });
        this.rootRivers.push({
          riverName: item.riverName,
          riverId: item.riverId,
          riverList: riverList,
          startX: item.startX,
          startY: item.starY,
          endX: item.endX,
          endY: item.endY
        });
      });
      // 设置黄河为默认的值
      const { root, child } = this.$route.query;
      if (root) {
        this.value = root;
        this.riverChange(root);
        this.childriverChange(child);
        this.childvalue = child;
      }
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
    childriverChange(riverId) {
      // console.log(this.riverChild, 'riverId');
      const damList = this.riverChild.filter(item => {
        return item.riverId === riverId;
      });
      // console.log(damList[0], 'damList[0]');
      // 画出所选择的线
      this.riverId = damList[0].riverId;
      this.drawCheckLine(damList[0].riverId);
      // 根据大坝列表画大坝
      this.addDamMaker([...damList[0].subDamToRiverList, ...damList[0].parentRiverDams]);
    },
    // 画出所选的线
    drawCheckLine(riverId) {
      this.$axios
        .post(
          '/riverinstance/basin.getPRootRivers',
          '"' + riverId + '"'
        )
        .then(res => {
          if (res.status === 200) {
            const arr = [];
            res.data.forEach(item => {
              arr.push(item.riverId);
            });
            // console.log(arr, 'arr', riverId);
            this.lineLayer.clearLayers();
            const features = this.shuixi.features.filter(item => {
              return arr.indexOf(item.properties.RiverId) >= 0;
              // return arr[0] === item.properties.RiverId;
            });
            this.liuyu = {
              type: 'FeatureCollection',
              features: features
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
      // console.log(arr);
      this.riverChild = arr;
    }
  }
};
</script>
<style lang="scss" scoped>
.gis {
  width: 100%;
  height: 100%;
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
    width: 500px;
    height: 50px;
    background: #fff;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
  }
  .showSingleDamInfo {
    position: absolute;
    padding: 15px 15px 10px 15px;
    height: 300px;
    overflow: auto;
    .el-loading-spinner {
      top: 50%;
    }
    .deletePopover {
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
