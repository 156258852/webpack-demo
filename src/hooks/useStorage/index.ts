import useStorage, { useLocalStorage, useSessionStorage } from './useStorage';

export default useStorage;

export { useLocalStorage, useSessionStorage };
export type { StorageConfig, StorageSetValue, StorageReturn } from './useStorage';
export type { StorageSchema, StorageKey } from './storage-schema';