import React from 'react';

interface StorageConfig {
  /** 默认值 */
  defaultValue?: any;
}

const isInvalid = (o: any): boolean => o === undefined || o === null;

/**
 * @param key ID
 */
function useStorage<T = any>(
  key: string,
  config: StorageConfig = {},
  storage: Storage
): [T, (value: T | null) => void] {
  const { defaultValue } = config;

  function getStoredValue(): T {
    let value: any;
    const raw = storage.getItem(key);
    try {
      if (raw) {
        value = JSON.parse(raw);
      }
    } catch (e) {
      if (raw) {
        value = raw;
      }
    }

    return !isInvalid(value) ? value : defaultValue;
  }

  const [data, setData] = React.useState<T>(() => getStoredValue());

  const setValue = (value: T | null) => {
    setData(value as T);
    if (isInvalid(value)) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, JSON.stringify(value));
    }
  };

  return [data, setValue];
}

/**
 * localStorage hook
 */
export function useLocalStorage<T = any>(
  key: string,
  config: StorageConfig = {}
): [T, (value: T | null) => void] {
  return useStorage<T>(key, config, window.localStorage);
}

/**
 * sessionStorage hook
 */
export function useSessionStorage<T = any>(
  key: string,
  config: StorageConfig = {}
): [T, (value: T | null) => void] {
  return useStorage<T>(key, config, window.sessionStorage);
}

export default useStorage;