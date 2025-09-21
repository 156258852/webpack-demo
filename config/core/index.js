/**
 * 核心配置模块统一入口
 * 整合entry、output、resolve等基础配置
 */

const { getEntry } = require("./entry");
const { getOutput } = require("./output");
const { getResolve } = require("./resolve");

/**
 * 获取基础配置
 * @returns {Object} 基础配置对象
 */
const getBaseConfig = () => ({
  entry: getEntry(),
  output: getOutput(),
  resolve: getResolve(),
});

module.exports = {
  // 分别导出各模块函数
  getEntry,
  getOutput,
  getResolve,

  // 导出整合后的基础配置
  getBaseConfig,
};