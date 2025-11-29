const path = require("path");

/**
 * 输出配置模块
 * 定义Webpack的输出配置
 */

/**
 * 获取输出配置
 * @returns {Object} 输出配置
 */
const getOutput = () => {
  const cwd = process.cwd();

  return {
    path: path.resolve(cwd, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true,
  };
};

module.exports = {
  getOutput,
};