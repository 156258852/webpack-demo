import "./index.less";
import React from "react";
import Child from "./Child";
const App = () => {
  const [count, setCount] = React.useState(0);



  return (
    <div className="content">
      <button onClick={ (e) => {
        setCount(count + 1);
      } }
      >
        Clicks 
      </button>
      count: { count }
      <Child />
      <div>22</div>
    </div>
  );
};

export default App;
