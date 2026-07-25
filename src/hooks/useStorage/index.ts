import useStorage, { useLocalStorage, useSessionStorage } from './useStorage';

export default useStorage;

export { useLocalStorage, useSessionStorage };
export type { StorageConfig, StorageSetValue } from './useStorage';