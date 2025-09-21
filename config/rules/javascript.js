/**
 * JavaScript/TypeScript规则配置
 * 处理JS、TS、JSX、TSX文件的编译规则
 */

/**
 * 创建JavaScript/TypeScript规则
 * @param {boolean} isProd - 是否为生产环境
 * @returns {Object} JS/TS规则
 */
const createJavaScriptRules = (isProd) => ({
  test: /\.(ts|js)x?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: {
        cacheDirectory: true,
        plugins: [
          !isProd && require.resolve("react-refresh/babel"),
        ].filter(Boolean)
      },
    },
  ],
});

/**
 * 获取JavaScript规则列表
 * @param {boolean} isProd - 是否为生产环境
 * @returns {Array} JavaScript规则数组
 */
const getJavaScriptRules = (isProd) => [
  createJavaScriptRules(isProd),
];

module.exports = {
  createJavaScriptRules,
  getJavaScriptRules,
};