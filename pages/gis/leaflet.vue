<template>
  <section class="gisStyle">
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
    <!-- <chart
      style="width:100%"
      :options="echartOptions"
      :auto-resize="true"
    /> -->
    <!-- 弹出框 -->
    <div :style="popoverPosition">
      <el-popover
        v-model="isShow"
        popper-class="showSingleDamInfo"
        width="380"
        trigger="manual"
        lock-scroll="true"
        transition="fade-in-linear"
      >
        <div
          v-loading="showSingleDam"
        >
          <div
            class="deletePopover"
            @click="isShow = false"
          >
            x
          </div>
          <chart
            style="width:350px"
            :options="echartOptions"
            :auto-resize="true"
          />
        </div>
      </el-popover>
    </div>
  </section>
</template>
<script>
import chinaBouder from '~/static/geojson/china_bouder.json';
import chinaBoundary from '~/static/geojson/china_boundary.json';
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
      echartOptions: {},
      chinaBoundary: chinaBoundary,
      chinaBouder: chinaBouder,
      mapYXlyr: {},
      mapZSlyr: {},
      mapZJlyr1: {},
      mapZJlyr2: {},
      measureGroup: {},
      popoverPosition: null,
      isShow: false,
      showSingleDam: false
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
      if (!this.eventMap) {
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
      }
      this.eventMap.on({
        click: () => {
          console.log('map click');
          this.isShow = false;
        }
      });
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

      this.earthquakeMap = L.layerGroup().addTo(this.eventMap);
      // 下面是各种图表的添加方式
      this.addMakers();
      // 在地图初始化成功之后添加地震
      this.initEarthquake();
    },
    addMakers() {
      var icon = L.icon({
        iconUrl: yellowIcon,
        iconSize: [13, 15]
      });
      const marker = L.marker([30.01, 109.1665], { icon: icon }).addTo(this.earthquakeMap).bindTooltip('图表名称', { permanent: true });
      marker.on({
        click: this.dealIconClick
      });
    },
    // 处理图表的点击事件
    dealIconClick(e) { // 显示单个大坝信息
      this.isShow = true;
      this.showSingleDam = true;
      const containerWidth = document.body.clientWidth - 143;
      if (e.containerPoint.x + 380 > containerWidth && e.containerPoint.y + 300 < 664) {
        this.popoverPosition = `position:absolute;left:${e.containerPoint.x + 380}px;top:${e.containerPoint.y}px`;
      } else if (e.containerPoint.x + 380 < containerWidth && e.containerPoint.y + 300 > 664) {
        this.popoverPosition = `position:absolute;left:${e.containerPoint.x + 200}px;top:${e.containerPoint.y - 300}px`;
      } else if (e.containerPoint.x + 380 > containerWidth && e.containerPoint.y + 300 > 664) {
        this.popoverPosition = `position:absolute;left:${e.containerPoint.x + 380}px;top:${e.containerPoint.y - 300}px`;
      } else {
        this.popoverPosition = `position:absolute;left:${e.containerPoint.x + 200}px;top:${e.containerPoint.y}px`;
      }
      setTimeout(() => {
        this.showSingleDam = false;
        this.echartOptions = {
          title: {
            text: '折线图堆叠'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '视频广告',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: '直接访问',
              type: 'line',
              stack: '总量',
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: '搜索引擎',
              type: 'line',
              stack: '总量',
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        };
      }, 1000);
      // this.getSingleDamInfo(damId).then((res) => {
      //   this.showSingleDam = false;
      //   const { data } = res;
      //   this.singleDamInfo = data;
      //   this.singleDamImages = this.singleDamInfo.hydropowerStation.baseImg || this.singleDamInfo.hydropowerStation.imageUrl || this.singleDamInfo.hydropowerStation.images[0];
      // });
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
    // 添加地震图标
    addEarthquakeEvent() {
      const center = [103.82, 33.2];
      // 设置每个环形圈到圆心的距离
      const disArr = [1, 15, 40, 80, 100, 150];
      const colorArr = ['#F4FB1A', '#F7C50C', '#F68F11', '#FE2502'];
      var options = { steps: 100, units: 'kilometers', properties: { foo: 'bar' } };
      let upCircle = null;
      for (let index = 0; index < disArr.length; index++) {
        const item = disArr[index];
        // eslint-disable-next-line no-undef
        const polygonCircle = turf.circle(center, item, options);
        // console.log(polygonCircle, 'polygonCircle');
        const polygonCircleArr = this.changeXYCoords(polygonCircle.geometry.coordinates[0]);
        if (index === 0) {
          L.polygon([polygonCircleArr], {
            color: colorArr[index],
            fillOpacity: 1,
            weight: 0.5
          }).addTo(this.earthquakeMap);
        } else {
          L.polygon([polygonCircleArr, upCircle], {
            color: colorArr[index],
            fillOpacity: 0.5,
            weight: 0.5
          }).addTo(this.earthquakeMap);
        }
        upCircle = polygonCircleArr;
      }

      // // eslint-disable-next-line no-undef
      // const circle = turf.circle(center, 3, options);
      // const coords = this.changeXYCoords(circle.geometry.coordinates[0]);
      // // console.log(coords);
      // // eslint-disable-next-line no-undef
      // const sedarr = turf.circle(center, 15, options);
      // const second = this.changeXYCoords(sedarr.geometry.coordinates[0]);
      // // 这样添加的是一个环形
      // L.polygon([second, coords], {
      //   color: '#000fff',
      //   fillOpacity: 1,
      //   weight: 0.5
      // }).addTo(this.earthquakeMap);
    },
    changeXYCoords(latlngs) {
      const coords = [];
      latlngs.forEach((item) => {
        coords.push([item[1], item[0]]);
      });
      return coords;
    },
    changeSupermapTileLayer(command) { // 切换底图
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
.gisStyle {
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
