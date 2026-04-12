# useStorage

通用的 Storage Hook，提供 `useLocalStorage` 和 `useSessionStorage` 两个导出。

## useLocalStorage

### 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| key | `string` | 是 | - | localStorage 的 key |
| config | `StorageConfig` | 否 | `{}` | 配置项 |

### StorageConfig

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| defaultValue | `any` | - | 默认值，当 localStorage 中无值时返回 |

### 返回值

返回 `[value, setValue]`：

| 属性 | 类型 | 说明 |
|------|------|------|
| value | `T` | 当前值 |
| setValue | `(value: T \| null) => void` | 设置值，传入 `null` 会删除该 key |

### 使用示例

```tsx
import { useLocalStorage } from '@/hooks/useStorage';

function MyComponent() {
  const [user, setUser] = useLocalStorage<{ name: string }>('user', {
    defaultValue: { name: 'Guest' }
  });

  const clearUser = () => {
    setUser(null);  // 删除 localStorage 中的 user
  };

  return (
    <div>
      <p>User: {user.name}</p>
      <button onClick={() => setUser({ name: 'John' })}>设置用户</button>
      <button onClick={clearUser}>清除用户</button>
    </div>
  );
}
```

## useSessionStorage

与 `useLocalStorage` 用法相同，区别是数据存储在 `sessionStorage` 中，关闭浏览器标签页后数据会被清除。

### 参数

与 `useLocalStorage` 相同。

### 使用示例

```tsx
import { useSessionStorage } from '@/hooks/useStorage';

function MyComponent() {
  const [token, setToken] = useSessionStorage<string>('token');

  return (
    <div>
      <p>Token: {token}</p>
      <button onClick={() => setToken('abc123')}>设置 Token</button>
    </div>
  );
}
```