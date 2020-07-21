<template>
  <section class="gis">
    <!-- <div
      v-show="!showOrNt"
      id="map"
      class="main-map"
    /> -->
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
        multiple
        placeholder="请选择支流"
        @change="childriverChange"
      >
        <el-option
          v-for="(item, index) in riverChildArr"
          :key="item.name + index"
          :label="item.name"
          :value="item.riverId"
        />
      </el-select>
    </div>
    <!-- <el-button
      type="primary"
      class="auxiliary_tool2"
      @click="togle"
    >
      切换
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
    </div> -->
    <drawing-profile
      :parent-id="value"
      :child-id="childvalue"
    />
  </section>
</template>
<script>
// import FileSaver from 'file-saver';
import drawingProfile from '@/components/drawingProfile/riverMap';
import L from 'leaflet';
import * as _ from 'lodash';
import 'leaflet/dist/leaflet.css';
import chinaBouder from '~/static/geojson/china_bouder.json';
import chinaBoundary from '~/static/geojson/china_boundary.json';
// import shuixi from '~/static/geojson/shuixi.json';
import shuixi from '~/static/geojson/reservetwo.json';
export default {
  layout: 'none',
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
  components: {
    drawingProfile
  },
  data() {
    return {
      requireRiverList: ['AFD20316', 'AFD20306', 'AFD20006', 'AFD00006', 'AFA03000', 'AGA03006', 'AGC12606', 'AFA54006', 'AHC16006', 'AFG00006', 'AHA01006', 'AJB24006', 'AFAA5406', 'AEA00006', 'AFG25706', 'AHA20106', 'AGB01006', 'AJG12006', 'AFG18006', 'AGD12000', 'AHA42A06', 'AFB38006', 'AHC01006', 'AFA35106', 'AJA16001', 'AFA85106', 'BAA11680', 'AFG23006', 'AGC10006', 'AHF61000', 'BAA11663', 'AFE38006', 'BAA11655', 'BAA11656', 'BAA11695', 'AFE37006', 'AFG31006', 'AFE19106', 'AJD38306', 'AGA06000', 'BAA11679', 'BAA11653', 'AFH10B26', 'ADA00000', 'AGC16006', 'AJF11001', 'AFF12006', 'AJF11106', 'AFC00006', 'AFH12006', 'AFF10A06', 'AFC17406', 'AFH10706', 'AJD00001', 'AJC00001', 'AHA42006', 'AFH10006', 'AFF12A06', 'ABD00000', 'AJC19006', 'AFC17006', 'AFF13006', 'AFB23006', 'ADA39006', 'AJB10006', 'AKK10002', 'AAB00006', 'AKL10106', 'AHD30006', 'ADA39306', 'AJB00001', 'AFA85006', 'AFG29006', 'AAB21006', 'AFG22006', 'AGC11006', 'ADA38006', 'AJF11126', 'AGC11106', 'AFG26006', 'AFB22006', 'AFH10E06', 'AJC54006', 'BAA11701', 'AHE00006', 'AJE00001', 'AFF11006', 'AFA35206', 'AKL10306', 'AFA40006', 'BAA11703', 'AFH11006', 'AAB11006', 'AFB19006', 'AHA04006', 'AHA03006', 'AFD19306', 'AAB10C06', 'AKL10126', 'AJA01001', 'AGB22006', 'AHA53006', 'AFE22006', 'AJC50001', 'AKL26002', 'AJD29006', 'ADA53006', 'AAA00001', 'AFG25206', 'AFA31006', 'AFF10B06', 'AGD42406', 'AFF12506', 'AJG11006', 'AFAA5006', 'AFF10306', 'AFB24006', 'AJD39006', 'AFH10716', 'AJG14006', 'AFF12306', 'ADA80006', 'AGD551D6', 'AHA22906', 'AJC52001', 'AFA74006', 'AGD43000', 'BAA11687', 'AFD16506', 'AGD42106', 'AHA20006', 'ACE10006', 'AFA81006', 'AHE01000', 'AFG25306', 'AFE23006', 'AGD52106', 'AJA14001', 'AFB26006', 'AGD55116', 'AJD38006', 'AHA02006', 'AHB18006', 'AFH14106', 'AJG12106', 'AGD49000', 'AKL10406', 'AFH14306', 'AFE10006', 'AFAB1006', 'ABD14006', 'AFA79006', 'AFG19006', 'AFA36006', 'AFC17606', 'AGB16006', 'AFA33006', 'BAA11196', 'AFD17006', 'AGD55106', 'AFD13006', 'AAA13006', 'AFA70006', 'AFE12006', 'AJC2B006', 'AFH14316', 'AFD20306', 'AFE20006', 'AHB20006', 'AFE11006', 'AJF11306', 'AFA39006', 'AJA16206', 'ADA53106', 'AJC28001', 'AFB23106', 'AFC19006', 'AJB28006', 'AFA78006', 'AFA85206', 'AFC17A06', 'AGD57000', 'AGB22306', 'ABD13006', 'AHF62000', 'AKL10506', 'AFC17706', 'AFAA2006', 'AFA62006', 'AGA21006', 'AGC00000', 'AGD46000', 'AFA85306', 'AAB11106', 'AFC12006', 'AJB25006', 'AFF10B46', 'AJC54106', 'AFA73006', 'ADA84006', 'AGD55000', 'AFC17B06', 'AHF14000', 'AAB11206', 'AGB19006', 'ACB13003', 'ADA80206', 'AGC16106', 'AGD42000', 'AFA61106', 'AGD55206', 'AFC17C06', 'AFC17D06', 'AFC17G06', 'AFE16006', 'AKL10206', 'AGD11206', 'AEA22006', 'AFA57006', 'AGA24006', 'AHA36006', 'ACE13006', 'ACE10806', 'AFC17806', 'AJC56006', 'AHA22306', 'ACA00000', 'BAA11669', 'AHC12006', 'AFE13006', 'AFA56006', 'AFH14326', 'AFA41006', 'AFE26006', 'AHA41006', 'AGC12006', 'AKH13106', 'BAA11676', 'AFA50006', 'AKH13002', 'AFA22006', 'AFB24106', 'AFC17F06', 'AGA05006', 'AFC11306', 'AHB16006', 'AHA24106', 'AFC11106', 'AFE11206', 'AGC14006', 'AEA17006', 'AJB24106', 'AGC12106', 'AFE18006', 'AJC28106', 'AGB03000', 'ACE10506', 'BAA11678', 'AFE25106', 'AJC2Q006', 'BAA11690', 'AFA53206', 'AKL27002', 'AGD11306', 'AJA16216', 'ACD01000', 'AFC12106', 'AFC17906', 'AFE24106', 'AFC22006', 'BAA11659', 'AKL10316', 'ABD12006', 'AJB18006', 'AFAB3006', 'AAB10906', 'AFD16006', 'AFA35006', 'AFD19006', 'AJD39306', 'AHA52006', 'AAB11306', 'AFA58006', 'AFE21006', 'AFF12106', 'AFA53006', 'AHB15006', 'AHA37B56', 'AFE15006', 'AGD43106', 'AFD00006', 'AJG00001', 'AFH14006', 'AFA01006', 'AFA02006', 'AFB00006', 'AFE00006', 'AHE13006', 'AFD20006', 'AHA00006', 'AHA40006', 'AFF10006', 'AGC13006', 'AAB10506', 'AHA22006', 'AAA32006', 'AJA16401', 'AKL10216', 'AFG31206', 'AHA37006', 'AFE25006', 'AGB02006', 'AFE16106', 'AFA40406', 'AGD12606', 'AFD17106', 'AGA24206', 'AFA03000', 'AGD11000', 'AFH10B06', 'AHA24006', 'BAA11658', 'AGA04006', 'AFG25006', 'AFG13006', 'AHA37B06', 'ACB13106', 'AFC17H06', 'AFD16106', 'BAA11675', 'AFA59006', 'AAA18006', 'AJD38406', 'AFH10406', 'AFH10606', 'BAA11707', 'AHE12006', 'AFE24006', 'AFH11106', 'AKL10426', 'AAA19006', 'AFA55006', 'AFE19006', 'AFC11006', 'AEA22206', 'BAA11662', 'AAB10006', 'AFC13006', 'AFD20106', 'AFE16206', 'AHB01006', 'AGD52000', 'AFA61006', 'AJE20106', 'AFAA0006', 'AKL10002', 'AFAB1106', 'AJC55001', 'AHD30206', 'AHD08000', 'BAA11664', 'AFC17H16', 'AFF13106', 'AFF13206', 'BAA11706', 'AGA13006', 'AAB10C26', 'AHA42106', 'AHA39006', 'AAB11216', 'AFC17H46', 'AFC17H66', 'AGA24116', 'AFF12116', 'BAA11667', 'AFC17C16', 'AFC17F16', 'AGA24106', 'AFC17H56', 'AFD20316', 'BAA11657', 'AFB23126'],
      riverData: [],
      showOrNt: false,
      riverId: 'ADA00000',
      drawingData: '流域',
      childvalue: [],
      riverChildArr: [],
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
    this.getAllRiver();
  },
  methods: {
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
      const { root, child } = this.$route.query;
      if (root) {
        this.value = root;
        this.riverChange(root);
        this.childriverChange(child);
        this.childvalue = [child];
      } else {
        this.value = 'ADA00000';
        this.riverChange('ADA00000');
        this.childriverChange('ADA00000');
        this.childvalue = ['ADA00000'];
      }
    },
    riverChange(event) {
      this.value = event;
      this.childvalue = [event];
      // // 获取有大坝的支流
      this.getHasDamByRiverId(event);
    },
    // 处理支流的改变
    childriverChange(riverId) {
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
              console.log(44555);
              // oldfeatures[1] = _.cloneDeep(childFeature[0]);
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
    // 通过给定的数组画出不同颜色的线段 测试函数
    drawArrLineWithDifColors(arr) {
      const colors = ['black', 'blue', 'purple', 'white', 'red', 'black', 'blue', 'purple', 'white'];
      this.lineLayer.clearLayers();
      arr.forEach((item, index) => {
        const featute = this.gitFeatureByRiverId(item);
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
          color: 'yellow',
          fillColor: '#ffffff',
          opacity: 0.65,
          weight: 2
        }
      });
      this.addLine.addLayer(lineBoundary);
    },
    // 根据河流Id获取有大坝的支流的ID
    getHasDamByRiverId(riverId) {
      const river = this.riversArr.filter(item => {
        return item.riverId === riverId;
      });
      const arr = [];
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

      this.riverChildArr = arr;
      this.childvalue = [riverId];
      // this.childriverChange(riverId);
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
  .main-map {
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
