const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  mode: "production", // 设置为生产模式
  // 入口文件，webpack 会从这个文件开始打包
  entry: "./src/main.js",
  output: {
    // 打包后的文件存放的目录
    path: path.resolve(__dirname, "../dist"),
    // 打包后的文件名
    filename: "bundle.[contenthash].js",
    clean: true, // 清除上次打包的文件
  },
  resolve: {
    extensions: [".jsx", "..."], // 解析文件的后缀名
    alias: {
      "@": path.resolve(__dirname, "src"), // 设置别名
    },
  },
  devtool: false,

  module: {
    rules: [
      {
        // 对 js 和 jsx 文件进行编译
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
            // loader: "style-loader",
            loader: MiniCssExtractPlugin.loader, // 将 CSS 提取到单独的文件中
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
            // loader: "style-loader",
            loader: MiniCssExtractPlugin.loader,
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
            // loader: "style-loader",
            loader: MiniCssExtractPlugin.loader,
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
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }), // 提取 CSS 文件
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

  optimization: {
    splitChunks: {
      chunks: "all",
      // 对于 node_modules 中的文件进行分离
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10, // 设置优先级，确保优先分离 node_modules
          filename: "[name].[contenthash].js",
          minSize: 0,
          minChunks: 1,
        },
        default: {
          name: "common",
          chunks: "all",
          priority: -20, // 设置优先级，确保优先分离公共代码
          filename: "[name].[contenthash].js",
          minSize: 0,
          minChunks: 1,
        },
      },
    },
  },
};
