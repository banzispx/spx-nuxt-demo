<template>
  <div
    class="side-bg"
    :style="`background-size: 256px ${containerHeight}px;height: ${containerHeight}px`"
  >
    <el-scrollbar
      view-class="nav-left"
      :style="`height: ${containerHeight}px`"
    >
      <el-menu
        :default-active="defaultIndex"
        class="nav"
        unique-opened
        background-color="transparent"
        text-color="#fff"
      >
        <template v-for="(item, index) in navTitle">
          <el-submenu
            v-if="item.children"
            :key="index"
            :index="`${index}`"
          >
            <template slot="title">
              <i
                class="iconfont d-inline-block width-2 text-white"
                :class="item.icon"
              />
              <span slot="title">{{ item.title }}</span>
            </template>
            <div
              v-for="(sub, subIndex) in item.children"
              :key="`${index}-${subIndex}`"
            >
              <el-menu-item
                v-if="!sub.children"
                :key="`${index}-${subIndex}`"
                :index="`${index}-${subIndex}`"
                :disabled="!sub.hasAuth"
                @click="changeMenu(sub)"
              >
                <template slot="title">
                  {{ sub.title }}
                </template>
              </el-menu-item>
              <el-submenu
                v-else
                :index="`${index}-${subIndex}`"
              >
                <template slot="title">
                  {{ sub.title }}
                </template>
                <div v-if="sub.children">
                  <el-menu-item
                    v-for="(child, childIndex) in sub.children"
                    :key="childIndex"
                    :index="`${index}-${subIndex}-${childIndex}`"
                    @click="changeMenu(child)"
                  >
                    {{ child.title }}
                  </el-menu-item>
                </div>
              </el-submenu>
            </div>
          </el-submenu>
          <el-menu-item
            v-else
            v-show="!item.hidden"
            :key="index"
            :index="`${index}`"
            :disabled="!item.hasAuth"
            @click="changeMenu(item)"
          >
            <i
              class="iconfont d-inline-block width-2 text-white"
              :class="item.icon"
            />
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { recursion } from '~/utils/untils';
import _ from 'lodash';

export default {
  data() {
    return {
      navTitle: [
        {
          path: '/',
          key: '0',
          title: '首页',
          icon: 'icon-jiance',
          hasAuth: true,
          hidden: false
        },
        {
          path: '',
          key: '1',
          title: 'SVG',
          icon: 'icon-dabaxinxi',
          hasAuth: true,
          hidden: false,
          children: [
            {
              path: '/svg/tree',
              key: '1-0',
              title: '树形',
              hasAuth: true,
              hidden: false
            },
            {
              path: '/svg/rectangle',
              key: '1-1',
              title: '矩形',
              hasAuth: true,
              hidden: false
            }
          ]
        },
        {
          path: '',
          key: '2',
          title: '地图',
          icon: 'icon-wenjianjiance',
          hasAuth: true,
          hidden: false,
          children: [
            {
              path: '',
              key: '2-0',
              title: '大坝安全',
              hasAuth: true,
              hidden: false,
              children: [
                {
                  path: '/BIMView',
                  key: '2-0-0',
                  title: '综合评价',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/patrol',
                  key: '2-0-1',
                  title: '巡视检查',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/camera',
                  key: '2-0-2',
                  title: '视频监控',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/monitor/data',
                  key: '2-0-3',
                  title: '安全监测',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/monitor/sys',
                  key: '2-0-4',
                  title: '测点管理',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/problems',
                  key: '2-0-5',
                  title: '问题管理',
                  hasAuth: true
                }
              ]
            },
            {
              path: '',
              key: '2-1',
              title: '库区安防',
              hasAuth: true,
              hidden: false,
              children: [
                {
                  path: '/dam/safe/alarm',
                  key: '2-1-0',
                  title: '报警事件',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/safe/video',
                  key: '2-1-1',
                  title: '库区视频',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/safe/inspection',
                  key: '2-1-2',
                  title: '库区巡检',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/safe/radio',
                  key: '2-1-3',
                  title: '库区广播',
                  hasAuth: true,
                  hidden: false
                }
              ]
            },
            {
              path: '',
              key: '2-2',
              title: '安全生产',
              hasAuth: true,
              hidden: false,
              children: [
                {
                  path: '/dam/produce/risk',
                  key: '2-2-0',
                  title: '风险管理',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/produce/troubleShoot',
                  key: '2-2-1',
                  title: '隐患排查',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/produce/drills',
                  key: '2-2-2',
                  title: '安全演练',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/produce/train',
                  key: '2-2-3',
                  title: '安全培训',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/produce/check',
                  key: '2-2-4',
                  title: '安全检查',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/produce/test',
                  key: '2-2-5',
                  title: '安全知识考核',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/dam/produce/ledger',
                  key: '2-2-6',
                  title: '安全专项台账',
                  hasAuth: true,
                  hidden: false
                }
              ]
            }
          ]
        },
        {
          path: '',
          key: '3',
          title: '调度管理',
          icon: 'icon-gongsiguanli',
          hasAuth: true,
          hidden: false,
          children: [
            {
              path: '',
              key: '3-0',
              title: '防汛管理',
              hasAuth: true,
              hidden: false,
              children: [
                {
                  path: '/flood?damId=2376&damName=西丽',
                  key: '3-0-0',
                  title: '汛期动态',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/flood/floodPrepare',
                  key: '3-0-1',
                  title: '防汛准备',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/flood/floodCheck?damId=2376',
                  key: '3-0-2',
                  title: '防汛检查',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/flood/floodSustain',
                  key: '2-0-3',
                  title: '防汛支持',
                  hasAuth: true,
                  hidden: false
                }
              ]
            },
            {
              path: '',
              key: '3-1',
              title: '水量管理',
              hasAuth: true,
              hidden: false,
              children: [
                {
                  path: '/waterVolume/warn',
                  key: '3-1-0',
                  title: '监测预警',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/waterVolume/data',
                  key: '3-1-1',
                  title: '数据管理',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/waterVolume/observe',
                  key: '3-1-2',
                  title: '观测报表',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/waterVolume/balance',
                  key: '3-1-3',
                  title: '平衡分析',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/waterVolume/order',
                  key: '3-1-4',
                  title: '调令管理',
                  hasAuth: true,
                  hidden: false
                }
              ]
            },
            {
              path: '',
              key: '3-2',
              title: '水质管理',
              hasAuth: true,
              hidden: false,
              children: [
                {
                  path: '/waterQuality',
                  key: '3-2-0',
                  title: '监测预警',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/waterQuality/evaluate',
                  key: '3-2-1',
                  title: '水质评价',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/waterQuality/analysis',
                  key: '3-2-2',
                  title: '分析图表',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/waterQuality/inspect',
                  key: '3-2-3',
                  title: '水质巡检',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/waterQuality/simulation',
                  key: '3-2-4',
                  title: '水质模拟',
                  hasAuth: true,
                  hidden: false
                }
              ]
            }
          ]
        },
        {
          path: '',
          key: '4',
          title: '综合管理',
          icon: 'icon-shujuchakan',
          hasAuth: true,
          hidden: false,
          children: [
            {
              path: '',
              key: '4-0',
              title: '文档管理',
              hasAuth: true,
              hidden: false,
              children: [
                {
                  path: '/knowledge/notice',
                  key: '4-0-0',
                  title: '通知动态',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/knowledge/files',
                  key: '4-0-1',
                  title: '文件资料',
                  hasAuth: true,
                  hidden: false
                },
                {
                  path: '/knowledge/publishMessages',
                  key: '4-0-2',
                  title: '发布信息',
                  hasAuth: true,
                  hidden: false
                }
              ]
            },
            {
              path: '/manageExamine',
              key: '4-1',
              title: '管理考核',
              hasAuth: true,
              hidden: false
            }
          ]
        }
      ],
      activeNavItem: {},
      activeIndex: '',
      defaultIndex: '1'
    };
  },
  computed: {
    ...mapState({
      auth: state => state.auth,
      currentDamInfo: state => state.shared.currentDamInfo,
      containerHeight: state => state.shared.containerHeight
    })
  },
  watch: {
    $route(val) {
      this.setNavItemActive();
    }
  },
  mounted() {
    this.setNavItemActive();
  },
  methods: {
    changeMenu(nav) {
      const query = {};
      if (nav.path) {
        if (nav.path.indexOf('monitor') > -1) {
          // if (this.auth.user.userType === 2) {
          //   query = {
          //     stationId: this.currentDamInfo.stationId,
          //     damId: this.currentDamInfo.damId,
          //     damName: this.currentDamInfo.damName
          //   };
          // }
          nav.path = nav.path === 'monitor/sys' ? 'monitor/sys' : nav.path;
        } else if (nav.path.indexOf('patrol') > -1) {
          nav.path = '/patrol/resultManage/record?damId=2376&damName=西丽水库';
        }
        this.$router.push({ path: nav.path, query: query });
      }
    },
    // 路由改变及刷新页面后设置选中
    setNavItemActive() {
      const _navArr = recursion(this.navTitle, 'children');
      const matchNav = _.filter(_navArr, nav => { return this.$route.path.indexOf(nav.path) > -1 && nav.path; });
      this.defaultIndex = matchNav.length ? _.last(matchNav).key : '1';
    }
  }
};
</script>
