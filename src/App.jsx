import React, { useEffect, useState } from "react";
import workerCode from './worker/test.worker';
import Child from "./Child";
import { Highlight } from "./Component";
import MaskBtn from "./Component/Guide";
import useMountedState from "./hooks/useMountedState";
const App = () => {

  const workerRef = React.useRef();
  const ref = React.useRef();
  const isMounted = useMountedState();
  

  React.useEffect(() => {
    workerRef.current = new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })));
    workerRef.current.postMessage('Hello');
    workerRef.current.onmessage = function (e) {
      console.log(e.data); // 输出: Hello from worker: Hello
    };
    return () => {
      workerRef.current.terminate(); // 释放资源
    };
  }, []);
  return (
    <div className="content">
      {isMounted && <MaskBtn container={ref}/>}
      <Child />
      <div ref={ref}>搜索</div>
      <Highlight text="import React from 'react';" markText=" r" caseSensitive={false} />
    </div>
  );
};

export default App;
