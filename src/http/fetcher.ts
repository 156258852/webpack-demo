/* eslint-disable no-undef */

import { cloneDeep } from 'lodash-es';

// ============== 类型定义 ==============
export interface RequestConfig {
  url: string;
  baseURL?: string;  // 请求级别的 baseURL，可覆盖全局配置
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any; // POST/PUT/PATCH 请求体数据
  timeout?: number;
  withCredentials?: boolean; // 是否携带凭证（cookies）
  dataType?: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData';
  contentType?: string; // 请求体 Content-Type，优先级高于 headers 中的设置
  mode?: 'cors' | 'no-cors' | 'same-origin';
  cache?: boolean;
  cacheTimeout?: number;
}

export interface ResponseData<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface CacheStore {
  responseData: Record<string, any>;
  pendingRequests: Record<string, boolean>;
  requestTimestamp: Record<string, number>;
}

// ============== 自定义错误类 ==============
export class HttpError extends Error {
  status: number;
  statusText: string;
  response: Response;

  constructor(status: number, statusText: string, response: Response) {
    super(statusText);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

export class TimeoutError extends Error {
  timeout: number;

  constructor(timeout: number) {
    super(`Request timeout after ${timeout}ms`);
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }
}

// ============== 常量 ==============
const CONTENT_TYPE_JSON = 'application/json;charset=UTF-8';
const CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded;charset=UTF-8';

// ============== 缓存管理 ==============
export const cacheStore: CacheStore = {
  responseData: {},
  pendingRequests: {},
  requestTimestamp: {},
};

/**
 * 生成缓存 key
 */
export function generateCacheKey(url: string, params?: Record<string, any>): string {
  const raw = url + JSON.stringify(params || {});
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    const c = raw.charCodeAt(i);
    h = ((h << 5) - h + c) & h; // 32bit hash
  }
  return h.toString();
}

/**
 * 等待缓存数据（轮询机制）
 */
export function waitForCacheData(key: string, timeout: number, url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      if (cacheStore.responseData[key] !== undefined) {
        resolve(cacheStore.responseData[key]);
        return;
      }
      if (Date.now() - startTime > timeout) {
        reject(new Error(`${url}: cache wait timeout`));
        return;
      }
      setTimeout(check, 20);
    };
    check();
  });
}

/**
 * 清除缓存
 */
export function clearCache(key?: string) {
  if (key) {
    delete cacheStore.responseData[key];
    delete cacheStore.pendingRequests[key];
    delete cacheStore.requestTimestamp[key];
  } else {
    cacheStore.responseData = {};
    cacheStore.pendingRequests = {};
    cacheStore.requestTimestamp = {};
  }
}

// ============== 工具函数 ==============
/**
 * 参数序列化（URL encode）
 */
export function paramsSerializer(params: Record<string, any>): string {
  return Object.keys(params)
    .map((key) => {
      const value = params[key];
      const encoded = typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : String(value);
      return `${encodeURIComponent(key)}=${encodeURIComponent(encoded)}`;
    })
    .join('&');
}

/**
 * 构建带参数的 URL
 */
export function buildURL(url: string, params?: Record<string, any>): string {
  if (!params) return url;
  const serializedParams = paramsSerializer(params);
  if (!serializedParams) return url;
  return url + (url.includes('?') ? '&' : '?') + serializedParams;
}

/**
 * 判断 URL 是否绝对
 */
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

/**
 * 组合 baseURL 和相对 URL
 */
export function combineURLs(baseURL: string, relativeURL: string): string {
  return relativeURL
    ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
    : baseURL;
}

/**
 * 获取原生 fetch（防止被篡改）
 */
function getNativeFetch(): typeof window.fetch {
  return (window as any).__ydNativeFetch || window.fetch;
}

/**
 * 超时处理器
 */
async function timeoutHandle(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new TimeoutError(timeout)), timeout);
  });
}

// ============== 核心 fetch 封装 ==============
async function fetcher<T = any>(config: RequestConfig): Promise<ResponseData<T>> {
  const {
    url,
    params,
    withCredentials = true,
    data,
    timeout = 15000,
    method = 'get',
    dataType = 'json',
    headers = {},
    contentType,
    cache = false,
    cacheTimeout = 15000,
  } = config;

  let { mode } = config;

  // 构建请求 URL（GET 请求参数放在 URL 中）
  const requestURL = method === 'get' && params
    ? buildURL(url, params)
    : url;

  // 生成缓存 key
  const cacheKey = cache ? generateCacheKey(requestURL, params) : null;

  // 检查缓存
  if (cacheKey) {
    // 命中缓存
    if (cacheStore.responseData[cacheKey] !== undefined) {
      return {
        data: cloneDeep(cacheStore.responseData[cacheKey]) as T,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
      };
    }

    // 复用正在进行的请求
    if (cacheStore.pendingRequests[cacheKey]) {
      const cachedData = await waitForCacheData(cacheKey, cacheTimeout, requestURL);
      return {
        data: cloneDeep(cachedData) as T,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
      };
    }

    // 标记请求中
    cacheStore.pendingRequests[cacheKey] = true;
    cacheStore.requestTimestamp[cacheKey] = Date.now();
  }

  // 自动判断同域/跨域模式
  if (!mode) {
    mode = isAbsoluteURL(requestURL) && !requestURL.includes(location.origin)
      ? 'cors'
      : 'no-cors';
  }

  // 构建请求选项
  const options: RequestInit = {
    method,
    headers: { ...headers },
    mode,
  };

  // 凭证设置
  if (withCredentials) {
    options.credentials = 'include';
  }

  // POST/PUT/PATCH 数据处理
  if (['post', 'put', 'patch'].includes(method) && data) {
    options.headers = { ...headers };
    const finalContentType = contentType ||
      options.headers['Content-Type'] ||
      CONTENT_TYPE_FORM;

    options.headers['Content-Type'] = finalContentType;

    if (finalContentType === CONTENT_TYPE_FORM) {
      options.body = paramsSerializer(data);
    } else if (finalContentType === CONTENT_TYPE_JSON) {
      options.body = JSON.stringify(data);
    } else {
      options.body = data;
    }
  }

  const nativeFetch = getNativeFetch();

  try {
    const response = await Promise.race([
      timeoutHandle(timeout),
      nativeFetch(requestURL, options),
    ]);

    // 检查响应状态
    if (!response.ok) {
      throw new HttpError(response.status, response.statusText, response);
    }

    // 根据 dataType 解析响应
    const responseData = await response[dataType]();

    // 缓存响应数据
    if (cacheKey) {
      cacheStore.responseData[cacheKey] = responseData;
      cacheStore.pendingRequests[cacheKey] = false;
    }

    return {
      data: responseData as T,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error) {
    // 请求失败，清除缓存标记
    if (cacheKey) {
      cacheStore.pendingRequests[cacheKey] = false;
    }
    throw error;
  }
}

export default fetcher;
