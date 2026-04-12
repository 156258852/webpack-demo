import { useCallback, useRef, useState } from 'react'

interface UseDynamicListReturn<T> {
  list: T[]
  insert: (index: number, item: T) => void
  merge: (index: number, items: T[]) => void
  replace: (index: number, item: T) => void
  remove: (index: number) => void
  getKey: (index: number) => number
  getIndex: (key: number) => number
  move: (oldIndex: number, newIndex: number) => void
  push: (item: T) => void
  pop: () => void
  unshift: (item: T) => void
  shift: () => void
  resetList: (newList: T[]) => void
}

function useDynamicList<T>(initialList: T[] = []): UseDynamicListReturn<T> {
  const counterRef = useRef(-1)
  const keyList = useRef<number[]>([])

  const setKey = useCallback((index: number) => {
    counterRef.current += 1
    keyList.current.splice(index, 0, counterRef.current)
  }, [])

  const [list, setList] = useState<T[]>(() => {
    initialList.forEach((_, index) => {
      setKey(index)
    })
    return initialList
  })

  const resetList = useCallback((newList: T[]) => {
    keyList.current = []
    setList(() => {
      newList.forEach((_, index) => {
        setKey(index)
      })
      return newList
    })
  }, [])

  const insert = useCallback((index: number, item: T) => {
    setList((l) => {
      const temp = [...l]
      temp.splice(index, 0, item)
      setKey(index)
      return temp
    })
  }, [])

  const getKey = useCallback((index: number) => keyList.current[index], [])

  const getIndex = useCallback(
    (key: number) => keyList.current.findIndex((ele) => ele === key),
    [],
  )

  const merge = useCallback((index: number, items: T[]) => {
    setList((l) => {
      const temp = [...l]
      items.forEach((_, i) => {
        setKey(index + i)
      })
      temp.splice(index, 0, ...items)
      return temp
    })
  }, [])

  const replace = useCallback((index: number, item: T) => {
    setList((l) => {
      const temp = [...l]
      temp[index] = item
      return temp
    })
  }, [])

  const remove = useCallback((index: number) => {
    setList((l) => {
      const temp = [...l]
      temp.splice(index, 1)

      try {
        keyList.current.splice(index, 1)
      } catch (e) {
        console.error(e)
      }
      return temp
    })
  }, [])

  const move = useCallback((oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) {
      return
    }
    setList((l) => {
      const newList = [...l]
      const temp = newList.filter((_, index) => index !== oldIndex)
      temp.splice(newIndex, 0, newList[oldIndex])

      try {
        const keyTemp = keyList.current.filter((_, index) => index !== oldIndex)
        keyTemp.splice(newIndex, 0, keyList.current[oldIndex])
        keyList.current = keyTemp
      } catch (e) {
        console.error(e)
      }

      return temp
    })
  }, [])

  const push = useCallback((item: T) => {
    setList((l) => {
      setKey(l.length)
      return l.concat([item])
    })
  }, [])

  const pop = useCallback(() => {
    try {
      keyList.current = keyList.current.slice(0, keyList.current.length - 1)
    } catch (e) {
      console.error(e)
    }

    setList((l) => l.slice(0, l.length - 1))
  }, [])

  const unshift = useCallback((item: T) => {
    setList((l) => {
      setKey(0)
      return [item].concat(l)
    })
  }, [])

  const shift = useCallback(() => {
    try {
      keyList.current = keyList.current.slice(1, keyList.current.length)
    } catch (e) {
      console.error(e)
    }
    setList((l) => l.slice(1, l.length))
  }, [])

  return {
    list,
    insert,
    merge,
    replace,
    remove,
    getKey,
    getIndex,
    move,
    push,
    pop,
    unshift,
    shift,
    resetList,
  }
}

export default useDynamicList
