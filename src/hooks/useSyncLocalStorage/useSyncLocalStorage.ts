import { useSyncExternalStore } from 'react'

function useSyncLocalStorage<T>(key: string, initialValue?: T) {
  const getSnapshot = () => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  }

  const getServerSnapshot = () => initialValue

  const subscribe = (listener: () => void) => {
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  }

  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setState = (value: T | ((prev: T) => T)) => {
    const nextState = typeof value === 'function' ? (value as (prev: T) => T)(store!) : value

    window.localStorage.setItem(key, JSON.stringify(nextState))
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(nextState)
      })
    )
  }

  return [store, setState] as const
}

export default useSyncLocalStorage
