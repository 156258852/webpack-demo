import { useSyncExternalStore, useCallback, useRef } from 'react';

// ==================== Types ====================

interface StorageConfig<T> {
  /** 默认值（storage 中无数据时使用） */
  defaultValue?: T;
  /** 自定义序列化/反序列化（默认 JSON） */
  serializer?: {
    serialize: (value: T) => string;
    deserialize: (raw: string) => T;
  };
}

type StorageSetValue<T> = T | null | ((prev: T | undefined) => T | null);

// ==================== Helpers ====================

const defaultSerializer = {
  serialize: (value: unknown) => JSON.stringify(value),
  deserialize: (raw: string) => {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  },
};

// ==================== Core Hook ====================

/**
 * 类型安全的 Storage Hook（基于 useSyncExternalStore）
 *
 * - 自动同步：同 tab 内多处使用同一 key，写入后自动同步
 * - 函数式更新：setValue(prev => next)
 * - 自定义序列化
 *
 * @example
 * ```ts
 * const [token, setToken] = useSessionStorage<string>('global__token', {
 *   defaultValue: '',
 * });
 *
 * setToken(prev => (prev ?? '') + '_refreshed');
 * setToken(null); // 删除该 key
 * ```
 */
function useStorage<T>(
  key: string,
  config: StorageConfig<T> = {},
  storage: Storage
) {
  const { defaultValue, serializer = defaultSerializer } = config;

  const serializerRef = useRef(serializer);
  serializerRef.current = serializer;

  const subscribe = useCallback(
    (listener: () => void) => {
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
    []
  );

  const getSnapshot = useCallback((): T | undefined => {
    const raw = storage.getItem(key);
    if (raw === null) return defaultValue;
    return serializerRef.current.deserialize(raw) as T;
  }, [key, storage, defaultValue]);

  const getServerSnapshot = useCallback((): T | undefined => {
    return defaultValue;
  }, [defaultValue]);

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (value: StorageSetValue<T>) => {
      const prev = getSnapshot();
      const next =
        typeof value === 'function'
          ? (value as (prev: T | undefined) => T | null)(prev)
          : value;

      if (next === null || next === undefined) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, serializerRef.current.serialize(next));
      }

      // 触发同 tab 内同步
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: next === null || next === undefined ? null : serializerRef.current.serialize(next),
          storageArea: storage,
        })
      );
    },
    [key, storage, getSnapshot]
  );

  return [store, setValue] as const;
}

// ==================== Public Hooks ====================

/**
 * localStorage hook
 *
 * @example
 * ```ts
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('app__theme', {
 *   defaultValue: 'light',
 * });
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  config: StorageConfig<T> = {}
) {
  return useStorage<T>(key, config, window.localStorage);
}

/**
 * sessionStorage hook（微前端场景建议配合 namespace 使用）
 *
 * @example
 * ```ts
 * const [filter, setFilter] = useSessionStorage<OrderFilter>('order__filter', {
 *   defaultValue: { status: 0, keyword: '' },
 * });
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  config: StorageConfig<T> = {}
) {
  return useStorage<T>(key, config, window.sessionStorage);
}

export type { StorageConfig, StorageSetValue };
export default useStorage;