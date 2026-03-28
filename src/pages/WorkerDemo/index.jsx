import React, { useState } from 'react';
import useWorker from 'src/hooks/useWorker';
import fibonacciCode from 'src/worker/fibonacci.worker.js';
import './style.scss';

const WorkerDemo = () => {
  const [fibN, setFibN] = useState(30);
  const [loading, setLoading] = useState(false);

  // 斐波那契 Worker
  const { data: fibResult, runWorker: runFib } = useWorker(fibonacciCode, { manual: true });

  React.useEffect(() => {
    if (fibResult) {
      setLoading(false);
    }
  }, [fibResult]);

  const handleFib = () => {
    setLoading(true);
    runFib({ n: fibN });
  };

  return (
    <div className="worker-demo">
      <h2>Web Worker 演示</h2>

      <p className="description">
        Web Worker 可以在后台线程执行复杂计算，避免阻塞主线程 UI。
      </p>

      <div className="demo-section">
        <h3>斐波那契数列</h3>
        <div className="input-row">
          <label>n:</label>
          <input
            type="number"
            value={fibN}
            onChange={(e) => setFibN(Number(e.target.value))}
          />
          <button onClick={handleFib} disabled={loading}>
            计算 fib(n)
          </button>
        </div>

        {fibResult !== undefined && (
          <div className="result-box">
            <p>fib({fibN}) = {fibResult}</p>
          </div>
        )}
      </div>

      {loading && <div className="loading">计算中...</div>}
    </div>
  );
};

export default WorkerDemo;