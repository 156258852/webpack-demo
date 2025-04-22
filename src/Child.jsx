import { promise } from "src/utils";
const Child = () => {
  React.useEffect(() => {
    promise()
  })

  class A {
    constructor() {
      console.log('a')
    }
    a() {
      console.log('a')
    }

  }


  return <div>Child </div>;
};

export default Child;