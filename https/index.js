import axios from 'axios';
import { cloneDeep } from 'lodash-es';
// ==================== 工具函数 ====================
const utils = {

  deepClone: obj => cloneDeep(obj),
  isUndefined: (v)=> typeof v === 'undefined',

  _cacheResponseData: {},
  _cacheRequestLoaded: {},

  generateCacheKey(url, params) {
    const raw = url + JSON.stringify(params || {});
    let h = 0;
    for (let i = 0; i < raw.length; i++) {
      const c = raw.charCodeAt(i);
      h = ((h << 5) - h + c) & h; // 32bit 哈希
    }
    return h.toString();
  },

  getCacheDataByKey: (key, timeout, url) => new Promise((resolve) => {
    const startTime = Date.now();
      
    // 定义检查缓存的函数
    const checkCache = (timer) => {
      // 检查缓存是否已准备好
      if (!utils.isUndefined(utils._cacheResponseData[key])) {
        timer && clearInterval(timer);
        resolve({ 
          data: utils.deepClone(utils._cacheResponseData[key]), 
          status: 'ok' 
        });
        return true;
      }
        
      // 检查是否超时
      if (Date.now() - startTime > timeout) {
        timer && clearInterval(timer);
        resolve({ 
          status: 'error', 
          err: new Error(`${url}: getCacheData-timeout`) 
        });
        return true;
      }
        
      return false; // 未完成，需要继续检查
    };
      
    // 立即检查一次缓存
    if (checkCache()) return;
      
    // 设置轮询检查
    const timer = setInterval(() => {
      checkCache(timer);
    }, 20);
  }),
  clearCache() {
    utils._cacheResponseData = {};
    utils._cacheRequestLoaded = {};
  }
};

// ==================== Axios 实例 ====================
const https = axios.create({ timeout: 1000 });

https.interceptors.response.use(
  res => res,
  err => {
    if (err.code === 'ECONNABORTED') {
      return Promise.reject({
        url: err.config?.url,
        method: err.config?.method,
        timeout: err.config?.timeout,
        message: 'request timeout'
      });
    }
    return Promise.reject(err);
  }
);

// ==================== 安全方法白名单 ====================
const SAFE_METHODS = ['get'];

// ==================== 核心封装 ====================
const httpsProxy = new Proxy(https, {
  get(target, prop) {
    const key = String(prop);
    if (!SAFE_METHODS.includes(key)) return target[key];

    return (...args) => 
      // 包装一层 Promise，主要使用 resolve
      new Promise((resolve) => {
        const [url, config = {}] = args;
        const { timeout = 1000, cache, params } = config;

        if (!cache) { // 无缓存分支，直接请求
          target[key](...args)
            .then(response => resolve({ data: response.data, status: 'ok' }))
            .catch(err => {
              console.error(err);
              resolve({ status: 'error', err });
            });
          return;
        }

        // --- 有缓存分支 ---
        const cacheKey = utils.generateCacheKey(url, params);

        // 命中缓存
        if (!utils.isUndefined(utils._cacheResponseData[cacheKey])) {
          resolve({ data: utils.deepClone(utils._cacheResponseData[cacheKey]), status: 'ok' });
          return;
        }

        // 复用正在飞的请求
        if (utils._cacheRequestLoaded[cacheKey]) {
          utils.getCacheDataByKey(cacheKey, timeout, url)
            .then(result => resolve(result))
            .catch(err => resolve({ status: 'error', err }));
          return;
        }

        // 首次请求
        utils._cacheRequestLoaded[cacheKey] = true;
        target[key](...args)
          .then(response => {
            utils._cacheResponseData[cacheKey] = response.data;
            resolve({ data: response.data, status: 'ok' });
          })
          .catch(err => {
            console.error(err);
            resolve({ status: 'error', err });
          })
          .finally(() => {
            utils._cacheRequestLoaded[cacheKey] = false; // 无论成功失败都复位
          });
      })
    ;
  }
});

export default httpsProxy;