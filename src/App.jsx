import React from "react";
import workerCode from './worker/test.worker';
import Child from "./Child";
import Test from './test';
import { CodeHight } from "./Component";
const App = () => {

  const workerRef = React.useRef();

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
      <Child />
      <Test/>
      <CodeHight text="import React from 'react';" markText=" r"/>
    </div>
  );
};

export default App;
