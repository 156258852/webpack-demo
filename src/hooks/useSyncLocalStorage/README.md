# useSyncLocalStorage

基于 `useSyncExternalStore` 实现的 localStorage Hook，支持跨浏览器标签页同步。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| key | `string` | 是 | - | localStorage 的 key |
| initialValue | `T` | 否 | - | 初始值 |

## 返回值

返回一个数组 `[value, setValue]`：

| 属性 | 类型 | 说明 |
|------|------|------|
| value | `T` | 当前存储的值 |
| setValue | `(value: T \| ((prev: T) => T)) => void` | 设置值函数 |

## 特性

- 支持 SSR（提供 `getServerSnapshot`）
- 跨标签页自动同步（监听 `storage` 事件）
- 支持函数式更新

## 使用示例

### 基础用法

```tsx
import useSyncLocalStorage from '@/hooks/useSyncLocalStorage';

function MyComponent() {
  const [theme, setTheme] = useSyncLocalStorage<string>('theme', 'light');

  return (
    <div>
      <p>当前主题: {theme}</p>
      <button onClick={() => setTheme('dark')}>切换暗色</button>
      <button onClick={() => setTheme('light')}>切换亮色</button>
    </div>
  );
}
```

### 函数式更新

```tsx
const [count, setCount] = useSyncLocalStorage<number>('count', 0);

setCount((prev) => prev + 1);
```

### 跨标签页同步

```tsx
// 在标签页 A 修改值
setTheme('dark');

// 标签页 B 会自动同步收到 'dark'
// 无需刷新页面
```

## 与 useLocalStorage 的区别

| 特性 | useSyncLocalStorage | useLocalStorage |
|------|---------------------|-----------------|
| 跨 Tab 同步 | ✅ 自动同步 | ❌ 不支持 |
| SSR 支持 | ✅ 支持 | ❌ 不支持 |
| 实现方式 | useSyncExternalStore | useState |