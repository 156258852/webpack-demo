const net = require("net");
// 检查端口是否被占用并自动递增
const findAvailablePort = (startPort) => new Promise((resolve, reject) => {
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

const extensions = [
  ".jsx",
  ".tsx",
  ".ts",
  ".scss",
  ".less",
  ".css",
  ".sass",
  "...",
]; // 解析文件的后缀名，... 表示 js、json 等后缀名

module.exports = {
  findAvailablePort,
  extensions,
};
