# useDynamicList

动态列表管理 Hook，提供丰富的列表操作方法，并为每个列表项生成唯一 key，适合需要动态增删改的列表场景（如动态表单）。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| initialList | `T[]` | 否 | `[]` | 初始列表数据 |

## 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| list | `T[]` | 当前列表数据 |
| insert | `(index: number, item: T) => void` | 在指定位置插入元素 |
| merge | `(index: number, items: T[]) => void` | 在指定位置批量插入元素 |
| replace | `(index: number, item: T) => void` | 替换指定位置的元素 |
| remove | `(index: number) => void` | 删除指定位置的元素 |
| getKey | `(index: number) => number` | 获取指定位置元素的唯一 key |
| getIndex | `(key: number) => number` | 根据 key 获取元素位置 |
| move | `(oldIndex: number, newIndex: number) => void` | 移动元素位置 |
| push | `(item: T) => void` | 在末尾添加元素 |
| pop | `() => void` | 删除末尾元素 |
| unshift | `(item: T) => void` | 在开头添加元素 |
| shift | `() => void` | 删除开头元素 |
| resetList | `(newList: T[]) => void` | 重置整个列表 |

## 使用示例

### 基础用法

```tsx
import useDynamicList from '@/hooks/useDynamicList';

function DynamicForm() {
  const { list, insert, remove, push, getKey } = useDynamicList([
    { name: 'Item 1' }
  ]);

  return (
    <div>
      {list.map((item, index) => (
        <div key={getKey(index)}>
          <input value={item.name} />
          <button onClick={() => remove(index)}>删除</button>
        </div>
      ))}
      <button onClick={() => push({ name: `Item ${list.length + 1}` })}>
        添加
      </button>
    </div>
  );
}
```

### 在指定位置插入

```tsx
const { list, insert, getKey } = useDynamicList(['a', 'b', 'c']);

insert(1, 'x');  // ['a', 'x', 'b', 'c']
```

### 批量插入

```tsx
const { list, merge } = useDynamicList(['a', 'b']);

merge(1, ['x', 'y']);  // ['a', 'x', 'y', 'b']
```

### 移动元素

```tsx
const { list, move } = useDynamicList(['a', 'b', 'c', 'd']);

move(0, 2);  // ['b', 'c', 'a', 'd']  将第一个元素移到第三个位置
```

### 重置列表

```tsx
const { list, resetList } = useDynamicList();

resetList([{ id: 1 }, { id: 2 }, { id: 3 }]);
```

## 为什么需要 getKey？

在动态列表中，使用数组 index 作为 key 可能导致 React 渲染问题。`useDynamicList` 为每个元素生成稳定的唯一 key：

```tsx
// ❌ 不推荐 - index 作为 key
{list.map((item, index) => <div key={index}>{item}</div>)}

// ✅ 推荐 - 使用 getKey
{list.map((item, index) => <div key={getKey(index)}>{item}</div>)}
```