// example.worker.js
self.onmessage = function (e) {
  postMessage('Hello from worker: ' + e.data);
};