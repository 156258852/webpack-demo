# useWorker Hook 使用文档

在 React 中使用 Web Worker 执行复杂计算，避免阻塞主线程。

## 安装

```tsx
import useWorker from './hooks/useWorker';
```

## 基本用法

### 1. 字符串形式（推荐）

```tsx
const MyComponent = () => {
  const { data } = useWorker(
    `export default async (params) => {
      // 复杂计算逻辑
      let sum = 0;
      for (let i = 0; i < params.count; i++) {
        sum += i;
      }
      return sum;
    }`,
    { params: { count: 10000000 } }
  );

  return <div>计算结果: {data}</div>;
};
```

### 2. 外部定义 Worker 逻辑

将 worker 逻辑抽离到独立文件中：

**workerUtils.js**
```js
// 定义可复用的 worker 逻辑
export const heavyCalculation = `export default async (params) => {
  const { arr } = params;
  return arr.reduce((sum, item) => sum + item.value, 0);
}`;

export const sortData = `export default async (params) => {
  const { data, key } = params;
  return data.sort((a, b) => a[key] - b[key]);
}`;

export const filterData = `export default async (params) => {
  const { data, condition } = params;
  return data.filter(item => eval(condition));
}`;
```

**组件中使用**
```tsx
import { heavyCalculation, sortData } from './workerUtils';

const MyComponent = () => {
  const { data: sum } = useWorker(heavyCalculation, {
    params: { arr: [{ value: 1 }, { value: 2 }] }
  });

  const { data: sorted } = useWorker(sortData, {
    params: { data: [3, 1, 2], key: 'id' }
  });

  return <div>{sum}</div>;
};
```

### 3. 动态控制逻辑

使用字符串模板动态生成 worker 逻辑：

```tsx
const MyComponent = () => {
  const [operation, setOperation] = useState('add');

  // 动态生成 worker 代码
  const workerCode = `export default async (params) => {
    const { a, b } = params;
    ${operation === 'add' ? 'return a + b;' : 'return a - b;'}
  }`;

  const { data, runWorker } = useWorker(workerCode, { manual: true });

  return (
    <div>
      <select onChange={(e) => setOperation(e.target.value)}>
        <option value="add">加法</option>
        <option value="subtract">减法</option>
      </select>
      <button onClick={() => runWorker({ a: 10, b: 5 })}>计算</button>
      <div>结果: {data}</div>
    </div>
  );
};
```

### 4. 函数转字符串

将普通函数转为字符串传入：

```tsx
const MyComponent = () => {
  // 定义计算函数
  const calculateSum = async (params) => {
    const { numbers } = params;
    return numbers.reduce((sum, n) => sum + n, 0);
  };

  // 转换为 worker 代码字符串
  const workerCode = `export default ${calculateSum.toString()}`;

  const { data } = useWorker(workerCode, {
    params: { numbers: [1, 2, 3, 4, 5] }
  });

  return <div>总和: {data}</div>;
};
```

### 5. 手动执行模式

```tsx
const MyComponent = () => {
  const { data, runWorker } = useWorker(
    `export default async (params) => {
      return params.a * params.b;
    }`,
    { manual: true }  // 手动模式
  );

  const handleClick = () => {
    runWorker({ a: 10, b: 20 });
  };

  return (
    <div>
      <button onClick={handleClick}>开始计算</button>
      <div>结果: {data}</div>
    </div>
  );
};
```

## API

### 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `code` | `string` | ✅ | - | Worker 代码字符串，需包含 `export default` 导出的异步函数 |
| `config.params` | `object` | ❌ | - | 传递给 Worker 的参数 |
| `config.closeWorkerOnUnmount` | `boolean` | ❌ | `true` | 组件卸载时是否终止 Worker |
| `config.manual` | `boolean` | ❌ | `false` | 是否手动执行，为 `true` 时需调用 `runWorker` |

### 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | `any` | Worker 返回的结果 |
| `runWorker` | `(params: any) => void` | 手动执行 Worker 的函数 |
| `worker` | `Worker` | 原始 Worker 实例，可用于高级操作 |

## 注意事项

### 1. Worker 中无法访问主线程变量

```tsx
// ❌ 错误：无法访问外部变量
const externalValue = 100;
const { data } = useWorker(
  `export default async (params) => {
    return externalValue; // ReferenceError!
  }`
);

// ✅ 正确：通过 params 传入
const { data } = useWorker(
  `export default async (params) => {
    return params.value;
  }`,
  { params: { value: externalValue } }
);
```

### 2. Worker 中无法使用 DOM API

```tsx
// ❌ 错误：Worker 中没有 document
const { data } = useWorker(
  `export default async (params) => {
    return document.title; // ReferenceError!
  }`
);
```

### 3. 函数转字符串的限制

```tsx
// ❌ 闭包变量无法传递
const factor = 10;
const calculate = async (params) => {
  return params.value * factor; // factor 在 Worker 中不存在
};
const workerCode = `export default ${calculate.toString()}`;

// ✅ 通过 params 传递所有依赖
const calculate = async (params) => {
  return params.value * params.factor;
};
const workerCode = `export default ${calculate.toString()}`;
```

## 适用场景

| 场景 | 示例 |
|------|------|
| 大数据计算 | 数组排序、过滤、聚合 |
| 复杂数学运算 | 矩阵运算、统计分析 |
| 数据处理 | CSV/JSON 解析、格式转换 |
| 加密解密 | 哈希计算、编解码 |
| 图像处理 | 像素操作、滤镜效果 |

## 完整示例

```tsx
import React, { useState } from 'react';
import useWorker from './hooks/useWorker';

const DataProcessor = () => {
  const [dataSize, setDataSize] = useState(1000000);

  // Worker 逻辑：生成并排序大数据
  const workerCode = `export default async (params) => {
    const { size } = params;
    
    // 生成随机数据
    const data = Array.from({ length: size }, () => Math.random());
    
    // 排序
    const sorted = data.sort((a, b) => a - b);
    
    // 统计
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sorted.reduce((s, n) => s + n, 0) / size,
      count: size
    };
  }`;

  const { data, runWorker, worker } = useWorker(workerCode, { manual: true });
  const [loading, setLoading] = useState(false);

  const handleProcess = () => {
    setLoading(true);
    runWorker({ size: dataSize });
  };

  React.useEffect(() => {
    if (data) setLoading(false);
  }, [data]);

  return (
    <div>
      <h2>大数据处理</h2>
      <input
        type="number"
        value={dataSize}
        onChange={(e) => setDataSize(Number(e.target.value))}
      />
      <button onClick={handleProcess} disabled={loading}>
        {loading ? '处理中...' : '开始处理'}
      </button>
      
      {data && (
        <div>
          <p>最小值: {data.min.toFixed(4)}</p>
          <p>最大值: {data.max.toFixed(4)}</p>
          <p>平均值: {data.avg.toFixed(4)}</p>
          <p>数据量: {data.count}</p>
        </div>
      )}
    </div>
  );
};

export default DataProcessor;
```