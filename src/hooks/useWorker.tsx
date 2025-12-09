import React from 'react';

type WorkerConfig = {
  /** 执行worker逻辑传入的参数 */
  params?: object;
  /** 当hooks卸载的时候是否卸载worker */
  closeWorkerOnUnmount?: boolean;
  /** 是否指定手动执行worker逻辑 */
  manual?: boolean;
}

const utils = {
  createWorkerCode: (code: string) => {
    code = code.replace('export default ', 'const __worker_run = ');
    return (`
      onmessage = async (e) => {
        ${code}
        const __worker_result = await __worker_run(e.data);
        postMessage(__worker_result);
      };
    `);
  },
};

/**
   * 使用worker执行负责逻辑
   * @param code worker文件内容字符串
   */
const useWorker = (code: string, config = {} as WorkerConfig) => {
  const {
    params,
    closeWorkerOnUnmount = true, // hooks卸载时是否结束worker
    manual = false, // 是否手动执行worker
  } = config;
  const [data, setData] = React.useState();

  const worker = React.useMemo(() => {
    const content = utils.createWorkerCode(code);
    const url = URL.createObjectURL(new Blob([content], { type: 'text/javascript' }));
    return new Worker(url);
  }, [code]);

  React.useEffect(() => {
    worker.onmessage = (e) => { // 监听worker接收事件，然后更新result
      setData(e.data);
    };
    return () => {
      closeWorkerOnUnmount && worker.terminate(); // hooks卸载时是否结束worker
    };
  }, []);

  React.useEffect(() => {
    !manual && worker.postMessage(params);
  }, [JSON.stringify(params)]);

  // 手动执行worker逻辑
  const runWorker = (p: any) => {
    worker.postMessage(p);
  };

  return {
    data,
    runWorker,
    worker,
  };
};

export default useWorker;
