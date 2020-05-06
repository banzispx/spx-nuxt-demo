// 此模块是国际化的
const state = () => ({
  locales: ['en', 'zh'],
  locale: 'zh'
});

const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  }
};

export default {
  state,
  mutations
};
