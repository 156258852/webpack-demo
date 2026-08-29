const delay = (time: number): Promise<void> =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });

const data = {
  modules: {} as Record<string, unknown>,

  set<T>(key: string, value: T): void {
    this.modules[key] = value;
  },

  get<T>(key: string): T | undefined {
    return this.modules[key] as T | undefined;
  },

  clear(key: string): void {
    delete this.modules[key];
  }
};

export { delay, data };