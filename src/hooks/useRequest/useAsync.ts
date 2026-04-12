import { useCallback, useRef, useState } from 'react';
import { ServiceReturnPromise, PromiseType, ServiceParams, Options } from './types';
import useMountedState from './useMountedState';

type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      data?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      data?: T;
    }
  | {
      loading: false;
      error: Error;
      data?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      data: T;
    };

type StateFromServiceReturningPromise<T extends ServiceReturnPromise> = AsyncState<PromiseType<ReturnType<T>>>;
type AsyncFnReturn<T extends ServiceReturnPromise = ServiceReturnPromise> = [StateFromServiceReturningPromise<T>, T];

function useAsync<T extends ServiceReturnPromise>(
  service: T,
  initialState: StateFromServiceReturningPromise<T>,
  options?: Options,
): AsyncFnReturn<T> {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] = useState(initialState);

  const { deps = [], defaultParams = {}, onSuccess } = options || {};
  const paramRef = useRef<ServiceParams>({});

  const callback = useCallback((p: ServiceParams = {}): ReturnType<T> => {
    const callId = ++lastCallId.current;
    set((prevState) => ({ ...prevState, loading: true }));

    paramRef.current = { ...defaultParams, ...paramRef.current, ...p };

    return service(paramRef.current).then(
      (data) => {
        if (isMounted() && callId === lastCallId.current) {
          set({ data, loading: false });
          if (onSuccess) {
            onSuccess(data);
          }
        }
        return data;
      },
      (error) => {
        if (isMounted() && callId === lastCallId.current) {
          set({ error, loading: false });
        }
        return Promise.reject(error);
      },
    ) as ReturnType<T>;
  }, [deps, onSuccess]);

  return [state, callback as unknown as T];
}

export default useAsync;
