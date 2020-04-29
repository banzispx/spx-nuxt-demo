import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from 'lodash';
import shared from './shared';
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
    modules: {
      shared
    }
  });
};
export default dam;
