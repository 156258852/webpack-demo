import { PaginationInfo, ServiceReturnPromise, PaginationFormater } from './types';

type PaginationParams = {
  data: any;
  updater: ServiceReturnPromise;
  paginationFormater: PaginationFormater | undefined;
};

/**
 * 获取分页信息
 * @param param
 */
export function getPagination({ data = {}, updater, paginationFormater }: PaginationParams): PaginationInfo {
  if (paginationFormater && typeof paginationFormater === 'function') {
    return paginationFormater({ data, updater });
  }

  return {
    total: data.PageInfo?.TotalCount || data.PageInfo?.Total || data.TotalCount || data.Total || 0,
    current: data.PageInfo?.PageNumber || data.PageInfo?.CurrentPage || data.PageNumber || data.CurrentPage || 0,
    pageSize: data.PageInfo?.PageSize || data.PageSize || 10,
    // PageSize 如果有变化 应该使用变化后的值
    onChange(page: number) {
      updater({ CurrentPage: page, PageSize: this.pageSize });
    },
    onPageSizeChange: (size: number) => {
      updater({ PageSize: size, CurrentPage: 1 });
    },
  };
}
