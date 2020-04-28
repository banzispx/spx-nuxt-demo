<template>
  <div @click="login">
    Login
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
        username: '',
        password: '',
        rememberMe: false
      }
    };
  },
  mounted() {},
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
  content: '\e672';
  color: #2ba3fd;
  font-size: 18px;
  padding-right: 10px;
}
</style>
