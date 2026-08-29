import React, { useState } from 'react';
import http from 'src/http/http';

// 初始化配置
http.initConfig({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 15000,
  cache: true, // 默认开启缓存
});

function FetchTest() {
  const [logs, setLogs] = useState([]);
  const [cacheCount, setCacheCount] = useState(0);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const updateCacheCount = () => {
    // 通过尝试请求来间接判断缓存状态
    setCacheCount(prev => prev);
  };

  // 测试 1：首次请求 + 缓存命中
  const testCache = async () => {
    addLog('=== 开始测试缓存 ===');

    // 第一次请求
    addLog('第 1 次请求 /posts/1 ...');
    const t1 = performance.now();
    const r1 = await http.get('/posts/1');
    const t2 = performance.now();
    addLog(`第 1 次耗时：${(t2 - t1).toFixed(2)}ms, 标题：${r1.data.title?.substring(0, 20)}...`);
    addLog(`状态码：${r1.status}`);

    // 第二次请求（应命中缓存）
    addLog('第 2 次请求 /posts/1（应命中缓存）...');
    const t3 = performance.now();
    const r2 = await http.get('/posts/1');
    const t4 = performance.now();
    addLog(`第 2 次耗时：${(t4 - t3).toFixed(2)}ms, 标题：${r2.data.title?.substring(0, 20)}...`);

    addLog(`缓存命中节省时间：${((t2 - t1) - (t4 - t3)).toFixed(2)}ms`);

    // 第三次请求，禁用缓存
    addLog('第 3 次请求 /posts/1（禁用缓存）...');
    const t5 = performance.now();
    const r3 = await http.get('/posts/1', {}, { cache: false });
    const t6 = performance.now();
    addLog(`第 3 次耗时：${(t6 - t5).toFixed(2)}ms, 标题：${r3.data.title?.substring(0, 20)}...`);
    addLog(`单次 config 覆盖全局 cache: ${t6 - t5 > 100 ? '成功' : '失败'}`);

    addLog('=== 测试完成 ===\n');
  };

  // 测试 2：并发请求复用
  const testConcurrent = async () => {
    addLog('=== 测试并发请求复用 ===');

    addLog('同时发起 2 个相同的请求...');
    const t1 = performance.now();
    const [r1, r2] = await Promise.all([
      http.get('/posts/2'),
      http.get('/posts/2'),
    ]);
    const t2 = performance.now();
    addLog(`两个请求完成，耗时：${(t2 - t1).toFixed(2)}ms`);
    addLog(`结果相同：${JSON.stringify(r1.data) === JSON.stringify(r2.data)}`);
    addLog('=== 测试完成 ===\n');
  };

  // 清空所有缓存
  const clearAll = () => {
    http.clearCache();
    addLog('已清空所有缓存\n');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Fetch 缓存测试</h2>

      <div style={{ marginBottom: 16 }}>
        <button onClick={testCache} style={{ marginRight: 8 }}>
          测试缓存命中
        </button>
        <button onClick={testConcurrent} style={{ marginRight: 8 }}>
          测试并发复用
        </button>
        <button onClick={clearAll}>
          清空所有缓存
        </button>
      </div>

      <div style={{
        background: '#f5f5f5',
        padding: 12,
        borderRadius: 4,
        maxHeight: 300,
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: 12,
        whiteSpace: 'pre-wrap'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#999' }}>点击按钮运行测试...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ marginBottom: 4 }}>{log}</div>
          ))
        )}
      </div>
    </div>
  );
}

export default FetchTest;
