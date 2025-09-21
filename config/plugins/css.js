/**
 * CSS相关插件配置
 * 包含CSS提取、样式处理等插件
 */

const { isProd } = require('../utils/env');

/**
 * 创建CSS提取插件（生产环境）
 * @returns {Object|null} CSS提取插件实例或null
 */
const createCSSExtractPlugin = () => {
  if (!isProd()) {
    return null;
  }

  const MiniCssExtractPlugin = require("mini-css-extract-plugin");

  return new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
    chunkFilename: "[id].[contenthash].css",
  });
};

/**
 * 获取CSS相关插件列表
 * @returns {Array} CSS插件数组
 */
const getCSSPlugins = () => [
  createCSSExtractPlugin(),
].filter(Boolean);

module.exports = {
  createCSSExtractPlugin,
  getCSSPlugins,
};