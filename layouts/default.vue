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
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
// import * as SockJS from 'sockjs-client';
// import * as Stomp from 'webstomp-client';
import damHeader from '~/layouts/damHeader';
import damNav from '~/layouts/damNav';

export default {
  // middleware: ['auth'],
  components: {
    damHeader,
    damNav
  },
  computed: {
    ...mapState({
      containerHeight: state => state.shared.containerHeight,
      showNav: state => state.shared.showNav
    }),
    ...mapGetters(['getTaskTypeLabel', 'getTaskLink'])
  },
  created() {
    if (process.browser) {
      window.addEventListener('resize', this.getSize);
      this.getSize();
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.loadUnreadMessages();
    //   this.socket = new SockJS(URL + '/api-messages');
    //   this.stompClient = Stomp.over(this.socket);
    //   this.stompClient.connect({}, () => {
    //     this.stompClient.subscribe(
    //       `/user/${this.auth.user.id}/messages`,
    //       data => {
    //         const message = JSON.parse(data.body);
    //         this.SET_CURRENT_MESSAGE(message);
    //         const h = this.$createElement;
    //         this.loadUnreadMessages();
    //         this.$notify({
    //           title: '消息提示',
    //           message: h('p', { class: 'text-gray' }, [
    //             '您有一个新的',
    //             h('strong', {}, this.getTaskTypeLabel(message.userTask.type)),
    //             '任务 ',
    //             h(
    //               'a',
    //               {
    //                 class: 'text-primary',
    //                 attrs: {
    //                   href: this.getTaskLink(message.userTask),
    //                   target: '_blank'
    //                 }
    //               },
    //               message.content
    //             )
    //           ]),
    //           position: 'bottom-right',
    //           customClass: 'text-gray right-0'
    //         });
    //       }
    //     );
    //   });
    // });
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
      'SET_SHOW_NAV',
      'SET_UNREAD_MESSAGES',
      'SET_CURRENT_FAVORITE',
      'SET_CURRENT_MESSAGE'
    ]),
    ...mapActions(['setMessageRead']),
    getSize() {
      this.SET_CONTAINER_WIDTH(window.innerWidth);
      this.SET_CONTAINER_HEIGHT(window.innerHeight - 64);
    },
    loadUnreadMessages() {
      // this.getMessages({ size: 5, status: 0 }).then(res => {
      //   this.SET_UNREAD_MESSAGES(res.data);
      // });
    },
    readMessage(id) {
      this.setMessageRead(id).then(() => {
        this.loadUnreadMessages();
      });
    },
    collapseNav() {
      this.SET_SHOW_NAV(!this.showNav);
      // this.bus.$emit('nav-resize');
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
