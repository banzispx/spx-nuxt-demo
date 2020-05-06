<template>
  <div
    class="header clearfix text-white"
    style="height: 64px"
  >
    <div class="fl">
      <img
        src="/images/logo.png"
        alt=""
        width="36px"
        class="mr-2"
        style="margin-top: -4px"
      ><span class="text-17">Nuxt 项目demo</span>
    </div>
    <div class="fr opacity-85">
      <el-badge
        v-popover:popoverMessage
        class="cursor-pointer"
        :max="10"
        :value="unreadMessages.totalElements"
        :hidden="!unreadMessages.content || unreadMessages.content.length === 0"
      >
        <button
          type="button"
          class="cursor-pointer header-btn align-middle px-4 mr-1"
        >
          <i class="iconfont icon-lingdang text-26 text-white" />
        </button>
      </el-badge>
      <el-button
        type="text"
        class="py-0"
      >
        <img
          width="32"
          height="32"
          :src="user.profile"
          alt="头像"
          class="align-middle"
        >
        <span class="text-white ml-2">{{ user.name }}</span>
      </el-button>
      <el-button
        type="text"
        class="py-0"
        @click="loginOut"
      >
        <span class="text-white">退出</span>
      </el-button>
    </div>
    <el-popover
      ref="popoverMessage"
      placement="bottom-end"
      trigger="hover"
      popper-class="width-27 p-0 mt-0"
    >
      <h6 class="px-4 py-3 my-0 line-height-20 border-bottom">
        信息
      </h6>
      <div
        class="ofy-auto"
        style="max-height: 280px;"
      >
        <!-- <ul class="list-unstyled" v-if="unreadMessages.content && unreadMessages.content.length > 0">
          <li class="px-4 py-3" v-for="(message, index) in unreadMessages.content" :class="index > 0 ? 'border-top' : ''">
            <p class="text-truncate line-height-20">
              <a class="text-gray" :title="message.content" @click="messageRead(message)">{{ message.content }}</a>
            </p>
          </li>
        </ul>
        <p class="text-gray text-center py-4 my-4" v-else>暂无未读消息</p> -->
      </div>
      <router-link to="/message">
        <p class="px-4 py-3 text-center border-top">
          查看全部 >>
        </p>
      </router-link>
    </el-popover>
    <el-dialog
      destroy-on-close
      class="addProblemDialog"
      title="添加问题"
      width="900px"
      :visible.sync="isShowProblemDialog"
      @close="problemDialogClose"
    >
      <!-- <add-problem
        :is-in-dialog="true"
        @addSuccess="isShowProblemDialog=false"
      /> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      unreadMessages: {},
      showMessagePop: false,
      user: {
        name: '小板子',
        profile: '/images/profile.png'
      },
      isShowProblemDialog: false
    };
  },
  computed: {
    ...mapGetters(['getTaskLink'])
  },
  mounted() {
    // this.getAccount().then(res => {
    //   this.user.name = res.data.firstName;
    // });
    // this.bus.$off('showProblemDialog');
    // this.bus.$on('showProblemDialog', (closeCallback) => {
    //   this.isShowProblemDialog = true;
    //   this.closeProblemDialogCallback = closeCallback;
    // });
  },
  methods: {
    ...mapActions([
      'getAccount'
    ]),
    loginOut() {
      this.$confirm('确定退出此账号?', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$auth.logout()
          .then(() => {
            // this.$router.replace({ name: 'login' });
          })
          .catch(e => {});
      }).catch(() => {});
    },
    messageRead(message) {
      this.$emit('messageRead', message.id);
      this.$refs.popoverMessage.doClose();
      this.$router.push({ path: this.getTaskLink(message.userTask) });
    },
    problemDialogClose() {
      this.closeProblemDialogCallback && this.closeProblemDialogCallback();
    }
  }
};
</script>
