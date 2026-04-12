import request from './request';
import type { RequestConfig, ResponseData, RequestInstanceConfig, RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './request';
import { clearCache as internalClearCache } from './fetcher';

// ============== 安全方法（支持缓存） ==============
const SAFE_METHODS = ['get', 'query', 'list', 'describe', 'search', 'count', 'lookup'];

/**
 * 请求代理对象
 * 用法：
 *   http.get('/api/users', { page: 1 })  -> 返回完整响应 ResponseData
 *   http.post('/api/users', { name: 'test' })
 */
const httpProxy = new Proxy(request, {
  get(target, prop) {
    const methodName = String(prop);

    // GET 方法（返回完整响应 ResponseData）
    if (methodName === 'get') {
      return async <T = any>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>) => {
        const response = await target.get<T>(url, params, config);
        return response;
      };
    }

    // POST 方法（返回完整响应）
    if (methodName === 'post') {
      return async <T = any>(url: string, data?: any, config?: Partial<RequestConfig>) => {
        const response = await target.post<T>(url, data, config);
        return response;
      };
    }

    // PUT 方法
    if (methodName === 'put') {
      return async <T = any>(url: string, data?: any, config?: Partial<RequestConfig>) => {
        const response = await target.put<T>(url, data, config);
        return response;
      };
    }

    // DELETE 方法
    if (methodName === 'delete') {
      return async <T = any>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>) => {
        const response = await target.delete<T>(url, params, config);
        return response;
      };
    }

    // 透传其他方法
    return (target as any)[methodName];
  },
});

/**
 * 初始化全局配置
 */
httpProxy.initConfig = (config: Partial<RequestInstanceConfig>) => {
  request.configure(config);
};

/**
 * 添加请求拦截器
 */
httpProxy.useRequestInterceptor = (interceptor: RequestInterceptor) => {
  request.useRequestInterceptor(interceptor);
};

/**
 * 添加响应拦截器
 */
httpProxy.useResponseInterceptor = (interceptor: ResponseInterceptor) => {
  request.useResponseInterceptor(interceptor);
};

/**
 * 添加错误拦截器
 */
httpProxy.useErrorInterceptor = (errorInterceptor: ErrorInterceptor) => {
  request.useErrorInterceptor(errorInterceptor);
};

/**
 * 清除缓存
 */
httpProxy.clearCache = () => {
  internalClearCache();
};

// ============== 类型导出 ==============
export type { RequestConfig, ResponseData } from './request';

export default httpProxy;
