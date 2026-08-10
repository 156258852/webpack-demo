import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

/**
 * 弹窗对外暴露的 ref 类型
 * Result 为本次调用的返回值类型，Params 为 show 的入参类型（无入参时省略）
 */
export interface PromiseModalRef<Result, Params = void> {
  show: (params: Params) => Promise<Result | false>;
}

/**
 * 把「弹窗开关 + Promise 挂起/恢复」这套机制从业务组件里抽出来
 * 业务组件只需消费 visible/params，并在合适的时机调用 submit/cancel
 */
function usePromiseModal<Result, Params = void>(
  ref: React.ForwardedRef<PromiseModalRef<Result, Params>>,
) {
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState<Params>();
  const resolveRef = useRef<((value: Result | false) => void) | undefined>(undefined);

  // 结束本次调用：关闭弹窗 + resolve，并清空 resolve 防止重复触发
  const settle = (value: Result | false) => {
    setVisible(false);
    resolveRef.current?.(value);
    resolveRef.current = undefined;
  };

  useImperativeHandle(ref, () => ({
    show: (nextParams: Params) => {
      setParams(nextParams);
      setVisible(true);
      return new Promise<Result | false>((resolve) => {
        resolveRef.current = resolve;
      });
    },
  }));

  // 兜底：组件卸载时若仍有未结束的调用，按取消处理，避免外部 await 永久挂起
  useEffect(() => () => resolveRef.current?.(false), []);

  return {
    visible,
    params,
    /** 用户确认且校验通过，带结果结束本次调用 */
    submit: settle,
    /** 用户取消，以 false 结束本次调用 */
    cancel: () => settle(false),
  };
}

export default usePromiseModal;
