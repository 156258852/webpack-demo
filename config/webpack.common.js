// 加载环境变量
require("dotenv").config();

// 导入配置模块
const { getBaseConfig } = require("./core");
const { getAllRules } = require("./rules");
const { getCommonPlugins } = require("./plugins");
const { getOptimization } = require("./optimization");
const { isProd } = require("./utils");

module.exports = {
  // 继承基础配置
  ...getBaseConfig(),

  module: {
    rules: getAllRules(isProd()),
  },

  plugins: getCommonPlugins(),

  optimization: getOptimization(isProd()),
};