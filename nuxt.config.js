const nodeExternals = require('webpack-node-externals');
export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    // title: process.env.npm_package_name || '',
    title: 'ProfileMap',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'normalize.css/normalize.css', // css模块化
    { src: '~assets/css/index.scss', lang: 'scss' } // 引入全局的css
  ],
  /*
   ** Plugins to load before mounting the App
   *https://www.cnblogs.com/weiqinl/p/10581867.html 关于国际化的参考
   */
  plugins: ['~/plugins/element/element-ui', '~/plugins/axios', '~/plugins/i18n.js', '~/plugins/vue-echarts'],
  router: {
    middleware: ['i18n']
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/proxy'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:3000',
    '/laravel': {
      target: 'https://laravel-auth.nuxtjs.app',
      pathRewrite: { '^/laravel': '/' }
    },
    '/baas': {
      target: 'https://studio.e.huawei.com/baas/auth/v1.0/oauth2/',
      pathRewrite: { '^/baas': '/' }
      // headers: {
      //   Origin: 'https://studio.e.huawei.com/',
      //   Connection: 'keep-alive'
      // }
    },
    '/huawei': {
      target: 'https://59.36.10.215:7244/',
      pathRewrite: { '^/huawei': '/' }
      // headers: {
      //   Origin: 'https://studio.e.huawei.com/',
      //   Connection: 'keep-alive'
      // }
    },
    '/token': {
      target: 'https://59.36.10.215:7244/token'
      // pathRewrite: { '^/token': '/token' }
      // headers: {
      //   Origin: 'https://studio.e.huawei.com/',
      //   Connection: 'keep-alive'
      // }
    },
    '/service': {
      target: 'https://studio.e.huawei.com//service/GRKJ__Rain/0.1.0/',
      pathRewrite: { '^/service': '/' }
      // headers: {
      //   Origin: 'https://studio.e.huawei.com/',
      //   Connection: 'keep-alive'
      // }
    },

    '/riverinstance':
    { // http://172.17.197.32:8083/jsonrpc/basin.getOneDamListByRiverId
      target: 'http://172.17.197.40:8083/jsonrpc',
      pathRewrite: {
        '^/riverinstance': ''
      }
    }

  },
  auth: {
    redirect: {
      callback: '/callback',
      logout: '/login'
    },
    strategies: {
      local: {
        token: {
          property: 'token.accessToken',
          type: 'Bearer'
        },
        endpoints: {
          login: { propertyName: 'token.accessToken' }
        }
      },
      localRefresh: {
        _scheme: 'refresh',
        token: {
          property: 'token.accessToken',
          maxAge: 15
        },
        refreshToken: {
          property: 'token.refreshToken',
          data: 'refreshToken',
          maxAge: false
        },
        clientId: {
          property: 'token.clientId',
          data: 'clientId'
        },
        grantType: {
          data: 'grantType'
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i, /^vue-echarts/]
          })
        ];
      }
    }
  }
};
