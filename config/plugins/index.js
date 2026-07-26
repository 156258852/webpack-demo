/**
 * 插件模块统一入口
 * 整合所有插件配置，提供统一的API
 */

const { getBasePlugins } = require("./base");
const { getCSSPlugins } = require("./css");
const { getDevelopmentPlugins } = require("./development");
const { getProductionPlugins } = require("./production");

// 重新导出各模块的创建函数（向后兼容）
const { createHtmlPlugin, createProgressPlugin, createEnvPlugin } = require("./base");
const { createCSSExtractPlugin } = require("./css");
const { createReactRefreshPlugin, createDeadCodePlugin } = require("./development");
const { createExternalsPlugin } = require("./production");

/**
 * 获取通用插件
 * @returns {Array} 通用插件数组
 */
const getCommonPlugins = () => [
  ...getBasePlugins(),
  ...getCSSPlugins(),
  ...getDevelopmentPlugins(),
];

/**
 * 获取开发环境插件
 * @returns {Array} 开发环境插件数组
 */
const getDevPlugins = () => getDevelopmentPlugins();

/**
 * 获取生产环境插件
 * @returns {Array} 生产环境插件数组
 */
const getProdPlugins = () => getProductionPlugins();

module.exports = {
  // 向后兼容的创建函数
  createHtmlPlugin,
  createProgressPlugin,
  createEnvPlugin,
  createDeadCodePlugin,
  createCSSExtractPlugin,
  createReactRefreshPlugin,
  createExternalsPlugin,

  // 新的分类获取函数
  getBasePlugins,
  getCSSPlugins,
  getDevelopmentPlugins,
  getProductionPlugins,

  // 原有的聚合函数
  getCommonPlugins,
  getDevPlugins,
  getProdPlugins,
};