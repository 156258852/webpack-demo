/**
 * 工具模块统一入口
 * 重新导出所有工具函数，保持向后兼容
 */

const { createCSSRules } = require("../rules");
const { createDeadCodePlugin, createCSSExtractPlugin } = require("../plugins");
const port = require("./port");
const env = require("./env");
const path = require("./path");

module.exports = {
  // 端口相关
  ...port,

  // 环境相关
  ...env,

  // 路径相关
  ...path,

  // 为了向后兼容，保留原有的导出
  createDeadCodePlugin,
  createCSSRules,
  createCSSExtractPlugin,
};