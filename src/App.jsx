import "./index.less";
import React from "react";
import ss from 'src/images/1.png';
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
      <img src={ss} alt="" />
      <div>22</div>
    </div>
  );
};

export default App;
