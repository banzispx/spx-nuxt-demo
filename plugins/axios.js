import * as _ from 'lodash';
import { Message } from 'element-ui';
export default function ({ $axios, redirect, app }) {
  // 添加请求拦截器
  $axios.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );
  $axios.defaults.withCredentials = true;
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    const permittedPaths = ['/login'];
    switch (code) {
      case 401:
        if (!_.includes(permittedPaths, window.location.pathname)) {
          window.location.href = '/login';
        }
        break;
      case 403:
        app.router.replace({ name: '403' });
        break;
      case 402:
        console.log(redirect);
        Message.error(error.response.data.message);
        break;
    }
  });
}
