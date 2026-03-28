// 大数据排序计算 Worker
export default (params) => {
  const { size } = params;
  const data = Array.from({ length: size }, () => Math.random());
  const sorted = data.sort((a, b) => a - b);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sorted.reduce((s, n) => s + n, 0) / size,
    count: size
  };
};