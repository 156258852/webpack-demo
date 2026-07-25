import { useSyncExternalStore, useCallback } from 'react';
import type { StorageSchema, StorageKey } from './storage-schema';

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

type StorageReturn<T> = readonly [
  T | undefined,
  (value: StorageSetValue<T>) => void,
];

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

function useStorage<T>(
  key: string,
  config: StorageConfig<T> = {},
  storage: Storage
): StorageReturn<T> {
  const { defaultValue, serializer = defaultSerializer } = config;

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
    return serializer.deserialize(raw) as T;
  }, [key, storage, defaultValue, serializer]);

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
        storage.setItem(key, serializer.serialize(next));
      }

      // 触发同 tab 内同步
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: next === null || next === undefined ? null : serializer.serialize(next),
          storageArea: storage,
        })
      );
    },
    [key, storage, getSnapshot, serializer]
  );

  return [store, setValue] as const;
}

// ==================== Public Hooks ====================

/**
 * localStorage hook
 *
 * @example
 * ```ts
 * // Schema key → 类型自动推导
 * const [token, setToken] = useLocalStorage('global__token');
 * // token: string | undefined
 *
 * // 非 Schema key → 手动传泛型
 * const [data, setData] = useLocalStorage<MyType>('some__key', { defaultValue: ... });
 * ```
 */
export function useLocalStorage<K extends StorageKey>(
  key: K,
  config?: StorageConfig<StorageSchema[K]>
): StorageReturn<StorageSchema[K]>;
export function useLocalStorage<T>(
  key: string,
  config?: StorageConfig<T>
): StorageReturn<T>;
export function useLocalStorage(key: string, config = {}) {
  return useStorage(key, config as StorageConfig<unknown>, window.localStorage);
}

/**
 * sessionStorage hook
 *
 * @example
 * ```ts
 * // Schema key → 类型自动推导
 * const [filter, setFilter] = useSessionStorage('order__filter');
 * // filter: { status: number; keyword: string; dateRange: ... } | undefined
 *
 * setFilter(prev => ({ ...prev!, status: 1 }));
 * setFilter(null); // 删除
 * ```
 */
export function useSessionStorage<K extends StorageKey>(
  key: K,
  config?: StorageConfig<StorageSchema[K]>
): StorageReturn<StorageSchema[K]>;
export function useSessionStorage<T>(
  key: string,
  config?: StorageConfig<T>
): StorageReturn<T>;
export function useSessionStorage(key: string, config = {}) {
  return useStorage(key, config as StorageConfig<unknown>, window.sessionStorage);
}

export type { StorageConfig, StorageSetValue, StorageReturn };
export default useStorage;