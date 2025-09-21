/**
 * 生产环境插件配置
 * 包含外部依赖、压缩优化等生产环境特有插件
 */

const { isProd } = require('../utils/env');

/**
 * 创建外部依赖插件（CDN引入）
 * @returns {Object|null} 外部依赖插件实例或null
 */
const createExternalsPlugin = () => {
  if (!isProd()) {
    return null;
  }

  const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

  return new HtmlWebpackExternalsPlugin({
    externals: [
      {
        module: "react",
        entry: "https://unpkg.com/react@18/umd/react.production.min.js",
        global: "React",
      },
      {
        module: "react-dom",
        entry: "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
        global: "ReactDOM",
      },
    ],
  });
};

/**
 * 获取生产环境插件列表
 * @returns {Array} 生产环境插件数组
 */
const getProductionPlugins = () => [
  createExternalsPlugin(),
].filter(Boolean);

module.exports = {
  createExternalsPlugin,
  getProductionPlugins,
};