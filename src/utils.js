const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const data = {
  modules: {},

  set(key, value) {
    this.modules[key] = value;
  },

  get(key) {
    return this.modules[key];
  },

  clear(key) {
    delete this.modules[key];
  }
};
export {
  delay,
  data
};