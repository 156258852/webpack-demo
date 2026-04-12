import { useReducer } from 'react';

/**
 * 基于 reducer 的实现，类似于 class component 的 setState
 * 适用于复杂对象模式
 */
function useSet<T extends object>(initState: T): [T, (action: T | ((prev: T) => T)) => void] {
  return useReducer((state: T, action: T | ((prev: T) => T)) => {
    if (typeof action === 'function') {
      return (action as (prev: T) => T)(state);
    }
    return { ...state, ...action };
  }, initState);
}

export default useSet;