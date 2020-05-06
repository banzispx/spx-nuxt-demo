export default function ({ isHMR, app, store, error }) {
  const defaultLocale = app.i18n.fallbackLocale;
  if (isHMR) return;
  const locale = store.state.i18n.locale || defaultLocale;
  if (store.state.i18n.locales.indexOf(locale) === -1) {
    return error({ message: 'This page could not be found.', status: 404 });
  }
  // store.commit('SET_LANG', store.state['i18n'].locale);
  app.i18n.locale = store.state.i18n.locale;
}
