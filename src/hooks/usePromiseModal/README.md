# usePromiseModal

把弹窗的「开关状态 + Promise 挂起/恢复」机制从业务组件中抽离，让弹窗对外暴露一个可 `await` 的 `show` 方法。

调用方能像调接口一样使用弹窗，整个业务流程写在同一个函数里，不再被 `onOk` / `onCancel` 回调切断。

## 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ref | `React.ForwardedRef<PromiseModalRef<Result, Params>>` | 是 | `forwardRef` 传入的 ref，hook 内部会把 `show` 挂载上去 |

泛型：

| 泛型 | 默认值 | 说明 |
|------|--------|------|
| Result | - | 弹窗确认时返回给调用方的数据类型 |
| Params | `void` | 每次调用 `show` 时传入的参数类型，不需要时省略 |

## 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| visible | `boolean` | 弹窗是否显示，直接交给弹窗组件的 `open` / `visible` |
| params | `Params \| undefined` | 本次 `show` 传入的参数 |
| submit | `(result: Result) => void` | 用户确认且校验通过时调用，关闭弹窗并把结果交给调用方 |
| cancel | `() => void` | 用户取消时调用，关闭弹窗并以 `false` 结束本次调用 |

## 约定

- 返回值统一为 `Result | false`，`false` 表示调用方应中断后续流程
- 只使用 `resolve`，不使用 `reject`：可预见的失败属于正常业务分支，调用方无需写 `try/catch`
- 校验放在 `submit` 之前。校验失败时不要调用 `submit`，弹窗保持开启让用户继续修改
- 组件卸载时 hook 会自动以 `false` 结束未完成的调用，外部 `await` 不会永久挂起

## 使用示例

### 弹窗组件

```tsx
import React from 'react';
import usePromiseModal, { PromiseModalRef } from 'src/hooks/usePromiseModal';

export interface NameForm {
  name: string;
}

export type NameModalRef = PromiseModalRef<NameForm, { initName?: string }>;

const NameModal = React.forwardRef<NameModalRef>((_props, ref) => {
  const { visible, params, submit, cancel } = usePromiseModal<NameForm, { initName?: string }>(ref);
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    if (visible) setName(params?.initName ?? '');
  }, [visible, params]);

  if (!visible) return null;

  return (
    <div className="modal-mask" onClick={cancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={cancel}>取消</button>
        <button
          onClick={() => {
            // 校验不通过时不要 submit，弹窗保持开启
            if (!name.trim()) return;
            submit({ name });
          }}
        >
          确定
        </button>
      </div>
    </div>
  );
});
```

### 调用方

```tsx
const Page = () => {
  const nameModalRef = React.useRef<NameModalRef>(null);

  const handleEdit = async (row: Row) => {
    const result = await nameModalRef.current!.show({ initName: row.name });
    if (!result) return;
    await api.save({ id: row.id, ...result });
    refresh();
  };

  return (
    <div>
      <button onClick={() => handleEdit(row)}>编辑</button>
      <NameModal ref={nameModalRef} />
    </div>
  );
};
```

### 多个弹窗串联

因为每个弹窗都是 `() => Promise<Result | false>`，可以在一个函数里顺序编排，也能按条件跳过某一步：

```tsx
const exportData = async () => {
  const format = await formatModalRef.current!.show();
  if (!format) return;

  if (count > 10000) {
    const confirmed = await confirmModalRef.current!.show({ count });
    if (!confirmed) return;
  }

  await api.export(format);
};
```

## 与 useModal 的区别

| | usePromiseModal | useModal |
|---|---|---|
| 通信方式 | ref + Promise | 事件总线（基于 useEvent） |
| 能否拿到用户操作结果 | 能，`await` 返回 `Result \| false` | 不能，只负责开关 |
| 触发位置 | 需持有弹窗 ref | 任意位置，`useModal.show(key)` |
| 适用场景 | 表单填写、二次确认，结果决定后续流程 | 全局提示、纯展示型弹窗 |
