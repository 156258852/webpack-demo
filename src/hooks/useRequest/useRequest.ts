import { useEffect } from 'react';
import usePoll from '../usePoll';
import { ServiceReturnPromise, Options, PaginationInfo } from './types';
import useAsync from './useAsync';
import { getPagination } from './utils';

export interface UseRequestReturn<T extends ServiceReturnPromise> {
  loading: boolean;
  data?: any;
  error?: Error;
  refresh: T;
  pagination?: PaginationInfo;
}

function useRequest<T extends ServiceReturnPromise>(
  service: T,
  options?: Options,
): UseRequestReturn<T> {
  const { paginated, manual, paginationFormater, refreshInterval, refreshTimeout } = options || {};
  const [state, callback] = useAsync(service, { loading: !manual }, options);

  let pagination: PaginationInfo | undefined;
  // 开启分页模式，获取分页信息
  if (paginated) {
    pagination = getPagination({ data: state.data, updater: callback, paginationFormater });
  }

  // 开启轮训
  usePoll(callback, { refreshInterval, refreshTimeout });

  useEffect(() => {
    // 开启了手动模式，不执行
    if (manual) return;
    callback();
  }, [callback]);

  return {
    ...state,
    refresh: callback,
    pagination,
  };
}

export default useRequest;
