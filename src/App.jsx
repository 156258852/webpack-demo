import "./index.less";
import React from "react";
import testImgSrc from 'src/images/1.png';
import workerCode from './worker/test.worker';
import Child from "./Child";


const App = () => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const url = URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' }));
    const worker = new Worker(url);
    worker.postMessage('Hello');
    worker.onmessage = function (e) {
      console.log(e.data); // 输出: Hello from worker: Hello
    };
  }, []);


  return (
    <div className="content">
      <button onClick={ (e) => {
        console.log("🚀 ~ App ~ e:", e);
        setCount(count + 1);
      } }
      >
        Clicks 
      </button>
      count: { count }
      <Child />
      <img src={testImgSrc} alt="" />
      <div>22</div>
    </div>
  );
};

export default App;
