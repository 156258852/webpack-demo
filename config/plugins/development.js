/**
 * 开发环境插件配置
 * 包含热更新、调试、分析等开发工具
 */

const { isDev } = require('../utils/env');

/**
 * 创建React热更新插件
 * @returns {Object|null} React热更新插件实例或null
 */
const createReactRefreshPlugin = () => {
  if (!isDev()) {
    return null;
  }

  const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

  return new ReactRefreshWebpackPlugin({
    overlay: false,
  });
};

/**
 * 创建死代码检测插件
 * @returns {Object|null} 死代码检测插件实例或null
 */
const createDeadCodePlugin = () => {
  if (!isDev()) {
    return null;
  }

  const DeadCodePlugin = require("webpack-deadcode-plugin");

  return new DeadCodePlugin({
    patterns: [
      "src/**/*.(js|jsx|ts|tsx|css|scss|sass|less|png|jpg|gif|jpeg|svg|ttf|woff|woff2|eot|otf)",
    ],
    exclude: [
      "**/node_modules/**",
      "**/*.test.(js|jsx|ts|tsx)",
      "**/*.spec.(js|jsx|ts|tsx)",
      "**/test/**",
      "**/tests/**",
      "src/reportWebVitals.js",
    ],
    content: ".",
    detectUnusedFiles: true,
    detectUnusedExport: true,
    failOnHint: false,
    log: "all",
    exportJSON: "./deadcode-analysis",
  });
};

/**
 * 获取开发环境插件列表
 * @returns {Array} 开发环境插件数组
 */
const getDevelopmentPlugins = () => [
  createReactRefreshPlugin(),
  // createDeadCodePlugin(), // dead code插件先不开启
].filter(Boolean);

module.exports = {
  createReactRefreshPlugin,
  createDeadCodePlugin,
  getDevelopmentPlugins,
};