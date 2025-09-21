const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { getDevPlugins } = require("./plugins");
const { findAvailablePort } = require("./utils");

const cwd = process.cwd();
let port = Number(process.env.PORT);

module.exports = async () => {
  port = await findAvailablePort(port);

  return merge(common, {
    mode: "development",

    devtool: "eval-cheap-module-source-map",

    output: {
      path: path.resolve(cwd, "build"),
    },

    module: {
      rules: [
        // CSS相关配置已移动到 webpack.common.js
      ],
    },

    plugins: [
      // React热更新等开发环境插件
      ...getDevPlugins(),
    ],

    devServer: {
      static: path.join(cwd, "public"), // 静态文件目录
      compress: true, // 启用 gzip 压缩
      port, // 端口号
      open: true, // 启动后自动打开浏览器
      hot: true, // 启用热模块替换
      client: {
        logging: "error", // 关闭所有日志输出
      },
    },

    cache: {
      type: "filesystem", // 使用文件系统缓存
      buildDependencies: {
        config: [__filename], // 当配置文件发生变化时，缓存失效
      },
      cacheDirectory: path.resolve(__dirname, "../node_modules/.cache"), // 缓存目录
      name: "dev", // 缓存名称
    },

    watchOptions: {
      ignored: /node_modules/, // 忽略 node_modules 目录
      aggregateTimeout: 300, // 文件变更后的聚合超时时间
      poll: 1000, // 文件变更轮询间隔
    },
  });
};