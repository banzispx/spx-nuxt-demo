const state = () => ({
  fileList: [],
  pageSize: 10,
  currentDamId: 2376,
  currentDamInfo: {
    damId: 2376,
    stationId: 3136,
    damName: '西丽'
  },
  filterDams: [],
  damInfo: {},
  breadcrumb: [],
  damList: [],
  showTab: true,
  showDamSelect: false,
  containerHeight: '',
  containerWidth: '',
  showNav: true
});

const getters = {};

const mutations = {
  SET_CONTAINER_HEIGHT(state, containerHeight) {
    state.containerHeight = containerHeight;
  },
  SET_CONTAINER_WIDTH(state, containerWidth) {
    state.containerWidth = containerWidth;
  },
  SET_SHOW_NAV(state, showNav) {
    state.showNav = showNav;
  }
};

const actions = {

};

export default {
  state,
  getters,
  actions,
  mutations
};
