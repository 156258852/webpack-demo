# HTTP 请求封装使用文档

基于原生 fetch 的轻量级 HTTP 客户端，零依赖，支持缓存、拦截器、多 baseURL。

## 快速开始

### 1. 初始化全局配置

```typescript
import http from '@/utils/http';

http.initConfig({
  baseURL: '/api',               // 默认 baseURL
  timeout: 15000,                // 默认超时 15 秒
  cache: true,                   // 默认开启 GET 缓存
  cacheTimeout: 15000,           // 缓存等待超时
  withCredentials: true,         // 携带凭证
  headers: {                     // 公共请求头
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
});
```

### 2. 基本请求

```typescript
// GET 请求
async function getUsers() {
  const response = await http.get('/users', { page: 1, size: 20 });
  console.log(response.data);    // 后端返回的数据
  console.log(response.status);  // 状态码 200
  return response.data;
}

// POST 请求
async function createUser(name: string) {
  const response = await http.post('/users', { name });
  return response.data;
}

// PUT 请求
async function updateUser(id: number, data: any) {
  const response = await http.put(`/users/${id}`, data);
  return response.data;
}

// DELETE 请求
async function deleteUser(id: number) {
  const response = await http.delete(`/users/${id}`);
  return response.data;
}
```

### 3. 错误处理

```typescript
// 方式 1：try/catch
try {
  const response = await http.get('/users');
  console.log(response.data);
} catch (error) {
  console.error('请求失败:', error.message);
  if (error.name === 'TimeoutError') {
    console.error('请求超时');
  } else if (error.name === 'HttpError') {
    console.error(`HTTP 错误：${error.status}`);
  }
}

// 方式 2：Promise.catch
http.get('/users')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

---

## 高级用法

### 多 baseURL 场景

当一个页面需要调用多个不同域的 API 时：

```typescript
// 场景 1：使用全局 baseURL
// 请求 /api/users
const users = await http.get('/users');

// 场景 2：单个请求覆盖 baseURL
// 请求 https://api.example.com/users
const otherUsers = await http.get('/users',
  { page: 1 },
  { baseURL: 'https://api.example.com' }
);

// 场景 3：一个页面调用多个不同域的 API
async function loadData() {
  const [userResp, orderResp] = await Promise.all([
    http.get('/users/1', {}, { baseURL: 'https://api.user.com' }),
    http.get('/orders/1', {}, { baseURL: 'https://api.order.com' }),
  ]);
  return {
    user: userResp.data,
    order: orderResp.data,
  };
}

// 场景 4：完整 URL 优先（忽略 baseURL）
// 直接使用完整 URL，baseURL 不生效
const external = await http.get('https://external.com/data');
```

**优先级规则：**
```
完整 URL (https://...) > 请求级 baseURL > 全局 baseURL
```

### 缓存控制

```typescript
// 禁用缓存（强制重新请求）
async function fetchNoCache() {
  const response = await http.get('/users',
    { page: 1 },
    { cache: false }  // 禁用缓存
  );
  return response;
}

// 清空所有缓存
function clearAllCache() {
  http.clearCache();
}
```

**缓存说明：**
- 仅 GET 请求支持缓存
- 相同 URL + 相同参数 视为同一缓存
- 缓存存在于内存中，页面刷新后清空

### 拦截器

```typescript
// 请求拦截器：添加 token
http.useRequestInterceptor((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// 响应拦截器：统一处理 401
http.useResponseInterceptor((response) => {
  if (response.status === 401) {
    // 跳转登录
    window.location.href = '/login';
  }
  return response;
});

// 错误拦截器：统一错误处理
http.useErrorInterceptor((error) => {
  console.error('[HTTP Error]', {
    url: error.url,
    message: error.message,
    status: error.status,
  });
  // 可以在这里弹出错误提示
  return error;
});
```

### 自定义配置

```typescript
// 自定义超时
async function longRunningRequest() {
  const response = await http.get('/slow-api',
    {},
    { timeout: 60000 }  // 60 秒超时
  );
  return response;
}

// 自定义请求头
async function customHeadersRequest() {
  const response = await http.get('/special-api',
    {},
    {
      headers: {
        'X-Custom-Header': 'value',
        'X-Request-ID': crypto.randomUUID(),
      },
    }
  );
  return response;
}

// 自定义 Content-Type
async function jsonRequest() {
  const response = await http.post('/api',
    { data: {...} },
    {
      contentType: 'application/json;charset=UTF-8',
    }
  );
  return response;
}
```

---

## API 参考

### 请求方法

| 方法 | 签名 | 返回值 |
|------|------|--------|
| `http.get` | `(url, params?, config?)` | `Promise<ResponseData<T>>` |
| `http.post` | `(url, data?, config?)` | `Promise<ResponseData<T>>` |
| `http.put` | `(url, data?, config?)` | `Promise<ResponseData<T>>` |
| `http.delete` | `(url, params?, config?)` | `Promise<ResponseData<T>>` |

### 配置方法

| 方法 | 签名 | 说明 |
|------|------|------|
| `http.initConfig` | `(config) => void` | 初始化全局配置 |
| `http.useRequestInterceptor` | `(fn) => void` | 添加请求拦截器 |
| `http.useResponseInterceptor` | `(fn) => void` | 添加响应拦截器 |
| `http.useErrorInterceptor` | `(fn) => void` | 添加错误拦截器 |
| `http.clearCache` | `() => void` | 清空所有缓存 |

### 类型定义

```typescript
// 请求配置
interface RequestConfig {
  baseURL?: string;                    // 请求级 baseURL，可覆盖全局
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  headers?: Record<string, string>;
  params?: Record<string, any>;        // URL 参数 / GET 参数
  data?: any;                          // 请求体 / POST 数据
  timeout?: number;                    // 超时时间 (默认 15000ms)
  withCredentials?: boolean;           // 携带凭证 (默认 true)
  dataType?: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData';
  contentType?: string;                // Content-Type
  mode?: 'cors' | 'no-cors' | 'same-origin';
  cache?: boolean;                     // 是否缓存 (默认 true for GET)
  cacheTimeout?: number;               // 缓存等待超时 (默认 15000ms)
}

// 响应数据
interface ResponseData<T = any> {
  data: T;              // 后端返回的数据
  status: number;       // HTTP 状态码
  statusText: string;   // 状态文本
  headers: Headers;     // 响应头
}
```

---

## 与 useRequest Hook 集成

```typescript
import { useRequest } from '@/hooks';

// 基本用法
function UserList() {
  const { data, loading, error, refresh } = useRequest(
    () => http.get('/users', { page: 1 }),
    { manual: false }
  );

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误：{error.message}</div>;

  return (
    <ul>
      {data.data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// 分页模式
function PaginatedList() {
  const { data, pagination } = useRequest(
    (params) => http.get('/users', params),
    {
      paginated: true,
      defaultParams: { CurrentPage: 1, PageSize: 10 },
    }
  );

  return (
    <div>
      {/* 渲染列表 */}
      <Pagination
        total={pagination.total}
        current={pagination.current}
        pageSize={pagination.pageSize}
        onChange={pagination.onChange}
      />
    </div>
  );
}

// 手动模式
function ManualFetch() {
  const { data, loading, refresh } = useRequest(
    () => http.get('/users'),
    { manual: true }  // 不自动请求
  );

  return (
    <div>
      <button onClick={() => refresh()}>刷新</button>
      <button onClick={() => refresh({ page: 2 })}>刷新第 2 页</button>
    </div>
  );
}
```

---

## 注意事项

### 1. 返回值结构

```typescript
// ✅ 正确
const response = await http.get('/api');
const data = response.data;      // 后端数据
const status = response.status;  // 状态码

// ❌ 错误（直接访问 http.get 返回的是 Promise）
const data = await http.get('/api');  // 这是 response，不是 data
```

### 2. 缓存机制

- 仅 GET 请求支持缓存
- 缓存 key = hash(URL + params)
- 相同 URL + 相同参数 = 命中缓存
- 缓存存在于内存，页面刷新后清空

### 3. 参数序列化

```typescript
// GET 请求参数自动序列化为 URL encode
// /api/users?page=1&size=20
http.get('/users', { page: 1, size: 20 });

// POST 请求数据默认序列化为 form-urlencoded
// Content-Type: application/x-www-form-urlencoded
// body: page=1&size=20
http.post('/users', { page: 1, size: 20 });

// 如需 JSON 格式，指定 contentType
http.post('/users',
  { page: 1, size: 20 },
  { contentType: 'application/json;charset=UTF-8' }
);
```

### 4. 错误类型

| 错误类型 | 说明 |
|---------|------|
| `TimeoutError` | 请求超时 |
| `HttpError` | HTTP 错误（4xx/5xx） |
| `Error` | 网络错误或其他错误 |

---

## 迁移指南

### 从 axios 迁移

```typescript
// axios
import axios from 'axios';
const response = await axios.get('/api');
const data = response.data;

// http
import http from '@/utils/http';
const response = await http.get('/api');
const data = response.data;
```

### 从原来 https/index.js 迁移

```javascript
// 原来的实现
import https from '@/https';
const result = await https.get('/api');
if (result.status === 'ok') {
  console.log(result.data);
}

// 新的实现
import http from '@/utils/http';
try {
  const response = await http.get('/api');
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

---

## 示例代码

完整示例请参考：`src/utils/http.example.ts`
