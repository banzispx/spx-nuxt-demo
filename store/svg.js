const state = ({});

const getters = {};

const mutations = {};

const actions = {
  // 获取华为那边的登录token
  async getToken({ commit }, params) {
    // return this.$axios.post(`/huawei/token?client_secret=${params.client_secret}&client_id=${params.client_id}&grant_type=${params.grant_type}`);
    return this.$axios({
      method: 'post',
      url: `/huawei/token?client_secret=${params.client_secret}&client_id=${params.client_id}&grant_type=${params.grant_type}`,
      headers: {
        'X-HW-ID': 'zhsw_zhjc',
        'X-HW-APPKEY': 'BEUf0G0/zjgzJ4Am+fboFw==',
        'Content-Type': 'application/json'
      }
    });
  },
  async getData({ commit }, obj) {
    return this.$axios({
      method: 'get',
      url: '/huawei/queryNewRainMonitor?addvcd&bsnm&stcds',
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
