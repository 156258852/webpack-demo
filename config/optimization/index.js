/**
 * 优化配置模块统一入口
 * 整合代码分割、压缩等优化配置
 */

const { getSplitChunks } = require("./splitChunks");
const { getMinimizers } = require("./minimizer");

/**
 * 获取开发环境优化配置
 * @returns {Object} 开发环境优化配置
 */
const getDevOptimization = () => ({
  splitChunks: getSplitChunks(),
});

/**
 * 获取生产环境优化配置
 * @returns {Object} 生产环境优化配置
 */
const getProdOptimization = () => ({
  splitChunks: getSplitChunks(),
  minimizer: getMinimizers(),
});

/**
 * 根据环境获取优化配置
 * @param {boolean} isProd - 是否为生产环境
 * @returns {Object} 优化配置
 */
const getOptimization = (isProd) => isProd ? getProdOptimization() : getDevOptimization();

// 重新导出子模块函数（向后兼容）
const { createSplitChunksConfig } = require("./splitChunks");
const { createJSMinimizer } = require("./minimizer");

module.exports = {
  // 向后兼容的创建函数
  createSplitChunksConfig,
  createJSMinimizer,

  // 新的获取函数
  getSplitChunks,
  getMinimizers,
  getDevOptimization,
  getProdOptimization,
  getOptimization,
};