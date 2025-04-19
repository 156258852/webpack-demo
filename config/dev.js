const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config(); // Load environment variables from .env file
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const port = process.env.PORT || 9000;

module.exports = {
  mode: "development",
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
    extensions: [".jsx", "..."], // 解析文件的后缀名，... 表示 js、json 等后缀名
    alias: {
      "@": path.resolve(__dirname, "src"), // 设置别名
    },
  },
  devtool: "eval-source-map",

  module: {
    rules: [
      {
        //对 js和jsx 文件进行编译
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
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
    ],
  },

  plugins: [
    new ReactRefreshPlugin(), // 热更新插件
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: "react-webpack-learn",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
    }),
  ],
  devServer: {
    static: path.join(__dirname, "./dist"), // 静态文件目录
    compress: true, // 启用 gzip 压缩
    port, // 端口号
    open: true, // 启动后自动打开浏览器
    hot: true, // 启用热模块替换
  },
};
