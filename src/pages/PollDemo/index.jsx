import React, { useState, useCallback } from 'react';
import { usePoll } from 'lhy-map-hooks';
import './style.scss';

const PollDemo = () => {
  const [random, setRandom] = useState(Math.floor(Math.random() * 1000));
  const [interval, setInterval] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);

  const service = useCallback(() => {
    setRandom(Math.floor(Math.random() * 1000));
  }, []);

  usePoll(service, {
    refreshInterval: isRunning ? interval : undefined,
  });

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleIntervalChange = (e) => {
    setInterval(Number(e.target.value));
  };

  return (
    <div className="poll-demo">
      <h2>轮询 Hook 演示</h2>
      
      <p className="description">
        usePoll 可以定时执行异步任务，适用于需要定期刷新数据的场景。
      </p>
      
      <div className="demo-section">
        <div className="input-row">
          <label>轮询间隔 (ms):</label>
          <select value={interval} onChange={handleIntervalChange}>
            <option value={500}>500ms</option>
            <option value={1000}>1000ms</option>
            <option value={2000}>2000ms</option>
            <option value={5000}>5000ms</option>
          </select>
        </div>
        
        <div className="button-row">
          <button onClick={handleStart} disabled={isRunning}>
            开始
          </button>
          <button onClick={handleStop} disabled={!isRunning}>
            停止
          </button>
        </div>
        
        <div className="result-box">
          <div className="status">
            状态: <span className={isRunning ? 'running' : 'stopped'}>
              {isRunning ? '运行中' : '已停止'}
            </span>
          </div>
          <div className="random-value">
            随机值: <span className="value">{random}</span>
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h3>使用说明</h3>
        <ul>
          <li>设置 refreshInterval 为 undefined 可停止轮询</li>
          <li>适用于数据刷新、状态检查等场景</li>
          <li>组件卸载时自动停止轮询</li>
        </ul>
      </div>
    </div>
  );
};

export default PollDemo;