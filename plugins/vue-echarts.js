import Vue from 'vue';
import ECharts from 'vue-echarts';
// 这里需要按需引入echart的包
// import 'echarts/lib/chart/line';
import 'echarts';
Vue.component('chart', ECharts);
