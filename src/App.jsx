import React from "react";
import workerCode from './worker/test.worker';
import Child from "./Child";
import { CodeHight } from "./Component";
import MaskBtn from "./Component/Guide";
const App = () => {

  const workerRef = React.useRef();
  const ref = React.useRef();

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
      <MaskBtn container={()=> ref.current}/>
      <Child />
    
      <CodeHight text="import React from 'react';" markText=" r" />
      <div>
        <CodeHight text="import React from 'react';" markText=" r" />
      </div>
      <div>
        <CodeHight text="import React from 'react';" markText=" r" />
      </div>
      <div>
        <CodeHight text="import React from 'react';" markText=" r" />
      </div>
      <div ref={ref}>搜索</div>
    </div>
  );
};

export default App;
