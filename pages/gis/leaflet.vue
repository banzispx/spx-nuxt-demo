<template>
  <section class="gis">
    <div
      id="map"
      class="main-map"
    />
    <div id="tooltip" />
    <div class="auxiliary_tool">
      <el-row>
        <el-col :span="8">
          <el-dropdown
            style="width:100%;height:100%;line-height:50px"
            class="text-center"
            @command="changeAuxiliaryTool"
          >
            <span class="el-dropdown-link">
              <i class="iconfont mr-2">&#xe685;</i>辅助工具
            </span>
            <el-dropdown-menu
              slot="dropdown"
              class="auxiliary_dropdown"
            >
              <el-dropdown-item command="line">
                测距
              </el-dropdown-item>
              <el-dropdown-item command="area">
                测面
              </el-dropdown-item>
              <el-dropdown-item command="clear">
                清除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="8">
          <el-dropdown
            style="width:100%;height:100%;line-height:50px"
            class="text-center"
            @command="changeEventLegend"
          >
            <span class="el-dropdown-link">
              <i class="iconfont mr-2">&#xe690;</i>事件图例
            </span>
            <el-dropdown-menu
              slot="dropdown"
              class="auxiliary_dropdown"
            >
              <el-dropdown-item command="earthquake">
                地震
              </el-dropdown-item>
              <el-dropdown-item command="typhoon">
                台风
              </el-dropdown-item>
              <el-dropdown-item command="debrisFlow">
                泥石流
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="8">
          <el-dropdown
            style="width:100%;height:100%;line-height:50px"
            class="text-center"
            @command="changeSupermapTileLayer"
          >
            <span class="el-dropdown-link">
              <i class="iconfont mr-2">&#xe609;</i>地图
            </span>
            <el-dropdown-menu
              slot="dropdown"
              class="auxiliary_dropdown"
            >
              <el-dropdown-item command="cityMap">
                <i class="iconfont">&#xe6c7;</i> 城市地图
              </el-dropdown-item>
              <el-dropdown-item command="satelliteMap">
                <i class="iconfont">&#xe680;</i> 卫星地图
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import chinaBouder from '~/static/geojson/china_bouder.json';
import chinaBoundary from '~/static/geojson/china_boundary.json';
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
      chinaBoundary: chinaBoundary,
      chinaBouder: chinaBouder,
      mapYXlyr: {},
      mapZSlyr: {},
      mapZJlyr1: {},
      mapZJlyr2: {},
      measureGroup: {}
    };
  },
  mounted() {
    const _this = this;

    // 判断L是否加载进来
    const time = window.setInterval(() => {
      if (L && L.supermap && window.turf) {
        console.log(time, 2222);
        _this.init();

        window.clearInterval(time);
      } else {
        console.log(222);
      }
    }, 200);
  },
  methods: {
    init() {
      // https://www.cnblogs.com/CooLLYP/p/8716271.html leaflet常见的事件中文文档
      // const imgC = L.tileLayer(
      //   'http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=1a905b663dde38d7c6169e1ea9ca418f'
      // );
      // const cvacm = L.tileLayer(
      //   'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=1a905b663dde38d7c6169e1ea9ca418f'
      // );
      // const image = L.layerGroup([imgC, cvacm]);
      // const imgC = L.supermap.tiandituTileLayer({
      //   key: '34baaf505786df95a096a4214767f141',
      //   crs: L.CRS.TianDiTu_WGS84,
      //   transparent: true,
      //   opacity: 1
      // });
      // const cvacm = L.supermap.tiandituTileLayer({
      //   isLabel: true,
      //   key: '34baaf505786df95a096a4214767f141'
      // });
      // const image = L.layerGroup([imgC, cvacm]);
      // const imgC11 = L.supermap.tiandituTileLayer({
      //   crs: L.CRS.TianDiTu_WGS84,
      //   transparent: true,
      //   opacity: 1,
      //   key: '55d4661b37331450725f6e4c14aeb387'
      // });
      // const cvacm11 = L.supermap.tiandituTileLayer({
      //   isLabel: true,
      //   key: '55d4661b37331450725f6e4c14aeb387'
      // });
      // // 下面这个图层需要选择这个crs: L.CRS.EPSG4326,坐标系
      // const image11 = L.layerGroup([imgC11, cvacm11]);
      // var baseLayers = {
      //   地图: image,
      //   影像: image11
      // };
      this.eventMap = new L.Map('map', {
        crs: L.CRS.EPSG4326,
        maxZoom: 18,
        minZoom: 3,
        zoom: 3,
        zoomSnap: 0.5,
        zoomControl: false, // 这里拒绝缩放
        attributionControl: false // 是否显示右下角的地图介绍
        // layers: [image]
      }).setView([30.01, 109.16653009033203], 3);
      // L.control.layers(baseLayers, {}).addTo(this.eventMap);
      // L.control.scale().addTo(this.eventMap); // 添加比例尺
      // 这里添加缩放
      L.control
        .zoom({
          zoomInTitle: '放大',
          zoomOutTitle: '缩小'
        })
        .addTo(this.eventMap);
      // this.group = L.layerGroup().addTo(this.eventMap);
      // // [imgC, cvacm].forEach(layer => layer.addTo(this.group));

      // [imgC11, cvacm11].forEach(layer => layer.addTo(this.group));

      // 添加国界线、省界线
      const chinaBoundary = L.geoJSON(this.chinaBoundary, {
        style: {
          color: '#f3f3f3',
          fillColor: '#FFFFFF',
          opacity: 0.65,
          weight: 2
        }
      });
      this.eventMap.addLayer(chinaBoundary); // 城市区市分界线
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
      this.RasterLayer.addTo(this.eventMap);
      // 下面是各种图表的添加方式
      this.addMakers();
      // 在地图初始化成功之后添加地震
      this.earthquakeMap = L.layerGroup().addTo(this.eventMap);
      this.initEarthquake();
    },
    addMakers() {
      // L.Polygon([30.01, 109.16653009033203]).bindTooltip('Hi There!').addTo(this.eventMap);
      // var layer = L.Polygon([30.01, 109.16653009033203]).bindTooltip('Hi There!').addTo(this.eventMap);
      // layer.openTooltip();
      // layer.closeTooltip();
      L.marker([30.01, 109.1665]).addTo(this.eventMap);
    },
    createLayers(result) {
      if (!result || !result.features || result.features.length < 1) {
        return;
      }
      const markers = [];
      const pulseIcon = L.icon.pulse({
        iconSize: [12, 12],
        color: '#2f8'
      });
      result.features.map(function (feature) {
        var latLng = L.CRS.EPSG3857.unproject(L.point(feature.geometry.coordinates));
        markers.push(L.marker(latLng, { icon: pulseIcon }));
      });
      L.featureGroup(markers).addTo(this.eventMap);
    },
    initEarthquake() { // 添加应急事件
      const eventTimer = setInterval(() => {
        // eslint-disable-next-line no-undef
        if (window.turf) {
          this.addEarthquakeEvent();
          clearInterval(eventTimer);
        } else {
          console.log('turfnode');
        }
      }, 200);
    },
    changeXYCoords(latlngs) {
      const coords = [];
      latlngs.forEach((item) => {
        coords.push([item[1], item[0]]);
      });
      return coords;
    },
    addEarthquakeEvent() {
      var center = [30.01, 109.1665];
      var radius = 5;
      var options = { steps: 1000, units: 'kilometers', properties: { foo: 'bar' } };
      // eslint-disable-next-line no-undef
      var circle = turf.circle(center, radius, options);
      const coords = this.changeXYCoords(circle.geometry.coordinates[0]);
      console.log(coords, 'coords');
      L.polygon(coords, {
        color: '#9B98FF',
        fillOpacity: 0.4,
        weight: 0.5
      }).addTo(this.eventMap);
      // this.earthquakeMap.addLayer(polygon);
      // L.polygon([
      //   [50.5, 30.5],
      //   [37, 121],
      //   [36.5, 122],
      //   [36.5, 122.2]
      // ], {
      //   color: 'green',
      //   fillColor: '#f03',
      //   fillOpacity: 0.5
      // }).addTo(this.eventMap);
    },
    changeSupermapTileLayer(command) { // 切换底图
      // this.mapYXlyr = L.supermap.tiandituTileLayer({
      //   layerType: 'img',
      //   key: '34baaf505786df95a096a4214767f141',
      //   crs: L.CRS.TianDiTu_WGS84,
      //   transparent: true,
      //   opacity: 1
      // });
      // this.mapZJlyr1 = L.supermap.tiandituTileLayer({
      //   layerType: 'img',
      //   isLabel: true,
      //   key: '34baaf505786df95a096a4214767f141'
      // });
      // this.mapZSlyr = L.supermap.tiandituTileLayer({
      //   key: '34baaf505786df95a096a4214767f141',
      //   crs: L.CRS.TianDiTu_WGS84,
      //   transparent: true,
      //   opacity: 1
      // });
      // this.mapZJlyr2 = L.supermap.tiandituTileLayer({
      //   isLabel: true,
      //   key: '34baaf505786df95a096a4214767f141'
      // });
      // this.RasterLayer = L.layerGroup([this.mapZJlyr1, this.mapYXlyr]);
      // this.ZSMapGroup = L.layerGroup([this.mapZJlyr2, this.mapZSlyr]);
      if (command === 'cityMap') {
        if (this.eventMap.hasLayer(this.RasterLayer)) {
          this.eventMap.removeLayer(this.RasterLayer);
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
          this.ZSMapGroup = L.layerGroup([this.mapZJlyr2, this.mapZSlyr]);
          this.eventMap.addLayer(this.ZSMapGroup);
        }
      } else {
        if (this.eventMap.hasLayer(this.ZSMapGroup)) {
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
          this.eventMap.removeLayer(this.ZSMapGroup);
          this.RasterLayer = L.layerGroup([this.mapZJlyr1, this.mapYXlyr]);
          this.eventMap.addLayer(this.RasterLayer);
        }
      }
    },
    // 下面的没用
    changeEventLegend(command) { // 切换图例
      switch (command) {
        case 'earthquake' : {
          this.earthquake = !this.earthquake;
          this.typhoon = false;
          this.debrisFlow = false;
          break;
        }
        case 'typhoon' : {
          this.typhoon = !this.typhoon;
          this.earthquake = false;
          this.debrisFlow = false;
          break;
        }
        case 'debrisFlow' : {
          this.debrisFlow = !this.debrisFlow;
          this.earthquake = false;
          this.typhoon = false;
          break;
        }
      }
    },
    changeAuxiliaryTool(command) { // 辅助工具
      switch (command) {
        case 'line': {
          this.handleMeasureDis();
          break;
        }
        case 'area': {
          this.handleMeasureArea();
          break;
        }
        case 'clear': {
          const popUp = document.getElementById('tooltip');
          if (popUp.style.visibility !== 'hidden') {
            this.$message({
              type: 'warning',
              message: '绘制未结束'
            });
          } else if (this.eventMap.off('keypress')) {
            this.measureGroup.clearLayers();
            this.hidePopupCont();
            this.changeMousetype(1);
          }
          break;
        }
      }
    },
    // 测距方法开始
    handleMeasureDis() {
      this.points = [];
      this.disArr = [];
      this.startPoint = null;
      this.endPoint = null;
      this.lines = L.polyline(this.points, { color: '#FF6936' });
      this.changeMousetype(0);
      this.eventMap.off('click');
      this.eventMap.off('keypress');
      this.hidePopupCont();
      this.eventMap.on('click', (e) => this.drawLine(e));
      this.eventMap.on('keypress', (e) => this.endLine(e));
    },
    drawLine(e) {
      this.points.push([e.latlng.lat, e.latlng.lng]);
      this.openPopupCont(e.originalEvent.clientY - 120, e.originalEvent.clientX - 100);
      this.lines.addLatLng(e.latlng);
      // 将当前线段以及尺寸标注加到当前地图
      this.endPoint = this.startPoint;
      this.startPoint = L.latLng(e.latlng.lat, e.latlng.lng);
      if (this.startPoint != null && this.endPoint != null) {
        const dis = this.startPoint.distanceTo(this.endPoint);
        this.disArr.push(dis);
        const lat = (this.startPoint.lat + this.endPoint.lat) / 2;
        const lng = (this.startPoint.lng + this.endPoint.lng) / 2;
        L.popup({ closeButton: false }).setLatLng(L.latLng(lat, lng)).setContent(Math.round(dis / 1000) + '千米').openOn(this.eventMap);
      }
      this.measureGroup.addLayer(this.lines);
    },
    endLine(e) {
      this.eventMap.off('click');
      this.changeMousetype(1);
      // 添加Marker并显示总距离
      let totalDis = 0;
      for (let i = 0; i < this.disArr.length; i++) {
        totalDis += this.disArr[i];
      }
      const lat = this.lines.getCenter().lat;
      const lng = this.lines.getCenter().lng;
      this.lines.bindPopup('总距离：' + Math.round(totalDis / 1000) + '千米', { closeButton: false }).openPopup(L.latLng(lat, lng));
      this.eventMap.off('keypress');
      this.hidePopupCont();
    },
    // 打开影藏划线提示
    openPopupCont(X, Y) {
      console.log(X, Y, 'xy');
      const popUp = document.getElementById('tooltip');
      popUp.style.top = X + 'px';
      popUp.style.left = Y + 'px';
      popUp.style.visibility = 'visible';
      popUp.innerHTML = '<p>按回车结束</p>';
    },
    hidePopupCont() {
      const popUp = document.getElementById('tooltip');
      popUp.style.visibility = 'hidden';
    },
    // 修改鼠标样式
    changeMousetype(index) {
      const map = document.getElementById('map');
      switch (index) {
        case 0: {
          map.style.cursor = 'crosshair';
          break;
        }
        case 1: {
          map.style.cursor = 'grab';
          break;
        }
      }
    },
    // 测面方法开始
    handleMeasureArea() {
      this.points = [];
      this.polygon = L.polygon(this.points, { color: '#FF6936', fillColor: '#FF6936', fillOpacity: 0.5 });
      this.changeMousetype(0);
      this.eventMap.off('click');
      this.eventMap.off('keypress');
      this.hidePopupCont();
      this.eventMap.on('click', (e) => this.drawPoly(e));
      this.eventMap.on('keypress', (e) => this.endPoly(e));
    },
    drawPoly(e) {
      this.points.push([e.latlng.lat, e.latlng.lng]);
      this.openPopupCont(e.originalEvent.clientY - 180, e.originalEvent.clientX - 100);
      this.measureGroup.removeLayer(this.polygon);
      this.polygon.addLatLng(e.latlng);
      this.measureGroup.addLayer(this.polygon);
    },
    endPoly(e) {
      this.eventMap.off('click');
      this.changeMousetype(1);
      // eslint-disable-next-line no-undef
      const area = turf.area(this.polygon.toGeoJSON());
      // 在多边形中间生成标注
      // eslint-disable-next-line no-undef
      const center = turf.centroid(this.polygon.toGeoJSON());
      const lat = center.geometry.coordinates[1];
      const lon = center.geometry.coordinates[0];
      // eslint-disable-next-line no-undef
      this.polygon.bindPopup('面积：' + Math.round(area / 1000000) + '平方千米', { closeButton: false }).openPopup(L.latLng(lat, lon));
      this.eventMap.off('keypress');
      this.hidePopupCont();
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
    position: absolute;
    left: 25%;
    top: 30px;
    z-index: 20;
    width: 390px;
    height: 50px;
    background: #fff;
    border-radius: 4px;
    .el-dropdown-link {
      display: inline-block;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .demonstration {
      display: block;
      color: #8492a6;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .damNameColor {
      color: #53b3e3;
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
