const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config(); // Load environment variables from .env file
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

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
  devtool: "eval-cheap-module-source-map", // 开发模式下使用 source map，方便调试

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
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "react",
          entry: "https://unpkg.com/react@18/umd/react.development.js",
          global: "React",
        },
        {
          module: "react-dom",
          entry: "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
          global: "ReactDOM",
        },
      ],
    }),
  ],
  devServer: {
    static: path.join(__dirname, "./dist"), // 静态文件目录
    compress: true, // 启用 gzip 压缩
    port, // 端口号
    open: true, // 启动后自动打开浏览器
    hot: true, // 启用热模块替换
  },

  //如果是组件，可以使用 externals 来排除 react 和 react-dom 这两个库，避免打包到 bundle 中
  // 这样做的好处是可以减少 bundle 的体积，提高加载速度
  //还需要 peerDependencies 来声明 react 和 react-dom 是外部依赖
  //现在是使用了cdn 来引入 react 和 react-dom，所以不需要在这里配置 externals
  // externals: {
  //   react: "React", // React 作为外部依赖，不打包到 bundle 中
  //   "react-dom": "ReactDOM", // ReactDOM 作为外部依赖，不打包到 bundle 中
  // },
};
