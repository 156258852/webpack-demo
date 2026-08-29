/**
 * 定义ResChain类，用于按顺序执行一系列回调函数。
 */
export class ResChain<T> {
  /**
   * 按顺序存放链的key
   */
  keyOrder: string[] = []

  /**
   * key对应的函数
   */
  key2FnMap: Map<string, (ctx: T, next: () => Promise<void>) => Promise<void>> =
    new Map()

  /**
   * 每个节点都可以拿到的对象
   */
  ctx: T

  constructor(ctx: T) {
    this.ctx = ctx
  }

  // 使用key来标识当前callback的唯一性，后面重复添加可以区分。
  add(
    key: string,
    callback: (ctx: T, next: () => Promise<void>) => Promise<void>,
  ): this {
    if (this.key2FnMap.has(key)) {
      throw new Error(`Chain ${key} already exists`)
    }

    this.keyOrder.push(key)
    this.key2FnMap.set(key, callback)
    return this
  }

  async run(): Promise<void> {
    let index = -1
    const dispatch = (i: number): Promise<void> => {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'))
      }

      index = i
      const fn = this.key2FnMap.get(this.keyOrder[i])
      if (!fn) {
        return Promise.resolve()
      }

      return fn(this.ctx, dispatch.bind(null, i + 1))
    }

    return dispatch(0)
  }
}
