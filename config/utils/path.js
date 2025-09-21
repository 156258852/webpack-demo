/**
 * 路径工具模块
 * 负责路径解析和文件扩展名相关功能
 */

/**
 * 支持的文件扩展名
 */
const extensions = [
  ".jsx",
  ".tsx",
  ".ts",
  ".scss",
  ".less",
  ".css",
  ".sass",
  "...", // js、json 等默认后缀名
];

/**
 * 获取项目根目录
 * @returns {string} 项目根目录路径
 */
const getProjectRoot = () => process.cwd();

/**
 * 检查文件是否为模块文件（包含.module.）
 * @param {string} resourcePath - 文件路径
 * @returns {boolean} 是否为模块文件
 */
const isModuleFile = (resourcePath) => resourcePath.includes(".module.");

module.exports = {
  extensions,
  getProjectRoot,
  isModuleFile,
};