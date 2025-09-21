const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { getProdPlugins } = require("./plugins");
const { getProdOptimization } = require("./optimization");

module.exports = merge(common, {
  mode: "production",

  devtool: false, // 生产环境禁用源码映射

  // 排除外部依赖，不打包到 bundle 中
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },

  // 生产环境缓存配置
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, "../node_modules/.cache"),
    name: "production",
    buildDependencies: {
      config: [__filename],
    },
    compression: "gzip", // 启用缓存压缩
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7天缓存
  },

  // 性能优化
  performance: {
    hints: "warning",
    maxAssetSize: 500000, // 500KB
    maxEntrypointSize: 500000,
    assetFilter: function(assetFilename) {
      return !assetFilename.endsWith(".map");
    },
  },


  plugins: [
    // 生产环境特有插件
    ...getProdPlugins(),
  ],

  optimization: {
    // 继承通用优化配置，并添加生产环境特有配置
    ...getProdOptimization(),
  },
});