import React from "react";
import './index.less'
const Child = () => {
  return <div>Child </div>;
};

const App = () => {
  const [count, setCount] = React.useState(0)
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
