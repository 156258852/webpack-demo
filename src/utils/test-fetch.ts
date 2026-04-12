/**
 * 测试 fetch 封装的缓存功能
 * 在浏览器控制台运行测试
 */

import http from './http';
import { cacheStore, generateCacheKey } from './fetcher';

// 初始化配置
http.initConfig({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 15000,
  cache: true,
});

// 测试用例
async function runTests() {
  console.log('=== 开始测试缓存功能 ===\n');

  // 测试 1：首次请求
  console.log('测试 1: 首次请求（无缓存）');
  const t1Start = performance.now();
  const response1 = await http.get('/posts/1');
  const t1End = performance.now();
  console.log('耗时:', (t1End - t1Start).toFixed(2), 'ms');
  console.log('数据:', response1.data);
  console.log('状态码:', response1.status);
  console.log('缓存存储:', Object.keys(cacheStore.responseData).length, '个\n');

  // 测试 2：重复请求（应命中缓存）
  console.log('测试 2: 重复请求（应命中缓存）');
  const t2Start = performance.now();
  const response2 = await http.get('/posts/1');
  const t2End = performance.now();
  console.log('耗时:', (t2End - t2Start).toFixed(2), 'ms');
  console.log('数据:', response2.data);
  console.log('是否同一条数据:', response1.data === response2.data || JSON.stringify(response1.data) === JSON.stringify(response2.data));
  console.log('缓存存储:', Object.keys(cacheStore.responseData).length, '个\n');

  // 测试 3：不同参数（新请求）
  console.log('测试 3: 不同参数（新请求）');
  const response3 = await http.get('/posts/1', { _t: Date.now() });
  console.log('缓存存储:', Object.keys(cacheStore.responseData).length, '个\n');

  // 测试 4：并发请求（应复用正在进行的请求）
  console.log('测试 4: 并发请求（应复用）');
  const p1 = http.get('/posts/2');
  const p2 = http.get('/posts/2');
  const [r1, r2] = await Promise.all([p1, p2]);
  console.log('两个请求结果相同:', JSON.stringify(r1.data) === JSON.stringify(r2.data));
  console.log('缓存存储:', Object.keys(cacheStore.responseData).length, '个\n');

  // 测试 5：清除指定缓存
  console.log('测试 5: 清除缓存');
  const cacheKey = generateCacheKey('https://jsonplaceholder.typicode.com/posts/1', undefined);
  http.clearCache(cacheKey);
  console.log('清除后缓存存储:', Object.keys(cacheStore.responseData).length, '个\n');

  console.log('=== 测试完成 ===');
}

// 运行测试
runTests().catch(console.error);

export default runTests;
