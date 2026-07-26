const path = require("path");
const webpack = require("webpack");
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
 * 创建环境变量注入插件
 * 将 .env 中的变量注入到浏览器代码中
 * EnvironmentPlugin 是 DefinePlugin 的语法糖，等价于：
 * new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })
 * @returns {webpack.EnvironmentPlugin} 环境变量插件实例
 */
const createEnvPlugin = () => new webpack.EnvironmentPlugin(["NODE_ENV", "PORT"]);

/**
 * 获取基础插件列表
 * @returns {Array} 基础插件数组
 */
const getBasePlugins = () => [
  createHtmlPlugin(),
  createProgressPlugin(),
  createEnvPlugin(),
];

module.exports = {
  createHtmlPlugin,
  createProgressPlugin,
  createEnvPlugin,
  getBasePlugins,
};