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
          key: '3',
          title: 'gis',
          icon: 'icon-gongsiguanli',
          hasAuth: true,
          hidden: false,
          children: [
            {
              path: '/gis/leaflet',
              key: '3-0',
              title: 'leaflet',
              hasAuth: true,
              hidden: false
            },
            {
              path: '/gis/water',
              key: '3-0',
              title: 'water',
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
