import fetcher, { RequestConfig, ResponseData, clearCache as clearFetcherCache } from './fetcher';

// ============== 类型重导出 ==============
export type { RequestConfig, ResponseData } from './fetcher';

// ============== 类型定义 ==============
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor<T = any> = (response: ResponseData<T>) => ResponseData<T> | Promise<ResponseData<T>>;
export type ErrorInterceptor = (error: any) => any | Promise<any>;

export interface RequestInstanceConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;
  cache: boolean;
  cacheTimeout: number;
}

// ============== 请求拦截器管理 ==============
class InterceptorManager<T> {
  private interceptors: T[] = [];

  use(interceptor: T): void {
    this.interceptors.push(interceptor);
  }

  eject(id: number): void {
    if (id >= 0 && id < this.interceptors.length) {
      delete this.interceptors[id];
    }
  }

  forEach(callback: (interceptor: T) => void): void {
    this.interceptors.forEach((interceptor) => {
      if (interceptor) {
        callback(interceptor);
      }
    });
  }
}

// ============== 自定义错误类 ==============
export class RequestError extends Error {
  code: string;
  status?: number;
  url?: string;
  method?: string;

  constructor(code: string, message: string, options?: { status?: number; url?: string; method?: string }) {
    super(message);
    this.name = 'RequestError';
    this.code = code;
    this.status = options?.status;
    this.url = options?.url;
    this.method = options?.method;
  }
}

// ============== 错误分类 ==============
export function classifyError(error: any): string {
  if (error.name === 'TimeoutError') return 'timeout';
  if (error.name === 'HttpError') {
    if (error.status >= 500) return 'server';
    if (error.status >= 400) return 'client';
  }
  if (!error.response) return 'network';
  return 'unknown';
}

// ============== 错误消息映射 ==============
const ERROR_MESSAGES: Record<string, string> = {
  '400': '请求参数错误',
  '401': '未授权，请登录',
  '403': '拒绝访问',
  '404': '请求资源不存在',
  '500': '服务器内部错误',
  '502': '网关错误',
  '503': '服务不可用',
  '504': '网关超时',
  'timeout': '请求超时',
  'network': '网络连接失败',
};

export function getErrorMessage(code: string | number, customMessage?: string): string {
  if (customMessage) return customMessage;
  return ERROR_MESSAGES[String(code)] || '未知错误';
}

// ============== 请求类 ==============
class Request {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;
  private defaultWithCredentials: boolean;
  private defaultCache: boolean;
  private defaultCacheTimeout: number;

  private requestInterceptors: InterceptorManager<RequestInterceptor>;
  private responseInterceptors: InterceptorManager<ResponseInterceptor>;
  private errorInterceptors: InterceptorManager<ErrorInterceptor>;

  constructor(config?: Partial<RequestInstanceConfig>) {
    this.baseURL = config?.baseURL || '';
    this.defaultTimeout = config?.timeout || 15000;
    this.defaultHeaders = config?.headers || {};
    this.defaultWithCredentials = config?.withCredentials ?? true;
    this.defaultCache = config?.cache ?? false;
    this.defaultCacheTimeout = config?.cacheTimeout || 15000;

    this.requestInterceptors = new InterceptorManager<RequestInterceptor>();
    this.responseInterceptors = new InterceptorManager<ResponseInterceptor>();
    this.errorInterceptors = new InterceptorManager<ErrorInterceptor>();
  }

  /**
   * 配置请求实例
   */
  configure(config: Partial<RequestInstanceConfig>): void {
    if (config.baseURL !== undefined) this.baseURL = config.baseURL;
    if (config.timeout !== undefined) this.defaultTimeout = config.timeout;
    if (config.headers !== undefined) this.defaultHeaders = config.headers;
    if (config.withCredentials !== undefined) this.defaultWithCredentials = config.withCredentials;
    if (config.cache !== undefined) this.defaultCache = config.cache;
    if (config.cacheTimeout !== undefined) this.defaultCacheTimeout = config.cacheTimeout;
  }

  /**
   * 添加请求拦截器
   */
  useRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.use(interceptor);
  }

  /**
   * 添加响应拦截器
   */
  useResponseInterceptor<T = any>(interceptor: ResponseInterceptor<T>): void {
    this.responseInterceptors.use(interceptor as ResponseInterceptor);
  }

  /**
   * 添加错误拦截器
   */
  useErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.use(interceptor);
  }

  /**
   * 核心请求方法
   */
  async request<T = any>(config: RequestConfig): Promise<ResponseData<T>> {
    // 合并配置（优先级：请求级 > 全局 > 默认值）
    const finalConfig: RequestConfig = {
      url: this.buildURL(config.url, config.baseURL),
      method: config.method,
      headers: { ...this.defaultHeaders, ...config.headers },
      timeout: config.timeout || this.defaultTimeout,
      withCredentials: config.withCredentials ?? this.defaultWithCredentials,
      // 缓存默认开启，但请求级配置优先
      cache: config.cache !== undefined ? config.cache : this.defaultCache,
      cacheTimeout: config.cacheTimeout || this.defaultCacheTimeout,
      params: config.params,
      data: config.data,
      dataType: config.dataType,
      contentType: config.contentType,
      mode: config.mode,
    };

    // 执行请求拦截器
    let processedConfig = finalConfig;
    for (const interceptor of this.requestInterceptors['interceptors']) {
      if (interceptor) {
        processedConfig = await interceptor(processedConfig);
      }
    }

    try {
      // 执行请求
      const response = await fetcher<T>(processedConfig);

      // 执行响应拦截器
      let processedResponse = response;
      for (const interceptor of this.responseInterceptors['interceptors']) {
        if (interceptor) {
          processedResponse = await interceptor(processedResponse);
        }
      }

      return processedResponse;
    } catch (error) {
      // 执行错误拦截器
      let processedError = error;
      for (const interceptor of this.errorInterceptors['interceptors']) {
        if (interceptor) {
          processedError = await interceptor(processedError);
        }
      }
      throw processedError;
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>): Promise<ResponseData<T>> {
    return this.request<T>({ ...config, method: 'get', url, params });
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ResponseData<T>> {
    return this.request<T>({ ...config, method: 'post', url, data });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ResponseData<T>> {
    return this.request<T>({ ...config, method: 'put', url, data });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>): Promise<ResponseData<T>> {
    return this.request<T>({ ...config, method: 'delete', url, params });
  }

  /**
   * 构建完整 URL
   */
  private buildURL(url: string, customBaseURL?: string): string {
    // 如果请求级别传了 baseURL，优先使用
    const baseURL = customBaseURL || this.baseURL;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (!baseURL) {
      return url;
    }
    return `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  }

  /**
   * 清除缓存
   */
  clearCache(key?: string): void {
    clearFetcherCache(key);
  }
}

// ============== 导出单例 ==============
export const request = new Request();

export default request;
