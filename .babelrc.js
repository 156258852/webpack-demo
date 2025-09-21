module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // 将es6的语法翻译成es5语法
        targets: {
          //兼容目标浏览器
          // "chrome": "67", //指定浏览器版本
          browsers: ["last 2 versions", "safari >= 7"], //支持每个浏览器最后两个版本和safari大于等于7版本所需的polyfill代码转换
          // "browsers": "> 5%", //支持市场份额超过5%的浏览器
          node: "current", //如果通过Babel编译Node.js代码的话，可以设置 "target.node" 是 'current', 含义是 支持的是当前运行版本的nodejs。
        },
        useBuiltIns: "entry", // 使用core-js的方式 "usage" 表示根据配置的浏览器兼容，动态按需添加polyfill
        corejs: "3", //声明corejs版本
        modules: false, //不转换ES6模块语法
      },
    ],
    "@babel/preset-react", //转换react JSX,
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3, //声明corejs版本
      },
    ],
    // "./babelPlugins/index.js",
  ],
};
