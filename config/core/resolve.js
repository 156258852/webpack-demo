const path = require("path");

/**
 * 模块解析配置模块
 * 定义Webpack的resolve配置
 */

/**
 * 获取文件扩展名配置
 * @returns {Array} 支持的文件扩展名
 */
const getExtensions = () => [
  ".jsx",
  ".tsx",
  ".ts",
  ".scss",
  ".less",
  ".css",
  ".sass",
  "...", // js、json 等默认后缀名
];

/**
 * 获取别名配置
 * @returns {Object} 路径别名配置
 */
const getAlias = () => {
  const cwd = process.cwd();

  return {
    src: path.join(cwd, "src"),
  };
};

/**
 * 获取resolve配置
 * @returns {Object} resolve配置
 */
const getResolve = () => ({
  extensions: getExtensions(),
  alias: getAlias(),
});

module.exports = {
  getExtensions,
  getAlias,
  getResolve,
};