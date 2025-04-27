import './index.less';
import Child  from "./Child";
import { promise } from "./utils";


const App = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
  // promise()
  });


  return (
    <React.Suspense fallback={<div>loading</div>}> 
      <div className="content">
        <button onClick={(e) => {
          setCount(count + 1);
        }}
        >
          Click
        </button>
        count: {count}
        <Child />
      </div>
    </React.Suspense>
  );
};

export default App;
