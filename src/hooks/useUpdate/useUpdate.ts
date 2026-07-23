import { useCallback, useState } from 'react';

/**
 * 强制组件重新渲染
 * @returns update 函数，调用后触发重渲染
 */
const useUpdate = () => {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};

export default useUpdate;
