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
     {/* {杀杀杀} */}
     222333ssss11112ss22
     <Child/>
    </div>
  );
};

export default App;
