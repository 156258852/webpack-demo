# useToggle

布尔值切换 Hook，基于 `useReducer` 实现。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| initialValue | `boolean` | 是 | - | 初始值 |

## 返回值

返回一个数组 `[value, toggle]`：

| 属性 | 类型 | 说明 |
|------|------|------|
| value | `boolean` | 当前布尔值 |
| toggle | `(nextValue?: boolean) => void` | 切换函数，传入值则设置为该值，不传则取反 |

## 使用示例

### 基础用法

```tsx
import useToggle from '@/hooks/useToggle';

function MyComponent() {
  const [visible, toggleVisible] = useToggle(false);

  return (
    <div>
      <button onClick={() => toggleVisible()}>
        {visible ? '隐藏' : '显示'}
      </button>
      {visible && <div>内容区域</div>}
    </div>
  );
}
```

### 设置指定值

```tsx
const [enabled, toggleEnabled] = useToggle(false);

// 切换为 true
toggleEnabled(true);

// 切换为 false
toggleEnabled(false);

// 取反
toggleEnabled();
```