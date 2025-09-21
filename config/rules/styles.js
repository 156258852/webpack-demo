/**
 * CSS样式规则配置
 * 处理CSS、SCSS、Less文件，包括CSS Modules支持
 */

/**
 * 创建CSS配置规则
 * @param {boolean} isProd - 是否为生产环境
 * @returns {Array} CSS规则数组
 */
const createStyleRules = (isProd) => {
  // 根据环境选择CSS加载器
  const cssLoader = isProd ? require("mini-css-extract-plugin").loader : "style-loader";

  // CSS Modules配置
  const cssModulesConfig = {
    esModule: true,
    modules: {
      localIdentName: isProd ? "[hash:base64:8]" : "[path][name]__[local]--[hash:base64:5]",
      auto: (resourcePath) => resourcePath.includes(".module."),
      exportLocalsConvention: "camelCase",
      namedExport: false,
    },
  };

  return [
    // 普通CSS文件
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: [
        { loader: cssLoader },
        { loader: "css-loader" },
      ],
    },
    // CSS Modules文件
    {
      test: /\.module\.css$/,
      use: [
        { loader: cssLoader },
        { loader: "css-loader", options: cssModulesConfig },
      ],
    },
    // SCSS/Sass文件
    {
      test: /\.(scss|sass)$/,
      exclude: /\.module\.(scss|sass)$/,
      use: [
        { loader: cssLoader },
        { loader: "css-loader" },
        { loader: "sass-loader" },
      ],
    },
    // SCSS/Sass Modules文件
    {
      test: /\.module\.(scss|sass)$/,
      use: [
        { loader: cssLoader },
        { loader: "css-loader", options: cssModulesConfig },
        { loader: "sass-loader" },
      ],
    },
    // Less文件
    {
      test: /\.less$/,
      exclude: /\.module\.less$/,
      use: [
        { loader: cssLoader },
        { loader: "css-loader" },
        { loader: "less-loader" },
      ],
    },
    // Less Modules文件
    {
      test: /\.module\.less$/,
      use: [
        { loader: cssLoader },
        { loader: "css-loader", options: cssModulesConfig },
        { loader: "less-loader" },
      ],
    },
  ];
};

/**
 * 获取样式规则列表
 * @param {boolean} isProd - 是否为生产环境
 * @returns {Array} 样式规则数组
 */
const getStyleRules = (isProd) => createStyleRules(isProd);

module.exports = {
  createStyleRules,
  getStyleRules,
};