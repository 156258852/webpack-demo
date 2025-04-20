import React from "react";
import './index.less'
import Child  from "./Child";
import { promise } from "./utils";

const App = () => {
  const [count, setCount] = React.useState(0)


React.useEffect(() => {
  promise()
})


  return (
    <div className="content">
      <button onClick={(e) => {
        setCount(count + 1)
      }}>Click</button>
     count: {count}
     <Child/>
    </div>
  );
};

export default App;
