/**
 * Storage Key 类型表（相当于 sessionStorage/localStorage 的 "数据库 Schema"）
 *
 * 微前端场景：此文件通常放在共享包（@shared/storage-schema）中，
 * 由主应用维护，子应用 import 使用。
 *
 * 新增 key 必须在此注册，否则 hook 无法推导类型。
 */
export interface StorageSchema {
  // ===== 全局（主应用） =====
  'global__token': string;
  'global__user_info': { name: string; role: string; avatar: string };
  'global__locale': 'zh' | 'en';

  // ===== 订单子应用 =====
  'order__filter': { status: number; keyword: string; dateRange: [string, string] | null };
  'order__page_size': number;

  // ===== 用户子应用 =====
  'user__preferences': { theme: 'light' | 'dark'; compact: boolean };
  'user__last_tab': string;
}

/** 所有已注册的 key */
export type StorageKey = keyof StorageSchema;
