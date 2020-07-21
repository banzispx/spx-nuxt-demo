<template>
  <section class="gis">
    <div
      v-show="!showOrNt"
      id="map"
      class="main-childmap"
    />
    <el-button
      type="primary"
      class="auxiliary_tool1"
      @click="damsTotip"
    >
      大坝名称{{ damShow ? '显示' : '隐藏' }}
    </el-button>
  </section>
</template>
<script>
import L from 'leaflet';
import * as _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import chinaBouder from '~/static/geojson/china_bouder.json';
import chinaBoundary from '~/static/geojson/china_boundary.json';
import shuixi from '~/static/geojson/reservetwo.json';
import xingxing from '@/static/images/xingxing.png';
import yellowIcon from '@/static/images/palceIcon/yellow.png';
export default {
  props: {
    parentId: {
      type: String,
      default: ''
    },
    childId: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
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
      damShow: false,
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
      console.log(newValue, 'parentId');
      this.riverChange(newValue);
    },
    childId(newValue) {
      this.childriverChange(newValue);
      console.log(newValue, 'childId');
    }
  },
  mounted() {
    const _this = this;
    _this.init();
  },
  methods: {
    gitNotArr() {
      const shuixiArr = [];
      this.shuixi.features.forEach(item => {
        shuixiArr.push(item.properties.RiverCode);
      });
      // console.log(shuixiArr, 'shuixiArr');
      const arr = [];
      this.requireRiverList.forEach(item => {
        if (shuixiArr.indexOf(item) < 0) {
          arr.push(item);
        }
      });
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
    creatLiuYuFiles() {
      // const arr = [{ riverName: '黄河流域', riverId: 'ADA00000', riverList: ['ADA00000', 'ADA38006', 'ADA80006', 'ADA39006', 'ADA53006', 'ADA84006', 'ADA39306', 'ADA80206', 'ADA53106'] }, { riverName: '长江流域', riverId: 'AFA03000', riverList: ['AFA03000', 'AFG00006', 'AFD00006', 'AFF10006', 'AFE00006', 'AFC00006', 'AFA85006', 'AFAB1006', 'AFAB3006', 'AFA62006', 'AFA70006', 'AFAA5006', 'AFAA0006', 'AFA74006', 'AFA73006', 'AFA81006', 'AFA79006', 'AFA78006', 'AFC17006', 'AFF12006', 'AFD20006', 'AFD19006', 'AFD16006', 'AFF10A06', 'AFG26006', 'AFF10306', 'AFG25006', 'AFE10006', 'AFD13006', 'AFD17006', 'AFF10B06', 'AFE11006', 'AFG29006', 'AFG22006', 'AFE22006', 'AFG18006', 'AFE25006', 'AFE16006', 'AFG23006', 'AFG13006', 'AFC19006', 'AFE23006', 'AFE24006', 'AFC12006', 'AFE12006', 'AFG19006', 'AFA85106', 'AFE15006', 'AFAB1106', 'AFE26006', 'AFE21006', 'AFA85206', 'AFE19006', 'AFE18006', 'AFAA5406', 'AFC13006', 'AFE13006', 'AFE20006', 'AFC11006', 'AFA85306', 'AFE37006', 'BAA11663', 'AFC22006', 'AFE38006', 'AFG31006', 'AFF11006', 'AFF13006', 'AFF12A06', 'AFF12306', 'AFC17406', 'AFF12106', 'AFD19306', 'AFD16506', 'AFC17H06', 'AFF12506', 'AFC17806', 'AFD20306', 'AFC11306', 'AFC17F06', 'AFD16106', 'AFG25206', 'AFD17106', 'AFE16106', 'AFD20106', 'AFC17606', 'AFE11206', 'AFC17G06', 'AFC11106', 'AFC17706', 'AFC17B06', 'AFC17906', 'AFC17D06', 'AFC17A06', 'AFE24106', 'AFC17C06', 'AFE25106', 'AFG25706', 'AFC12106', 'AFE16206', 'BAA11662', 'AFF10B46', 'AFE19106', 'AFG25306', 'BAA11656', 'BAA11655', 'BAA11653', 'AFF13106', 'AFF13206', 'AFC17H46', 'AFD20316', 'AFF12116', 'AFC17H56', 'AFC17H16', 'BAA11657', 'AFC17C16', 'AFC17H66', 'BAA11664', 'AFC17F16', 'BAA11659'] }, { riverName: '金沙江流域', riverId: 'AFA02006', riverList: ['AFA02006', 'AFB00006', 'AFA58006', 'AFA53006', 'AFA61006', 'AFA40006', 'AFA35006', 'AFA56006', 'AFA31006', 'AFA57006', 'AFA59006', 'AFA39006', 'AFA36006', 'AFA33006', 'BAA11658', 'AFA50006', 'AFA54006', 'AFA41006', 'AFA55006', 'AFB19006', 'AFB23006', 'AFB26006', 'AFA35206', 'AFB22006', 'AFA61106', 'AFB38006', 'AFA35106', 'AFB24006', 'AFA40406', 'AFA53206', 'AFB23106', 'AFB24106', 'AFB23126'] }, { riverName: '雅鲁藏布江流域', riverId: 'AJD00001', riverList: ['AJD00001', 'AJD29006', 'AJD38006', 'AJD39006', 'AJD39306', 'AJD38306', 'AJD38406'] }, { riverName: '怒江流域', riverId: 'AJC00001', riverList: ['AJC00001', 'AJC19006', 'AJC2B006', 'AJC2Q006', 'BAA11695'] }, { riverName: '澜沧江流域', riverId: 'AJB00001', riverList: ['AJB00001', 'AJB10006', 'AJB24006', 'AJB18006', 'AJB28006', 'AJB25006', 'AJB24106'] }, { riverName: '塔里木河流域', riverId: 'AKL10002', riverList: ['AKL10002', 'AKL10406', 'AKL10206', 'AKL10106', 'AKL10506', 'AKL10306', 'AKL10426', 'AKL10316', 'AKL10126', 'AKL10216'] }, { riverName: '鸭绿江流域', riverId: 'ABD00000', riverList: ['ABD00000', 'ABD12006', 'ABD13006'] }, { riverName: '乌伦古河流域', riverId: 'AKK10002', riverList: ['AKK10002'] }, { riverName: '南盘江流域', riverId: 'AHA00006', riverList: ['AHA00006', 'AHA22006', 'AHA20006', 'AHA20106', 'AHA22306', 'AHA22906'] }, { riverName: '额尔齐斯河流域', riverId: 'AJG00001', riverList: ['AJG00001', 'AJG12006', 'AJG11006', 'AJG14006', 'AJG12106'] }, { riverName: '赣江流域', riverId: 'AFH10006', riverList: ['AFH10006', 'AFH10606', 'AFH10E06', 'AFH10406', 'AFH10706', 'AFH10B06', 'AFH10716', 'AFH10B26'] }, { riverName: '开都河流域', riverId: 'AKL26002', riverList: ['AKL26002'] }, { riverName: '红水河流域', riverId: 'AHA01006', riverList: ['AHA01006', 'AHA24006', 'AHA24106'] }, { riverName: '淮河流域', riverId: 'AEA00006', riverList: ['AEA00006', 'AEA22006', 'AEA22206'] }, { riverName: '狮泉河流域', riverId: 'AJE00001', riverList: ['AJE00001', 'AJE20106'] }, { riverName: '李仙江流域', riverId: 'AJA16001', riverList: ['AJA16001', 'AJA16206', 'AJA16216'] }, { riverName: '东江流域', riverId: 'AHC01006', riverList: ['AHC01006', 'AHC12006', 'AHC16006', 'BAA11707', 'BAA11703'] }, { riverName: '元江流域', riverId: 'AJA01001', riverList: ['AJA01001'] }, { riverName: '抚河流域', riverId: 'AFH11006', riverList: ['AFH11006', 'AFH11106'] }, { riverName: '讨赖河流域', riverId: 'AKH13106', riverList: ['AKH13106'] }, { riverName: '修水流域', riverId: 'AFH14006', riverList: ['AFH14006', 'AFH14306', 'AFH14106', 'AFH14316', 'AFH14326'] }, { riverName: '黑河流域', riverId: 'AKH13002', riverList: ['AKH13002'] }, { riverName: '南汀河流域', riverId: 'AJC28001', riverList: ['AJC28001', 'AJC28106'] }, { riverName: '滦河流域', riverId: 'ACA00000', riverList: ['ACA00000'] }, { riverName: '闽江流域', riverId: 'AGC00000', riverList: ['AGC00000', 'AGC11006', 'AGC16006', 'AGC13006', 'AGC12006', 'AGC10006', 'AGC14006', 'BAA11679', 'AGC11106', 'AGC12106', 'AGC12606', 'AGC16106'] }, { riverName: '西江流域', riverId: 'AHA04006', riverList: ['AHA04006', 'AHA53006', 'AHA52006'] }, { riverName: '盘龙河流域', riverId: 'AJA14001', riverList: ['AJA14001'] }, { riverName: '昌化江流域', riverId: 'AHF61000', riverList: ['AHF61000'] }, { riverName: '飞云江流域', riverId: 'AGD12000', riverList: ['AGD12000', 'AGD12606'] }, { riverName: '独龙江流域', riverId: 'AJC50001', riverList: ['AJC50001', 'AJC52001', 'AJC56006'] }, { riverName: '浔江流域', riverId: 'AHA03006', riverList: ['AHA03006', 'AHA42006', 'AHA41006', 'AHA40006', 'AHA42A06', 'AHA39006', 'AHA42106'] }, { riverName: '韩江流域', riverId: 'AHE01000', riverList: ['AHE01000', 'AHE13006', 'AHE00006', 'AHE12006'] }, { riverName: '藤条江流域', riverId: 'AJA16401', riverList: ['AJA16401'] }, { riverName: '万泉河流域', riverId: 'AHF62000', riverList: ['AHF62000'] }, { riverName: '敖江流域', riverId: 'BAA11687', riverList: ['BAA11687'] }, { riverName: '黔江流域', riverId: 'AHA02006', riverList: ['AHA02006', 'AHA37006', 'AHA37B06', 'AHA36006', 'AHA37B56', 'BAA11667'] }, { riverName: '霍童溪流域', riverId: 'AGD43000', riverList: ['AGD43000', 'AGD43106', 'BAA11676', 'BAA11678'] }, { riverName: '虎门水道流域', riverId: 'AHD08000', riverList: ['AHD08000', 'AHD30206', 'AHD30006', 'BAA11701'] }, { riverName: '木兰溪流域', riverId: 'AGD49000', riverList: ['AGD49000'] }, { riverName: '螺河流域', riverId: 'AHF14000', riverList: ['AHF14000'] }, { riverName: '瓯江流域', riverId: 'AGB03000', riverList: ['AGB03000', 'AGB22006', 'AGB02006', 'AGB01006', 'AGB19006', 'AGB22306', 'AGB16006', 'BAA11675'] }, { riverName: '海河流域', riverId: 'ACD01000', riverList: ['ACD01000', 'ACB13003', 'ACE13006', 'ACE10006', 'ACE10806', 'ACE10506'] }, { riverName: '孔雀河流域', riverId: 'AKL27002', riverList: ['AKL27002'] }, { riverName: '钱塘江流域', riverId: 'AGA06000', riverList: ['AGA06000', 'AGA21006', 'AGA04006', 'AGA03006', 'AGA24206', 'AGA13006', 'AGA24106', 'AGA24116'] }, { riverName: '交溪流域', riverId: 'AGD42000', riverList: ['AGD42000', 'AGD42406', 'BAA11196'] }, { riverName: '漳江流域', riverId: 'AGD57000', riverList: ['AGD57000'] }, { riverName: '九龙江流域', riverId: 'AGD55000', riverList: ['AGD55000', 'AGD55106', 'AGD55206', 'AGD551D6', 'AGD55116', 'BAA11680'] }, { riverName: '瑞丽江流域', riverId: 'AJC55001', riverList: ['AJC55001', 'AJC54006', 'AJC54106'] }, { riverName: '龙江流域', riverId: 'AGD46000', riverList: ['AGD46000'] }, { riverName: '晋江流域', riverId: 'AGD52000', riverList: ['AGD52000', 'AGD52106'] }, { riverName: '椒江流域', riverId: 'AGD11000', riverList: ['AGD11000', 'AGD11306', 'AGD11206'] }];
      // arr.forEach(item => {
      //   const riverList = item.riverList;
      //   const features = this.shuixi.features.filter(item => {
      //     return riverList.indexOf(item.properties.RiverCode) >= 0;
      //     // return arr[0] === item.properties.RiverId;
      //   });
      //   var content = JSON.stringify(features);

      //   var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

      //   FileSaver.saveAs(blob, `${item.riverName}.json`);
      // });
      // 下面是翻转大坝的
      // const arr = ['AJB28006'];
      // const featuresArr = _.cloneDeep(this.shuixi);
      // featuresArr.features.forEach((item, index) => {
      //   if (arr.indexOf(item.properties.RiverCode) >= 0) {
      //     featuresArr.features[index].geometry.coordinates.reverse();
      //   }
      // });
      // var content = JSON.stringify(featuresArr);

      // var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

      // FileSaver.saveAs(blob, 'reservetwo.json');
    },
    init() {
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
      // 下面是各种图表的添加方式
      this.getAllRiver();
    },
    // 添加河流大坝
    addDamMaker(damList) {
      damList.forEach(item => {
        // 过滤大坝名字
        // const name = this.filterDamName(item.damName);
        var yellow = L.icon({
          iconUrl: yellowIcon,
          iconSize: [13, 15]
        });
        var xing = L.icon({
          iconUrl: xingxing,
          iconSize: [13, 15]
        });
        const icon = item.damsInfo.registerStatus * 1 !== 1 ? yellow : xing;
        L.marker([item.latitude, item.longitude], { icon: icon }).addTo(this.earthquakeMap).bindTooltip(item.damName, { permanent: !this.damShow });
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
      // 设置黄河为默认的值
      // const { root, child } = this.$route.query;
      // if (root) {
      //   this.value = root;
      //   this.riverChange(root);
      //   this.childriverChange([child]);
      //   this.childvalue = [child];
      // } else {
      //   this.value = 'ADA00000';
      //   this.riverChange('ADA00000');
      //   this.childriverChange(['ADA00000']);
      //   this.childvalue = ['ADA00000'];
      //   // this.value = 'AFA03000';
      //   // this.riverChange('AFA03000');
      //   // this.childriverChange('AFC17F16');
      //   // this.childvalue = 'AFC17F16';
      // }
    },
    riverChange(event) {
      this.riversLayer.clearLayers();
      this.addLine.clearLayers();
      this.earthquakeMap.clearLayers();
      this.lineLayer.clearLayers();
      this.childvalue = [];
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
    childriverChange(riverIdArr) {
      // 清除大坝坐标
      this.earthquakeMap.clearLayers();
      this.addLine.clearLayers();
      this.lineLayer.clearLayers();
      // console.log(riverIdArr, 'riverIdArr');
      for (let index = 0; index < riverIdArr.length; index++) {
        const element = riverIdArr[index];
        // 选取第一个作为泼面图的数据
        if (index === 0) {
          this.$axios
            .post(
              '/riverinstance/basin.getRiverChildToHead',
              '"' + element + '"'
            )
            .then(res => {
              if (res.status === 200) {
                this.riverData = _.cloneDeep(res.data);
              }
            });
        }

        const damList = this.riverChild.filter(item => {
          return item.riverId === element;
        });
        this.drawCheckLine(damList[0].riverId);
      }
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
            // this.riverData = _.cloneDeep(res.data);
            const arr = [];
            const newArr = [];
            let riverAndchildDams = [];
            _.cloneDeep(res.data).reverse().forEach(item => {
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
          }
        });
    },
    // 通过给出的支流arr画出线
    dealchildRiverArr(toarr) {
      // 传入数组，返回红色和黄色的featureqing
      // this.lineLayer.clearLayers();
      const { redFeature } = this.getRedYellowFeatureByArr([...toarr].reverse());

      const riverLevelColors = ['#8b0000', '#B22222', '#ff0000', '#ff6600', '#ff9999', '#ff99ff', '#ffcccc', '#ffccff'];
      // const riverLevelColors = ['#80000', '#8b0000', '#52a2a2', '#b22222', '#FF69B4', '#FFC0C8'];
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
      // this.addlineByfeature(yellowFeature);
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
      this.riversLayer.clearLayers();
      arr.forEach(item => {
        const featute = this.gitFeatureByRiverId(item.riverId);
        const liuyu = {
          type: 'FeatureCollection',
          features: [featute]
        };
        const waterBoundary = L.geoJSON(liuyu, {
          style: {
            // color: riverLevelColors[item.riverLevel * 1 - 1],
            color: '#459df5',
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
      this.childvalue = [riverId];
      this.childriverChange([riverId]);
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
