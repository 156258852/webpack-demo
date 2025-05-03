import "./index.less";
import React from "react";
import ss from 'src/images/1.png';
import workerCode from './worker/test.worker';
import Child from "./Child";
const App = () => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {

    const worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })));
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
      <img src={ss} alt="" />
      <div>22</div>
    </div>
  );
};

export default App;
