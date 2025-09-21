/**
 * 环境工具模块
 * 负责环境变量检测和环境相关的工具函数
 */

/**
 * 检查是否为开发环境
 * @returns {boolean} 是否为开发环境
 */
const isDev = () => process.env.NODE_ENV === "development";

/**
 * 检查是否为生产环境
 * @returns {boolean} 是否为生产环境
 */
const isProd = () => process.env.NODE_ENV === "production";

/**
 * 检查是否为测试环境
 * @returns {boolean} 是否为测试环境
 */
const isTest = () => process.env.NODE_ENV === "test";

/**
 * 获取当前环境
 * @returns {string} 当前环境名称
 */
const getCurrentEnv = () => process.env.NODE_ENV || "development";

/**
 * 根据环境条件返回值
 * @param {Object} options - 环境配置对象
 * @param {*} options.dev - 开发环境值
 * @param {*} options.prod - 生产环境值
 * @param {*} options.test - 测试环境值
 * @returns {*} 对应环境的值
 */
const envValue = (options) => {
  const env = getCurrentEnv();
  return options[env] || options.dev;
};

module.exports = {
  isDev,
  isProd,
  isTest,
  getCurrentEnv,
  envValue,
};