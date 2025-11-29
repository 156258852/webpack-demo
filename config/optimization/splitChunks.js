/**
 * 代码分割配置模块
 * 处理代码分包和缓存组配置
 */

/**
 * 创建代码分割配置
 * @returns {Object} 代码分割配置
 */
const createSplitChunksConfig = () => ({
  chunks: "all",
  cacheGroups: {
    // 第三方库分离
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: "vendors",
      chunks: "all",
      priority: -10,
      filename: "[name].[contenthash:8].js",
      minSize: 0,
      minChunks: 1,
    },
    // 公共代码分离
    common: {
      name: "common",
      chunks: "all",
      priority: -20,
      filename: "[name].[contenthash:8].js",
      minSize: 500 * 1024, // 500kb
      minChunks: 1,
    },
  },
});

/**
 * 获取代码分割配置
 * @returns {Object} splitChunks配置
 */
const getSplitChunks = () => createSplitChunksConfig();

module.exports = {
  createSplitChunksConfig,
  getSplitChunks,
};