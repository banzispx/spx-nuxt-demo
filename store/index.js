import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from 'lodash';

Vue.use(Vuex);

const dam = () => {
  return new Vuex.Store({
    state: {},
    mutations: {},
    getters: {
      // 是否包含某权限
      hasUserAuthority: (state) => (role) => {
        const user = state.auth.user;
        if (user) {
          return _.includes(user.authorities, role);
        }
      }
    },
    modules: {},
    actions: {
      // 查询单个测点水质数据
      async selectSingleData() {
        return this.$axios.get('/xiliquality/api/codeInfo/313600090');
      }
    }
  });
};
export default dam;
