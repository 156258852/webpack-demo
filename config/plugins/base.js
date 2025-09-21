const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");

/**
 * 基础插件配置
 * 包含HTML生成、进度条等通用插件
 */

/**
 * 创建HTML插件配置
 * @returns {HtmlWebpackPlugin} HTML插件实例
 */
const createHtmlPlugin = () => {
  const cwd = process.cwd();

  return new HtmlWebpackPlugin({
    title: "react-webpack-learn",
    meta: {
      viewport: "width=device-width",
    },
    template: path.join(cwd, "index.html"),
  });
};

/**
 * 创建进度条插件
 * @returns {WebpackBar} 进度条插件实例
 */
const createProgressPlugin = () => new WebpackBar({
  name: "webpack",
});

/**
 * 获取基础插件列表
 * @returns {Array} 基础插件数组
 */
const getBasePlugins = () => [
  createHtmlPlugin(),
  createProgressPlugin(),
];

module.exports = {
  createHtmlPlugin,
  createProgressPlugin,
  getBasePlugins,
};