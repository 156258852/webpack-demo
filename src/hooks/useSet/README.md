# useSet

基于 `useReducer` 实现的状态管理 Hook，类似 Class Component 的 `setState`，适用于复杂对象模式。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| initState | `T` | 是 | - | 初始状态对象 |

## 返回值

返回一个数组 `[state, setState]`：

| 属性 | 类型 | 说明 |
|------|------|------|
| state | `T` | 当前状态 |
| setState | `(action: T \| ((prev: T) => T)) => void` | 更新函数 |

## 使用示例

### 基础用法 - 对象合并

```tsx
import useSet from '@/hooks/useSet';

function MyComponent() {
  const [state, setState] = useSet({
    name: '',
    age: 0,
    loading: false
  });

  const updateName = () => {
    setState({ name: 'John' }); // 自动合并
  };

  const updateMultiple = () => {
    setState({ name: 'Jane', age: 25 }); // 批量合并
  };

  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <button onClick={updateName}>更新名字</button>
    </div>
  );
}
```

### 函数式更新

```tsx
const [state, setState] = useSet({ count: 0 });

// 使用函数更新
setState((prev) => ({ count: prev.count + 1 }));
```

### 与 Class setState 对比

```tsx
// Class Component
this.setState({ name: 'John' });  // 合并更新

// useSet Hook
setState({ name: 'John' });       // 同样的合并行为
```