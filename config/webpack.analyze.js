const { merge } = require("webpack-merge");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const prodConfig = require("./webpack.prod.js");

module.exports = merge(prodConfig, {
  plugins: [
    // 打包分析插件
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // 生成静态HTML文件
      openAnalyzer: true, // 自动打开分析报告
      reportFilename: "bundle-analyzer-report.html",
      generateStatsFile: true, // 生成统计文件
      statsFilename: "bundle-stats.json",
    }),
  ],
});