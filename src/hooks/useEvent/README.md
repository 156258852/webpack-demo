# useEvent

事件监听 Hook，配合 `EventCenter` 实现跨组件通信。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| name | `string \| number` | 是 | - | 事件名称 |
| handler | `(data: any) => void` | 是 | - | 事件处理函数，传入 `null/false` 不监听 |
| isOnce | `boolean` | 否 | `false` | 是否只监听一次 |

## 使用示例

### 基础监听

```tsx
import { useEvent, dispatch } from '@/hooks/useEvent';

function ChildComponent() {
  useEvent('user-update', (data) => {
    console.log('收到用户更新:', data);
  });

  return <div>Child</div>;
}

function ParentComponent() {
  const handleClick = () => {
    dispatch('user-update', { name: 'John', age: 25 });
  };

  return (
    <div>
      <ChildComponent />
      <button onClick={handleClick}>触发事件</button>
    </div>
  );
}
```

### 单次监听

```tsx
useEvent('alert', (msg) => {
  alert(msg);
}, true);  // 只触发一次后自动移除
```

### 条件监听

```tsx
// 当 loading 为 true 时不监听
useEvent('data-ready', loading ? null : (data) => {
  processData(data);
});
```

## EventCenter API

`useEvent` 基于 `EventCenter` 实现，也可以直接使用：

### on - 注册事件

```tsx
import { on, dispatch } from '@/hooks/useEvent';

// 注册持久事件
on({ name: 'my-event', handler: (data) => console.log(data) });

// 触发事件
dispatch('my-event', { value: 1 });
```

### once - 单次事件

```tsx
import { once, dispatch } from '@/hooks/useEvent';

once({ name: 'once-event', handler: (data) => console.log('只触发一次', data) });

dispatch('once-event', { msg: 'hello' });  // 触发
dispatch('once-event', { msg: 'hello' });  // 不再触发
```

### off - 移除事件

```tsx
import { on, off, dispatch } from '@/hooks/useEvent';

const handler = (data) => console.log(data);

on({ name: 'test', handler });

// 移除特定 handler
off('test', handler);
```

### dispatch - 触发事件

```tsx
import { dispatch } from '@/hooks/useEvent';

// 触发事件，可传任意数据
dispatch('user-login', { userId: 123, token: 'xxx' });

// 不传数据
dispatch('clear-cache');
```