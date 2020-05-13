<template>
  <el-container>
    <el-header class="header-bg">
      <dam-header />
    </el-header>
    <el-container
      :style="`height: ${containerHeight}px`"
      class="position-relative"
    >
      <img
        alt
        class="position-absolute cursor-pointer"
        :src="`${showNav ? '/images/nav/nav-left-on.png' : '/images/nav/nav-left-off.png'}`"
        :style="`left: ${showNav ? '256' : '0'}px;top: ${containerHeight / 2 - 36}px;z-index:1000`"
        @click="collapseNav"
      >
      <el-aside
        v-if="showNav"
        width="256px"
        class="dam-side"
      >
        <dam-nav />
      </el-aside>
      <el-main
        id="toTop"
        class="p-0 main-shadow"
      >
        <nuxt />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import * as SockJS from 'sockjs-client';
// import * as Stomp from 'webstomp-client';
import damHeader from '~/layouts/damHeader';
import damNav from '~/layouts/damNav';

export default {
  // 此处配置，所有采用默认布局的都需要权限校验
  // middleware: ['auth'],
  auth: 'false',
  components: {
    damHeader,
    damNav
  },
  computed: {
    ...mapState({
      containerHeight: state => state.shared.containerHeight,
      showNav: state => state.shared.showNav
    })
  },
  created() {
    if (process.browser) {
      window.addEventListener('resize', this.getSize);
      this.getSize();
    }
  },
  mounted() {
  },
  destroyed() {
    if (process.browser) {
      window.removeEventListener('resize', this.getSize);
    }
  },
  methods: {
    ...mapMutations([
      'SET_CONTAINER_HEIGHT',
      'SET_CONTAINER_WIDTH',
      'SET_SHOW_NAV'
    ]),
    getSize() {
      this.SET_CONTAINER_WIDTH(window.innerWidth);
      this.SET_CONTAINER_HEIGHT(window.innerHeight - 64);
    },
    collapseNav() {
      this.SET_SHOW_NAV(!this.showNav);
    }
  }
};
</script>

<style lang="scss">
.header-bg {
  background: url("/images/header-bg.png") no-repeat;
  background-size: cover;
  line-height: 64px;
  height: 64px !important;
}
.side-bg {
  background: url("/images/sider-bg.png") no-repeat;
}
.main-shadow {
  box-shadow: inset 0 1px 4px rgba(0, 21, 41, 0.12);
}
</style>
