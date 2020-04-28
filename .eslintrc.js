// 下面是按官方的推荐写的,Eslint配置的不是特别的好，采用下下面写的
// module.exports = {
//   root: true,
//   env: {
//     browser: true,
//     node: true,
//   },
//   parserOptions: {
//     parser: "babel-eslint",
//   },
//   extends: [
//     "eslint:recommended",
//     // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
//     // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
//     "plugin:vue/recommended",
//     "plugin:prettier/recommended",
//   ],
//   // required to lint *.vue files
//   plugins: ["vue"],
//   // add your custom rules here
//   rules: {
//     // 'semi': [2, 'never'],
//     // "singleQuote": true,//把双引号换成单引号
//     semi: ["error", "always"], // 永远有分号
//     "no-console": "off",
//     "vue/html-self-closing": [ // 用来配置标签的闭合问题
//       "error",
//       {
//         html: {
//           void: "always",
//           normal: "never",
//           component: "always",
//         },
//         svg: "any",
//         math: "any",
//       },
//     ],
//     "space-before-function-paren": [
//       "error",
//       {
//         anonymous: "always",
//         named: "never",
//         asyncArrow: "always",
//       },
//     ], // 在函数参数前加括号
//     "vue/max-attributes-per-line": "off", // 暂时不清楚，不加好多错
//     // 配置的文档 https://prettier.io/docs/en/options.html
//     "prettier/prettier": [
//       "error",
//       {
//         singleQuote: true,
//         endOfLine: "auto", // 不让prettier检测文件每行结束的格式.
//         trailingComma: "none", // 后面没有逗号
//         bracketSpacing: true, // 对象前后有空格
//         jsxBracketSameLine: false, // 配置不起作用
//         // proseWrap: "never",
//         alwaysParens: "always", //为单行箭头函数的参数添加圆括号
//         htmlWhitespaceSensitivity: "ignore",
//         quoteProps: "as-needed", // 是否可有空格
//         // parser: "flow",
//       },
//     ], // 再次配置单引号
//   },
// };

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['standard','plugin:vue/recommended'],
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "semi": ["error", "always"],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
  },
  globals: {
    'Cesium': true,
    'SuperMap':true,
    'ol':true,
    'L': true,
    'proj4':true,
    'AMapUI': true
  }
}
