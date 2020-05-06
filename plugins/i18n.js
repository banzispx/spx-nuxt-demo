import Vue from 'vue';
import VueI18n from 'vue-i18n';
import locale from 'element-ui/lib/locale';
import messages from '../locales';

Vue.use(VueI18n);

export default ({ app, store }) => {
  app.i18n = new VueI18n({
    locale: store.state.i18n.locale,
    fallbackLocale: 'en',
    messages: messages
  });
  locale.i18n((key, value) => app.i18n.t(key, value));
};
