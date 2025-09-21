/**
 * 资源文件规则配置
 * 处理图片、字体、SVG、JSON5、Worker等静态资源
 */

/**
 * 创建资源文件规则
 * @returns {Array} 资源规则数组
 */
const createAssetRules = () => [
  // JSON5文件
  {
    test: /\.json5$/,
    use: [{ loader: "json5-loader" }],
  },
  // SVG文件（React组件）
  {
    test: /\.svg$/,
    exclude: [/node_modules/, /styles?/],
    use: [{ loader: "svg-react-loader" }],
  },
  // SVG文件（资源）
  {
    test: /\.svg$/,
    include: [/node_modules/, /styles?/],
    type: "asset",
  },
  // 图片文件
  {
    test: /\.(png|jpg|gif|jpeg)$/i,
    type: "asset",
    parser: {
      dataUrlCondition: {
        maxSize: 10 * 1024, // 10kb
      },
    },
    generator: {
      filename: "images/[name].[hash:8][ext]",
    },
  },
  // 字体文件
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
    generator: {
      filename: "fonts/[name].[hash:8][ext]",
    },
  },
  // Web Worker文件
  {
    test: /\.worker\.(js|ts)$/i,
    use: [{ loader: "raw-loader" }],
  },
];

/**
 * 获取资源规则列表
 * @returns {Array} 资源规则数组
 */
const getAssetRules = () => createAssetRules();

module.exports = {
  createAssetRules,
  getAssetRules,
};