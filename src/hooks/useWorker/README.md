# useWorker

使用 Web Worker 执行复杂逻辑，避免阻塞主线程。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| code | `string` | 是 | - | Worker 文件内容字符串，需要包含 `export default` 函数 |
| config | `WorkerConfig` | 否 | `{}` | 配置项 |

### WorkerConfig

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| params | `object` | - | 执行 Worker 逻辑传入的参数 |
| closeWorkerOnUnmount | `boolean` | `true` | Hook 卸载时是否终止 Worker |
| manual | `boolean` | `false` | 是否手动执行 Worker 逻辑 |

## 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| data | `any` | Worker 返回的结果 |
| runWorker | `(params: any) => void` | 手动执行 Worker 的函数 |
| worker | `Worker` | Worker 实例 |

## 使用示例

### 自动执行

```tsx
import useWorker from '@/hooks/useWorker';

const workerCode = `
  export default async (data) => {
    // 执行复杂计算
    const result = data.map(item => item * 2);
    return result;
  }
`;

function MyComponent() {
  const { data } = useWorker(workerCode, {
    params: [1, 2, 3, 4, 5]
  });

  return <div>{JSON.stringify(data)}</div>;
}
```

### 手动执行

```tsx
import useWorker from '@/hooks/useWorker';

function MyComponent() {
  const { data, runWorker } = useWorker(workerCode, {
    manual: true
  });

  const handleClick = () => {
    runWorker({ value: 100 });
  };

  return (
    <div>
      <button onClick={handleClick}>执行计算</button>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
```