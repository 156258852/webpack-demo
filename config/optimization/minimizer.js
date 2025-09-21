const TerserPlugin = require("terser-webpack-plugin");

/**
 * 代码压缩配置模块
 * 处理JavaScript代码压缩和优化
 */

/**
 * 创建JavaScript压缩配置
 * @returns {TerserPlugin} Terser插件实例
 */
const createJSMinimizer = () => new TerserPlugin({
  parallel: true,
  terserOptions: {
    compress: {
      pure_funcs: [
        "console.log",
        "console.info",
        "console.debug",
        "console.warn",
      ],
    },
    format: {
      comments: false,
    },
  },
  extractComments: false,
});

/**
 * 获取代码压缩器配置
 * @returns {Array} minimizer数组
 */
const getMinimizers = () => [
  createJSMinimizer(),
];

module.exports = {
  createJSMinimizer,
  getMinimizers,
};