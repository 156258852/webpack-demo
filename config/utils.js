const net = require("net");
// 检查端口是否被占用并自动递增
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const { port } = server.address();
      // 端口可用时，关闭服务器
      server.close(() => {
        console.log("Port", port, "is closed and available.");
        // 关闭服务器后，返回可用端口
        resolve(port);
      });
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(findAvailablePort(startPort + 1)); // 端口被占用时递增
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  findAvailablePort,
};
