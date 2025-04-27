const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config(); // Load environment variables from .env file
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const { findAvailablePort, extensions } = require("./utils");
const TerserPlugin = require("terser-webpack-plugin");
let port = Number(process.env.PORT) || 9000;
module.exports = async () => {
  port = await findAvailablePort(port);
  const cwd = process.cwd();
  const isProd = process.env.NODE_ENV === "production";
  return {
    mode: process.env.NODE_ENV || "development",
    // 入口文件，webpack 会从这个文件开始打包
    entry: "./src/main.js",
    output: {
      // 打包后的文件存放的目录
      path: path.resolve(__dirname, "./dist"),
      // 打包后的文件名
      filename: "bundle.[contenthash].js",
      clean: true, // 清除上次打包的文件
    },
    resolve: {
      extensions: extensions,
      alias: {
        src: path.join(cwd, "src"), // 设置别名
      },
    },
    devtool: isProd ? false : "eval-cheap-module-source-map",

    module: {
      rules: [
        {
          //对 js和jsx 文件进行编译
          test: /\.jsx?$/,
          use: [
            {
              loader: "babel-loader?cacheDirectory", //
              options: {
                cacheDirectory: true, // 开启 babel 缓存
              },
            },
          ],
        },
        // 对 css 文件进行编译
        // 这里使用了 style-loader 和 css-loader，前者用于将 CSS 插入到 DOM 中，后者用于解析 CSS 文件
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
          ],
        },
        {
          // scss 文件编译
          test: /\.(scss|sass)$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
            },
          ],
        },
        {
          test: /\.(less)$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
            {
              loader: "less-loader",
            },
          ],
        },
        {
          test: /\.json5$/,
          use: [
            {
              loader: "json5-loader",
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: [/node_modules/, /styles?/],
          use: [
            {
              loader: "svg-react-loader",
            },
          ],
        },
      ],
    },

    plugins: [
      // 用于生成 index.html
      new HtmlWebpackPlugin({
        title: "react-webpack-learn",
        meta: {
          viewport: "width=device-width",
        },
        template: "./src/index.html",
      }),
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: "react",
            entry: "https://unpkg.com/react@18/umd/react.development.js",
            global: "React",
          },
          {
            module: "react-dom",
            entry:
              "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
            global: "ReactDOM",
          },
        ],
      }),
    ],
    devServer: {
      static: path.join(cwd, "public"), // 静态文件目录
      compress: true, // 启用 gzip 压缩
      port, // 端口号
      open: true, // 启动后自动打开浏览器
      hot: true, // 启用热模块替换
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
  };
};
