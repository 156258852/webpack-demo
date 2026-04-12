# usePoll

轮询 Hook，支持定时重复执行或执行一次。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| service | `() => void \| Promise<void>` | 是 | - | 要执行的函数 |
| options | `IPollConfig` | 否 | `{}` | 配置项 |

### IPollConfig

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| refreshInterval | `number` | - | 定时重复执行，单位 ms |
| refreshTimeout | `number` | - | 定时执行一次，单位 ms |

> 注意：`refreshInterval` 和 `refreshTimeout` 同时存在时，优先使用 `refreshInterval`。

## 使用示例

### 重复轮询

```tsx
import usePoll from '@/hooks/usePoll';

function MyComponent() {
  const fetchData = async () => {
    const res = await fetch('/api/data');
    console.log(res.json());
  };

  // 每 5 秒执行一次
  usePoll(fetchData, { refreshInterval: 5000 });

  return <div>正在轮询数据...</div>;
}
```

### 执行一次

```tsx
import usePoll from '@/hooks/usePoll';

function MyComponent() {
  // 3 秒后执行一次
  usePoll(() => {
    console.log('延迟执行');
  }, { refreshTimeout: 3000 });

  return <div>等待执行...</div>;
}
```

### 配合 useRequest

```tsx
import useRequest from '@/hooks/useRequest';

// useRequest 内部已集成 usePoll
const { data } = useRequest(fetchService, {
  refreshInterval: 10000  // 每 10 秒刷新
});
```