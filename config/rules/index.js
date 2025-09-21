/**
 * 规则模块统一入口
 * 整合所有loader规则配置，提供统一的API
 */

const { getJavaScriptRules } = require("./javascript");
const { getStyleRules } = require("./styles");
const { getAssetRules } = require("./assets");

// 重新导出各模块的创建函数（向后兼容）
const { createJavaScriptRules } = require("./javascript");
const { createStyleRules } = require("./styles");
const { createAssetRules } = require("./assets");

/**
 * 获取所有模块规则
 * @param {boolean} isProd - 是否为生产环境
 * @returns {Array} 所有规则数组
 */
const getAllRules = (isProd) => [
  ...getJavaScriptRules(isProd),
  ...getStyleRules(isProd),
  ...getAssetRules(),
];

module.exports = {
  // 向后兼容的创建函数
  createCSSRules: createStyleRules, // 别名，保持向后兼容
  createJSRules: createJavaScriptRules, // 别名，保持向后兼容
  createAssetRules,

  // 新的分类函数
  createJavaScriptRules,
  createStyleRules,
  getJavaScriptRules,
  getStyleRules,
  getAssetRules,

  // 聚合函数
  getAllRules,
};