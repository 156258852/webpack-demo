const net = require("net");

/**
 * 端口工具模块
 * 负责端口检测和分配相关功能
 */

/**
 * 检查端口是否被占用并自动递增
 * @param {number} startPort - 起始端口号
 * @returns {Promise<number>} 可用端口号
 */
const findAvailablePort = (startPort) => new Promise((resolve, reject) => {
  const server = net.createServer();

  server.listen(startPort, () => {
    const { port } = server.address();
    server.close(() => {
      console.log("Port", port, "is closed and available.");
      resolve(port);
    });
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      resolve(findAvailablePort(startPort + 1));
    } else {
      reject(err);
    }
  });
});

module.exports = {
  findAvailablePort,
};