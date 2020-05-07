const state = ({});

const getters = {};

const mutations = {};

const actions = {
  // 获取华为那边的登录token
  async getToken({ commit }, params) {
    return this.$axios.post(`/huawei/baas/auth/v1.0/oauth2/token?client_secret=${params.client_secret}&client_id=${params.client_id}&grant_type=${params.grant_type}`);
  },
  async getData({ commit }, obj) {
    return this.$axios({
      method: 'get',
      url: '/huawei/service/GRKJ__Rain/0.1.0/queryNewRainMonitor?addvcd&bsnm&stcds',
      headers: {
        'access-token': obj.access_token
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
