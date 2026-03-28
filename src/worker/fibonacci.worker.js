// 斐波那契数列 Worker
export default async (params) => {
  console.log('fibonacci.worker.js');
  const { n } = params;
  const fib = (num) => {
    if (num <= 1) return num;
    return fib(num - 1) + fib(num - 2);
  };
  return fib(n);
};
