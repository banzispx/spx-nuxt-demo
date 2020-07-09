<template>
  <div class="svg_content" v-loading="loading">
    <div class="chart_content" v-if="isShow" :style="{height: svgHeight + 'px'}">
      <div class="tip_text">
        <!-- 横纵坐标名称 河流名称-->
        <p style="margin-top:-25px;font-weight:800;font-size:16px;">{{getRiverName}}</p>
        <p class="tip_text_set tip_text_set_heng">距离(km)</p>
        <p class="tip_text_set tip_text_set_zong tip_text_set_zong_left">高程(m)</p>
        <p class="tip_text_set tip_text_set_zong tip_text_set_zong_right">高程(m)</p>
      </div>
        
      <div class="chart_content_element" ref="showSvgContent">  
        <svg :width="svgWidth" :height="svgHeight" class="svg_content_element">
          <g class="layer" transform="translate(80,20)">
            <polyline :points="polylineData" fill="none" stroke="black" />
            <!-- 河流名称 -->
            <!-- <text class="text_end" :x="chartWidth" :y="scaleBetweenPre">{{getRiverName}}</text> -->
            <!-- 大坝名称 -->
            
            <g v-if="isShowDamIdInfo">
              <g v-for="(item, index) in damIds" :key="'text'+index"> 
                <!-- {{showDamIdInfo.dbid !== item.dbid ? item.dbmc[i-1] : ''}} -->
                <text class="dam_name_text text_middle" v-for="(i) in item.dbmc.length+1" :key="'dam'+i" :x="chartWidth * (item.lat-Xmin) / (Xmax-Xmin)" :y="chartHeight - (chartHeight) * item.lon / Ymax + 10 + (i-1)*20+20">{{showDamIdInfo.dbid !== item.dbid ? item.dbmc[i-1] : ''}}</text>
              </g>
            </g>
            <g v-else>
              <g v-for="(item, index) in damIds" :key="'text'+index"> 
                <!-- {{showDamIdInfo.dbid !== item.dbid ? item.dbmc[i-1] : ''}} -->
                <text class="dam_name_text text_middle" v-for="(i) in item.dbmc.length+1" :key="'dam'+i" :x="chartWidth * (item.lat-Xmin) / (Xmax-Xmin)" :y="chartHeight - (chartHeight) * item.lon / Ymax + 10 + (i-1)*20+20">{{item.dbmc[i-1]}}</text>
              </g>
            </g>
            
            <!-- 坝高,水深 -->
            <!-- 使用stroke-dasharray="3 2"  属性，其中3和2分别表示画的长度和间隙的长度 -->
            <g v-for="i in y0damIds.length-1" :key="'red'+i">
              <g v-if="y0damIds[i].pre.level">
                <path name="三角形" :fill="`${y0damIds[i].damState === '已注册' || y0damIds[i].damState === '已建' ? 'url(#MyGradient)' : trangleInfo.normal.bgColor }`" stroke="transparent" :d="`M${Number.isNaN(y0damIds[i].pre.lat1) ? 0 : y0damIds[i].pre.lat1} ${y0damIds[i].pre.lon1} L${Number.isNaN(y0damIds[i].pre.lat) ? 0 : y0damIds[i].pre.lat} ${y0damIds[i].pre.lon} L${y0damIds[i].lat} ${y0damIds[i].pre.lon} L${y0damIds[i].lat} ${y0damIds[i].lon}  Z`" @mouseover="showInfo(i)" @mouseout="isShowInfo=false">
                </path>
                <defs>
                  <!-- 渐变色纵向 -->
                  <!-- 1. gradientTransform="rotate(90)" 渐变旋转了90度角 -->
                  <!-- 2. x1="0" y1="0" x2="1" y2="1" -->
                  <linearGradient id="MyGradient" gradientTransform="rotate(90)">
                    <stop offset="0%"  :stop-color="trangleInfo.active.bgColor"/>
                    <stop offset="100%" stop-color="rgb(229,248,249)"/>
                  </linearGradient>
                </defs>
                <!-- 三角形 -->
                <line  :x1="Number.isNaN(y0damIds[i].pre.lat) ? 0 : y0damIds[i].pre.lat" :y1="y0damIds[i].pre.lon" :x2="y0damIds[i].lat" :y2="y0damIds[i].pre.lon" :style="`stroke:${y0damIds[i].damState === '已注册' || y0damIds[i].damState === '已建' ? trangleInfo.active.rowColor : trangleInfo.normal.rowColor };stroke-width:1;cursor:pointer;`" :stroke-dasharray="`${y0damIds[i].damState === '已注册' || y0damIds[i].damState === '已建' ? '' : '4 2'}`"/>
                <!-- 横线 -->
                <g v-if="Math.abs(y0damIds[i].pre.lat-y0damIds[i].lat)>58" transform="translate(-16, 0)">
                  <image xlink:href="@/static/waterjson/sjx.png" preserveAspectRatio="none" :x="(y0damIds[i].pre.lat+y0damIds[i].lat)/2" :y="y0damIds[i].pre.lon-14" width="11" height="11"></image>
                  <text class="scale_text text_middle" :x="(y0damIds[i].pre.lat+y0damIds[i].lat)/2 + 26" :y="y0damIds[i].pre.lon-4">
                  {{Number(damIds[i-1].normalWaterLevel).toFixed(0)}}</text>
                </g>
                <!-- 横线上的标记 domination-->
                <!-- damHeight * this.chartHeight / this.Ymax -->
                <line v-if="y0damIds[i].damState === '已注册' || y0damIds[i].damState === '已建'" :x1="y0damIds[i].lat" :y1="y0damIds[i].lon-y0damIds[i].height*chartHeight / Ymax" :x2="y0damIds[i].lat" :y2="y0damIds[i].lon" :style="`stroke:${y0damIds[i].domination === '水利' ? trangleInfo.active.waterColColor : trangleInfo.active.colColor};stroke-width:${damItemWidth};`"/>
                
                <g v-else>
                  <line :x1="y0damIds[i].lat-damItemWidth/2" :y1="y0damIds[i].lon-y0damIds[i].height*chartHeight / Ymax" :x2="y0damIds[i].lat-damItemWidth/2" :y2="y0damIds[i].lon" :style="`stroke:${trangleInfo.normal.colColor};stroke-width:2;`" stroke-dasharray='3 2'/>
                  <line :x1="y0damIds[i].lat+damItemWidth/2-1" :y1="y0damIds[i].lon-y0damIds[i].height*chartHeight / Ymax" :x2="y0damIds[i].lat+damItemWidth/2-1" :y2="y0damIds[i].lon" :style="`stroke:${trangleInfo.normal.colColor};stroke-width:2;`" stroke-dasharray='3 2'/>
                </g>
                <!-- 竖线 -->
              </g>
            </g>

            <!-- 需要特别显示的大坝 -->
            <g v-if="isShowDamIdInfo">
              <!-- 横坐标需要修改偏移量 -->
              <line :x1="showDamIdInfo.lat" y1="-20" :x2="showDamIdInfo.lat" :y2="svgHeight" :style="`stroke:${trangleInfo.normal.rowColor};stroke-width:1;cursor:pointer;`" stroke-dasharray="5 3"/>
              <text class="mark_text" v-for="(i) in showDamIdInfo.dbmc.length+1" :key="'dam'+i" :x="showDamIdInfo.lat" :y="showDamIdInfo.lon+ (i-1)*26+26">{{showDamIdInfo.dbmc[i-1]}}</text>
              <image xlink:href="@/static/waterjson/red.png" preserveAspectRatio="none" :x="showDamIdInfo.lat-22" :y="showDamIdInfo.lon-48" width="44" height="44" @mouseover="showInfo(showDamIdInfoNum)" @mouseout="isShowInfo=false" style="opacity:0.9;"></image>
              <!-- fill-opacity / stroke-opacity 透明度属性 -->
            </g>

            <g class="x axis">
              <line x1="0" :y1="chartHeight+100" :x2="svgWidth" :y2="chartHeight+100" style="stroke:rgb(202, 215, 228);stroke-width:2"/>
              <!-- 刻度 -->
              <g v-if="isShowDamIdInfo">
                <text class="scale_text text_start" v-for="item in 11" :key="'xt' + item" :x="(item-1)*Xmax/10*chartWidth/Xmax" :y="12 + chartHeight + scaleBetweenPre + 100">{{Number(Number(Xmin+(item-1)*(Xmax-Xmin)/10) - showDamIdInfo.damDistance).toFixed(1)}}</text>
              </g>
              <g v-else>
                <text class="scale_text text_start" v-for="item in 11" :key="'xt' + item" :x="(item-1)*Xmax/10*chartWidth/Xmax" :y="12 + chartHeight + scaleBetweenPre + 100">{{Number(Number(Xmin+(item-1)*(Xmax-Xmin)/10)).toFixed(1)}}</text>
              </g>
              <line v-for="item in 11" :key="'xl' + item" :x1="(item-1)*Xmax/10*chartWidth/Xmax" :y1="chartHeight+ 100" :x2="(item-1)*Xmax/10*chartWidth/Xmax" :y2="chartHeight + scaleBetweenPre/2 + 100" :style="`stroke:${scaleColorSmall};stroke-width:${scaleColorSmallWidth}`"/>
              <!-- 坐标轴名称 -->
              <!-- <text class="scale_text" :x="svgWidth-200" :y="svgHeight - 30">直线距离(km)</text> -->
            </g>
          </g>
        </svg>
      </div>

      <svg width="80" :height="svgHeight" class="svg_position svg_fixed_y">
        <g class="layer" transform="translate(80,20)">
          <g class="y axis">
            <!-- 纵坐标为了上面预留长度，刻度为0时实际为10，所以chartHeight+10 -->
            <line x1="0" :y1="-scaleBetweenPre" x2="0" :y2="chartHeight+100" style="stroke:rgb(202, 215, 228);stroke-width:2"/>
            <!-- -100位置新增刻度 -->
            <text class="scale_text" style="text-anchor:end;" :x="-scaleBetweenPre" :y="chartHeight+100">{{-Number(100*Ymax/chartHeight).toFixed(0)}}</text>
            <line :x1="-scaleBetweenPre/2" :y1="chartHeight+100" x2="0" :y2="chartHeight+100" :style="`stroke:${scaleColorSmall};stroke-width:${scaleColorSmallWidth}`"/>
            <!-- 刻度 -->
            <text class="scale_text" style="text-anchor:end;" v-for="item in 4" :key="'t'+item" :x="-scaleBetweenPre" :y="4 + (item-1)*(Ymax/3)*(chartHeight)/Ymax">{{Number(Ymax - Ymax/3*(item-1)).toFixed(0)}}</text>
            <line v-for="item in 4" :key="'l'+item" :x1="-scaleBetweenPre/2" :y1="(item-1)*(Ymax/3)*(chartHeight)/Ymax" x2="0" :y2="(item-1)*(Ymax/3)*(chartHeight)/Ymax" :style="`stroke:${scaleColorSmall};stroke-width:${scaleColorSmallWidth}`"/>
            <!-- 纵坐标名称 -->
            <!-- <text :x="220" :y="300" class="y_rotate scale_text">高程(m)</text> -->
          </g>
        </g>
      </svg>

      <svg width="80" :height="svgHeight" class="svg_fixed_y svg_position_right">
        <g class="layer">
          <g class="y axis" transform="translate(0,20)">
            <!-- 纵坐标为了上面预留长度，刻度为0时实际为10，所以chartHeight+10 -->
            <line x1="0" :y1="-scaleBetweenPre" x2="0" :y2="chartHeight+100" style="stroke:rgb(202, 215, 228);stroke-width:2"/>
            <!-- -100位置新增刻度 -->
            <text class="scale_text" style="text-anchor:start;" :x="scaleBetweenPre" :y="chartHeight+100">{{-Number(100*Ymax/chartHeight).toFixed(0)}}</text>
            <line :x1="scaleBetweenPre/2" :y1="chartHeight+100" x2="0" :y2="chartHeight+100" :style="`stroke:${scaleColorSmall};stroke-width:${scaleColorSmallWidth}`"/>
            <!-- 刻度 -->
            <text class="scale_text" style="text-anchor:start;" v-for="item in 4" :key="'t'+item" :x="scaleBetweenPre" :y="4 + (item-1)*(Ymax/3)*(chartHeight)/Ymax">{{Number(Ymax - Ymax/3*(item-1)).toFixed(0)}}</text>
            <line v-for="item in 4" :key="'l'+item" :x1="scaleBetweenPre/2" :y1="(item-1)*(Ymax/3)*(chartHeight)/Ymax" x2="0" :y2="(item-1)*(Ymax/3)*(chartHeight)/Ymax" :style="`stroke:${scaleColorSmall};stroke-width:${scaleColorSmallWidth}`"/>
            <!-- 纵坐标名称 -->
            <!-- <text :x="-220" :y="350" class="y_rotate_right scale_text">高程(m)</text> -->
          </g>
        </g>
      </svg>
      
    </div>
    <div v-else style="font-weight:800;font-size:16px;">{{getRiverName}} 
      <p style="margin-top:20px;">数据不足,无法绘制剖面图</p>
    </div>
    <div class="dam_info" ref="damInfo" v-show="isShowInfo" :style="`left:${showInfoLeft};top:${showInfoTop}`">
      <p>坝名： {{selectedInfo.damName}}</p>
      <p>坝型： {{selectedInfoDamsInfo.damType}}</p>
      <p>坝高(m)： {{Number(selectedInfoDamsInfo.height).toFixed(2)}}</p>
      <p>坝顶高程： {{selectedInfoDamsInfo.topLevel}}</p>
      <p>正常水位(m)： {{Number(selectedInfoDamsInfo.normalWaterLevel).toFixed(2)}}</p>
      <p>装机：{{selectedInfoDamsInfo.capacity}}</p>
      <p>库容： {{selectedInfoDamsInfo.storage}}</p>
      <p>蓄水时间： </p>
      <p>行业类别： {{selectedInfoDamsInfo.domination}}</p>
      <p v-if="isShowDamIdInfo">大坝距离： {{Number(selectedInfo.lengthToHead/1000 - showDamIdInfo.damDistance).toFixed(1)}}km</p>
      <p v-else>大坝距离： {{Number(selectedInfo.lengthToHead/1000).toFixed(1)}}km</p>
    </div>
  </div>
</template>
<script>
// import {mapActions, mapMutations} from 'vuex';
import * as _ from 'lodash';
// import axios from 'axios';
import { mapActions } from 'vuex';
export default {
  props: ['riverId', 'msg'],
  data() {
    return {
      isShow: false,
      isShowInfo: false,
      showInfoLeft: 100,
      showInfoTop: 0,
      // ids: [300,301,302,361,370,371,401,451,457,502,511,551,552,558,579,601,602,615,640,827,828,829,832,833,834,937,938,1348,2286],
      damIds: [
      ],
      y0damIds: [], // 点坐标从第二个开始
      showDamId: '', // 需要特别显示的大坝id
      showDamIdInfo: {},
      isShowDamIdInfo: false,
      showDamIdInfoNum: '',
      svgWidth: 1400,
      svgHeight: 700,
      chartHeight: 500, // 纵坐标为了上面预留长度，刻度为0时实际为10，所以chartHeight+10，scaleBetweenPre/2
      chartWidth: 1400,
      standardWidth: 1400, // 画布最小长度
      maxRiverLength: 6500, // 画布最大长度
      standardHeight: 5200, // 画布最小高度
      Xmax: 0, // 横坐标最大值
      Xmin: 0, // 横坐标最小值
      Ymax: 0, // 纵坐标最大值
      scaleDistance: 40, // 刻度到坐标轴距离
      scaleLengthSmall: 10, // 刻度小线长度
      scaleColorSmall: 'rgb(202, 215, 228)', // 刻度小线颜色
      scaleColorSmallWidth: 1, // 刻度小线宽度
      scaleBetweenPre: 20, // 纵坐标，横坐标预留长度 （注：为了方便显示完全文字）
      textTranslate: 10, // 提示性文字偏移量
      damItemWidth: 6, // 大坝宽度
      polylineData: '',
      selectedInfo: {
      },
      selectedInfoDamsInfo: {},
      trangleInfo: {
        active: {
          rowColor: 'rgb(60, 174, 235)',
          colColor: 'rgb(255, 0, 0)',
          bgColor: 'rgb(159, 230, 234)',
          waterColColor: 'rgb(78, 175, 78)'
        },
        normal: {
          rowColor: 'rgb(255, 32, 32)',
          colColor: 'rgb(255, 32, 32)',
          bgColor: '#F0F4F7'
        }
      },
      getRiverName: '',
      damAllData: [],
      length: 0,
      riverName: '',
      nullData: false,
      loading: false
    };
  },
  watch: {
    riverId() {
      this.dataload();
    }
  },
  methods: {
    ...mapActions('drawProfile', ['getRiverData', 'getSingleDamData']),
    initData() {
      if (this.nullData) {
        this.isShow = false;
        this.getRiverName = this.riverName;
        return false;
      }
      this.getRiverName = this.riverName;
      this.isShowDamIdInfo = false;
      var arr = [];
      this.damAllData.forEach((i) => {
        arr.push({dbid: String(i.damId), dbmc: i.damName, lat: Number(i.lengthToHead) / 1000, lon: Number(i.damsInfo.baseLevel), height: Number(i.damsInfo.height), normalWaterLevel: i.damsInfo.normalWaterLevel, damState: i.damsInfo.constructState, domination: i.damsInfo.domination});
      });
      this.damIds = arr;
      this.Xmin = 0;
      this.Xmax = this.length / 1000;
      // 设置横坐标固定值
      // this.chartWidth -- this.standardWidth -- this.maxRiverLength
      if (this.Xmax < this.standardWidth) {
        this.Xmax = this.standardWidth;
        this.chartWidth = this.chartWidth;
        this.svgWidth = this.chartWidth + 320;
      } else {
        this.Xmax = this.Xmax;
        this.chartWidth = this.chartWidth * this.Xmax / this.standardWidth;
        this.svgWidth = this.chartWidth + 320;
      }
      // 最大值 y
      this.Ymax = Math.max.apply(Math, this.damIds.map(item => {
        return item.lon;
      }));
      if (this.damAllData[0].damsInfo.height && this.damIds[0].lon) {
        this.Ymax = Number(this.damAllData[0].damsInfo.height) + Number(this.damIds[0].lon);
      }
      this.Ymax = Math.floor(Math.floor(this.Ymax) / 2) * 3;
      // 设置y轴固定值
      // if (this.Ymax < this.standardHeight) {
      //   this.Ymax = this.standardHeight;
      //   this.chartHeight = this.chartHeight;
      //   this.svgHeight = this.chartHeight + 200;
      // } else {
      //   this.Ymax = this.Ymax / 2 * 3;
      //   this.chartHeight = this.Ymax / this.standardHeight * this.chartHeight;
      //   this.svgHeight = this.chartHeight + 200;
      // }
      this.Ymax = this.standardHeight;
      this.chartHeight = this.chartHeight;
      this.svgHeight = this.chartHeight + 200;
      this.isShow = true;

      // this.damIds.sort(this.sortBy('lat', null)); // 降序排列
      // 折线坐标
      var str = '';
      this.y0damIds = [];
      this.y0damIds.push({dbmc: '', lat: 0, lon: this.chartHeight - (this.chartHeight) * (Number(this.damAllData[0].damsInfo.height) + Number(this.damIds[0].lon)) / this.Ymax, height: 0});
      str = str + String(0) + ',' + String(this.chartHeight - (this.chartHeight) * (Number(this.damAllData[0].damsInfo.height) + Number(this.damIds[0].lon)) / this.Ymax) + ' ';
      for (var i = 0; i < this.damIds.length; i++) {
        str = str + String(this.chartWidth * (this.damIds[i].lat - this.Xmin) / (this.Xmax - this.Xmin)) + ',' + String(this.chartHeight - (this.chartHeight) * this.damIds[i].lon / this.Ymax) + ' ';
        // 转换坐标
        this.y0damIds.push({dbid: this.damIds[i].dbid, dbmc: this.damIds[i].dbmc, lat: this.chartWidth * (this.damIds[i].lat - this.Xmin) / (this.Xmax - this.Xmin), lon: this.chartHeight - (this.chartHeight) * this.damIds[i].lon / this.Ymax, height: this.damIds[i].height, normalWaterLevel: this.chartHeight - (this.chartHeight) * this.damIds[i].normalWaterLevel / this.Ymax, damState: this.damIds[i].damState, damDistance: this.damIds[i].lat, domination: this.damIds[i].domination});
      }
      str = str + String(this.chartWidth + 20) + ',' + String(this.chartHeight - (this.chartHeight) * (Number(this.damIds[this.damIds.length - 1].lon)) / this.Ymax);
      this.y0damIds.forEach((item, index) => {
        // 显示大坝信息（标红）
        if (this.showDamId === item.dbid) {
          this.showDamIdInfo = item;
          this.isShowDamIdInfo = true;
          this.showDamIdInfoNum = index;
        }
      });
      for (var j = 1; j < this.y0damIds.length; j++) { // Number(Math.abs(this.y0damIds[j].normalWaterLevel - this.y0damIds[j].lon))
        var pre = this.computePointPre(Number(this.y0damIds[j - 1].lat), Number(this.y0damIds[j - 1].lon), Number(this.y0damIds[j].lat), Number(this.y0damIds[j].lon), Number(this.y0damIds[j].normalWaterLevel - this.y0damIds[j].lon), Number(this.y0damIds[j].normalWaterLevel));
        this.y0damIds[j].pre = pre;
      }
      this.polylineData = str;
    },
    // 求大坝与前一坐标连线的经纬度
    computePointPre(preLat, preLon, curLat, curLon, damHeight, normalLevel) {
      // 根据正常水位确定水位线，要在标签里if, NaN
      var level = true;
      if (Number.isNaN(normalLevel)) {
        level = false;
      } else {
        level = normalLevel;
      }

      var damLon = curLon + damHeight;
      var valLon = damLon;
      var dist = Math.abs(damLon - curLon) / Math.abs(curLon - preLon) * Math.abs(curLat - preLat);
      var valLat = curLat - dist;
      // 预留坐标 lat1 lon1
      var lat1 = valLat;
      var lon1 = valLon;
      if (preLat !== 0 && valLat <= preLat) {
        valLat = preLat + 4;
        lat1 = valLat;
        lon1 = preLon;
      } else if (preLat === 0) {
        valLat = 0;
        lat1 = 0;
      }
      return {
        lat: valLat,
        lon: valLon,
        lat1: lat1,
        lon1: lon1,
        level: level
      };
    },
    // 设置滚动条位置
    setScroll() {
      // 找出显示区显示大坝数量最多的区域，需要确定x轴起点坐标，终点坐标，显示的刻度长度
      // 横坐标范围 0, this.Xmax 总长度this.chartWidth
      // var contentWidth = div.style.width || div.clientWidth || div.offsetWidth || div.scrollWidth;
      var _this = this;
      setTimeout(function () {
        var contentWidth = _this.$refs.showSvgContent.clientWidth;
        // 转换成坐标刻度长度
        var scaleContent = _this.Xmax / _this.chartWidth * contentWidth;
        var singlePart = _this.Xmax / 10; // 以这个为单位查dam数量
        var scaleStageNum = Math.floor(scaleContent / singlePart); // 屏幕宽度跨过几个singlePart
        // 假定范围
        var damNumber = [];
        for (var i = 0; i < 9 - scaleStageNum; i++) {
          var assumeStart = singlePart * i;
          // var assumeLength = scaleContent;
          var assumeEnd = assumeStart + singlePart * scaleStageNum;
          var num = 0; // 在坐标范围内的大坝数量
          _this.y0damIds.forEach((item, index) => {
            // item.lat要在assumeStart，assumeEnd
            if (item.lat >= assumeStart && item.lat <= assumeEnd && index > 0) {
              num++;
            }
          });
          damNumber.push({assumeStart: assumeStart, assumeEnd: assumeEnd, num: num});
        }
        // 找出最大数量
        var scaleMinHeng = Math.max.apply(Math, damNumber.map((item, index) => {
          return item.num;
        }));
        var maxArray = {};
        damNumber.forEach(item => {
          if (item.num === scaleMinHeng) {
            maxArray = item;
            return false;
          }
        });
        _this.$refs.showSvgContent.scrollLeft = maxArray.assumeStart;
      }, 0);
    },
    damSetScroll() {
      var _this = this;
      setTimeout(function () {
        var contentWidth = _this.$refs.showSvgContent.clientWidth;
        if (_this.showDamIdInfo) {
          var scaleContent = _this.Xmax / _this.chartWidth * contentWidth; // 刻度范围
          _this.$refs.showSvgContent.scrollLeft = _this.showDamIdInfo.lat - scaleContent / 2;
        }
      });
    },
    sortBy(attr, rev) {
      if (rev === undefined) {
        rev = 1;
      } else {
        rev = (rev) ? 1 : -1;
      }
      return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      };
    },
    showInfo(i) {
      this.selectedInfo = _.cloneDeep(this.damAllData[i - 1]);
      this.selectedInfoDamsInfo = _.cloneDeep(this.damAllData[i - 1].damsInfo);
      var point = this.getMousePos(event);
      this.showInfoLeft = point.x - 110 + 'px';
      this.showInfoTop = point.y - 100 + 'px';
      this.isShowInfo = true;
    },
    getMousePos(event) {
      var e = event || window.event;
      var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      // var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      var x = e.pageX || e.clientX + scrollX;
      // var y = e.pageY || e.clientY + scrollY;
      var y = e.clientY;
      return { 'x': x, 'y': y };
    },
    async getData() {
      var damAllData = await this.getRiverData(this.riverId).then((res) => {
        return res.data;
      });
      var damList = [];
      var riverTotalLength = 0;
      var riverName = '';
      var nameArray = [];
      await damAllData.forEach((item, index) => {
        if (index === damAllData.length - 1) {
          riverTotalLength = item.sumLength;
        }
        nameArray.push(item.riverName);
        if (item.subDamToRiverList) {
          item.subDamToRiverList.forEach((itemSingle) => {
            itemSingle.lengthToHead = itemSingle.sumToChilRiverHead;
          });
          damList.push(...item.subDamToRiverList);
        }
      });
      riverName = nameArray.join(' - ');
      var nullData = false;
      if (damList.length) {
        nullData = false;
      } else {
        nullData = true;
      }
      this.damAllData = damList;
      this.length = riverTotalLength;
      this.riverName = riverName;
      this.nullData = nullData;
    },
    async getDamData() {
      this.showDamId = this.riverId;
      var damAllData = await this.getSingleDamData(this.riverId).then((res) => {
        return res.data;
      });
      var nullData = false;
      if (damAllData[0].subDamToRiverList.length) {
        nullData = false;
      } else {
        nullData = true;
      }
      this.damAllData = damAllData[0].subDamToRiverList;
      this.length = damAllData[0].length;
      this.riverName = damAllData[0].riverName;
      this.nullData = nullData;
    },
    // 调用函数接口
    async dataload() {
      this.loading = true;
      if (this.msg === '流域') {
        await this.getData();
        // 调用初始数据函数
        this.initData();
        this.loading = false;
        this.setScroll();
      } else if (this.msg === '单坝') {
        await this.getDamData();
        // 调用初始数据函数
        this.initData();
        this.loading = false;
        this.damSetScroll();
      }
    }
  },
  mounted() {
    this.dataload();
  }
};
</script>
<style lang="scss" scoped>
  .svg_content {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    padding-bottom:20px;
    padding-top:40px;
    .chart_content {
      width: 100%;
      min-height: 600px;
      text-align: center;
      position: relative;
      .tip_text{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        .tip_text_set{
          font-size: 12px;
        }
        .tip_text_set_heng{
          position: absolute;
          left: 80%;
          bottom: 20px;
        }
        .tip_text_set_zong{
          position: absolute;
          z-index: 100;
          top: 14%;
        }
        .tip_text_set_zong_left{
          transform: rotate(-90deg);
          left: 0;
        }
        .tip_text_set_zong_right{
          transform: rotate(90deg);
          right: 0;
        }
      }
      .svg_position{
        position:absolute;
        left: 0px;
        top: 0px;
      }
      .svg_position_right{
        position:absolute;
        right:0px;
        top: 0px;
      }
      .chart_content_element{
        position: absolute;
        overflow-x: auto;
        overflow-y: hidden;
        left: 80px;
        top: 0 ;
        bottom: 0px;
        right: 80px; // 右侧坐标轴
      }
      .svg_content_element{
        position:absolute;
        left: -80px;
        top: 0px;
        display: block;
        width: auto;
      }
      .svg_fixed_y{
        background: transparent;
        pointer-events: none;
        background: #F0F4F7;
      }
      circle {
        stroke-width: 5;
        stroke: #f00;
        fill: #ff0;
      }
      circle:hover {
        stroke: #090;
        fill: #fff;
      }
      .y_rotate {
        transform: rotate(-90deg);
        transform-origin: 0 50%;
      }
      .y_rotate_right{
        transform: rotate(90deg);
        transform-origin: 50% 50%;
      }
      .scale_text{
        font-size: 12px;
      }
      .dam_name_text{
        font-size: 8px;
      }
      .mark_text{
        font-size: 16px;
        stroke: rgb(252, 86, 58);
        text-anchor: middle;
      }
      .text_middle{
        text-anchor: middle;
      }
      .text_end{
        text-anchor: end;
      }
      .text_start{
        text-anchor: start;
      }
    }
    .dam_info {
      background: #fff;
      box-shadow: 0px 0px 10px #888888;
      padding: 4px;
      position: absolute;
      z-index: 10000;
      text-align: left;
    }
  }
</style>