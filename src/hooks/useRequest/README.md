# useRequest

请求管理 Hook，支持自动请求、手动请求、分页、轮询等功能。

## 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| service | `(params?) => Promise<any>` | 是 | - | 请求函数 |
| options | `Options` | 否 | `{}` | 配置项 |

### Options

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| manual | `boolean` | `false` | 是否手动执行，默认自动执行 |
| deps | `DependencyList` | - | 依赖数组，变化时重新请求 |
| defaultParams | `object` | - | 默认参数 |
| paginated | `boolean` | `false` | 是否开启分页模式 |
| paginationFormater | `PaginationFormater` | - | 自定义分页数据转换器 |
| refreshInterval | `number` | - | 轮询间隔（重复执行），单位 ms |
| refreshTimeout | `number` | - | 延迟执行一次，单位 ms |
| onSuccess | `(data: any) => void` | - | 请求成功回调 |

## 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| loading | `boolean` | 是否正在加载 |
| data | `any` | 请求返回的数据 |
| error | `Error` | 错误信息 |
| refresh | `(params?) => Promise<any>` | 手动刷新/重新请求 |
| pagination | `PaginationInfo` | 分页信息（开启 paginated 时） |

### PaginationInfo

| 属性 | 类型 | 说明 |
|------|------|------|
| total | `number` | 总条数 |
| current | `number` | 当前页码 |
| pageSize | `number` | 每页条数 |
| onChange | `(current: number) => void` | 页码变化回调 |
| onPageSizeChange | `(pageSize: number) => void` | 每页条数变化回调 |

## 使用示例

### 自动请求

```tsx
import useRequest from '@/hooks/useRequest';

const fetchUser = async (params) => {
  const res = await fetch(`/api/user?id=${params.id}`);
  return res.json();
};

function MyComponent() {
  const { loading, data, error } = useRequest(fetchUser, {
    defaultParams: { id: 1 }
  });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return <div>{data.name}</div>;
}
```

### 手动请求

```tsx
function MyComponent() {
  const { loading, data, refresh } = useRequest(fetchUser, {
    manual: true
  });

  const handleSearch = (id) => {
    refresh({ id });
  };

  return (
    <div>
      <button onClick={() => handleSearch(1)}>查询用户 1</button>
      <button onClick={() => handleSearch(2)}>查询用户 2</button>
      {loading ? '加载中...' : JSON.stringify(data)}
    </div>
  );
}
```

### 分页模式

```tsx
const fetchList = async (params) => {
  const res = await fetch(`/api/list?page=${params.CurrentPage}&size=${params.PageSize}`);
  return res.json();
};

function ListPage() {
  const { loading, data, pagination } = useRequest(fetchList, {
    paginated: true,
    defaultParams: { CurrentPage: 1, PageSize: 10 }
  });

  return (
    <div>
      {loading ? '加载中...' : (
        <ul>
          {data?.list?.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      )}
      <div>
        共 {pagination?.total} 条
        <button onClick={() => pagination?.onChange(pagination.current - 1)}>上一页</button>
        第 {pagination?.current} 页
        <button onClick={() => pagination?.onChange(pagination.current + 1)}>下一页</button>
      </div>
    </div>
  );
}
```

### 自定义分页格式

```tsx
// 如果后端返回的分页数据结构不同，可以自定义转换器
const { pagination } = useRequest(fetchList, {
  paginated: true,
  paginationFormater: ({ data, updater }) => ({
    total: data.totalCount,
    current: data.pageIndex,
    pageSize: data.pageSize,
    onChange: (page) => updater({ pageIndex: page }),
    onPageSizeChange: (size) => updater({ pageSize: size, pageIndex: 1 }),
  })
});
```

### 轮询

```tsx
// 每 10 秒自动刷新
const { data } = useRequest(fetchStatus, {
  refreshInterval: 10000
});
```

### 依赖变化重新请求

```tsx
function MyComponent({ userId }) {
  const { data } = useRequest(fetchUser, {
    deps: [userId],  // userId 变化时自动重新请求
    defaultParams: { id: userId }
  });

  return <div>{data?.name}</div>;
}
```

### 成功回调

```tsx
const { data } = useRequest(fetchUser, {
  onSuccess: (data) => {
    console.log('请求成功:', data);
    // 可以在这里做一些额外处理，如更新其他状态
  }
});
```