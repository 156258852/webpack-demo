import { useRef, useEffect } from 'react';

interface IPollConfig {
  /**
   * 定时执行，重复执行，单位 ms
   */
  refreshInterval?: number;
  /**
   * 定时执行，执行一次，单位 ms
   */
  refreshTimeout?: number;
}

function usePoll(service: () => void | Promise<void>, options?: IPollConfig) {
  const timer = useRef<number | null>(null);

  const { refreshInterval, refreshTimeout } = options || {};
  const delay = refreshInterval || refreshTimeout;

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const polling = () => {
    clear();
    timer.current = setTimeout(() => {
      service();
      if (refreshInterval) {
        polling();
      }
    }, delay) as unknown as number;
  };

  useEffect(() => {
    if (delay) {
      polling();
    }
    return clear;
  }, [delay]);
}

export default usePoll;
