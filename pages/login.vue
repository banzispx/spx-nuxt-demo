
<template>
  <div @keyup.enter="login">
    <img
      class="position-fixed full-width full-height"
      src="/images/bgImage.png"
      alt=""
    >
    <div class="position-relative mx-auto">
      <div
        class="width-43 p-8 mx-auto"
        style="transform: translateY(21vh);background-color: rgba(255, 255, 255, 0.5);"
      >
        <div class="text-center">
          <img
            class="width-5 height-5"
            src="/images/logo.png"
            alt=""
          >
          <h3
            class="mt-3 text-18 font-weight-bold"
            style="letter-spacing: 1px"
          >
            水库管理系统
          </h3>
        </div>
        <el-form
          :model="formLogin"
          class="clearfix"
        >
          <div class="form-group--login position-relative mt-6">
            <i
              class="iconfont icon-yonghu text-primary py-2 px-3 position-absolute"
              style="z-index: 1"
            />
            <el-input
              v-model="formLogin.username"
              name="username"
              placeholder="请输入用户名"
            />
          </div>
          <div class="form-group--login position-relative mt-4">
            <i
              class="iconfont icon-yuechi text-primary py-2 px-3 position-absolute"
              style="z-index: 1"
            />
            <el-input
              v-model="formLogin.password"
              name="password"
              type="password"
              class="closeIcon"
              show-password
              placeholder="请输入用户密码"
            />
          </div>
          <div class="form-group--login mt-3 fl">
            <el-checkbox v-model="formLogin.rememberMe">
              <!-- <span class="text-black-light">{{ $t('login.remember') }}</span> -->
            </el-checkbox>
          </div>
          <el-button
            class="full-width mt-3"
            type="primary"
            size="medium"
            :disabled="isLoading"
            @click="login"
          >
            登录<span v-if="isLoading">中</span>
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: 'false',
  layout: 'none',
  data() {
    return {
      sessionStorage: {},
      isLoading: false,
      formLogin: {
        username: '121',
        password: '123',
        rememberMe: false
      }
    };
  },
  mounted() {
    this.setDomain();
    const formLogin = localStorage.getItem('formLogin');
    if (formLogin !== null) {
      // 解决IE输入框无法记住用户名密码的问题
      setTimeout(() => {
        const flag = formLogin === 'true';
        this.formLogin.rememberMe = flag;
      }, 10);
    } else {
      // 解决360浏览器记住密码后表单为空的问题
      this.formLogin.username = document.querySelector("[name='username']").value;
      this.formLogin.password = document.querySelector("[name='password']").value;
    }
    // const lang = navigator.language || navigator.browserLanguage;
    // switch (lang.toUpperCase()) {
    //   case 'ZH-CN':
    //     this.$store.state.i18n.locale = 'zh';
    //     break;
    //   case 'EN-US':
    //     this.$store.state.i18n.locale = 'en';
    //     break;
    // }
  },
  methods: {
    async login() {
      this.error = null;
      return this.$auth
        .loginWith('local', {
          data: {
            username: '1122',
            password: '123'
          }
        })
        .catch((e) => {
          this.error = e.response.data;
        });
    },
    setDomain() {
      this.sessionStorage = sessionStorage;
    },
    setRememberme() {
      if (this.formLogin.rememberMe) {
        localStorage.setItem('formLogin', true);
      } else {
        localStorage.removeItem('formLogin');
      }
    },
    testEnvironment() {
      return process.env.NPM_ENV === 'development';
    }
  }
};
</script>
<style lang="scss">
  .form-group--login > .el-input > .el-input__inner {
    background-color: #fff;
    border-color: #fff;
    padding-left: 43px;
  }
  .closeIcon .el-input__suffix .el-icon-view:before {
    font-family: 'iconfont';
    content: "\e672";
    color: #2BA3FD;
    font-size: 18px;
    padding-right: 10px;
  }
</style>
