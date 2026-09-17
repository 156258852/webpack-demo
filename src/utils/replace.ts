/**
 * 按开关取 JSON 里的值（成对 key）
 *
 * 约定：需要隐藏/脱敏的字段，在同一个对象里配一个兄弟字段，
 *       key 用「原名 + 后缀」，默认后缀 `_masked`：
 *
 *   { "phone": "13800138000", "phone_masked": "138****0000" }
 *
 *   resolveMasked(json)        → { "phone": "138****0000" }   开关关，用遮蔽值
 *   resolveMasked(json, true)  → { "phone": "13800138000" }   开关开，用原文
 *
 */

const MASKED_SUFFIX = '_masked';

const isArray = (v: unknown): v is unknown[] => Array.isArray(v);
const isObject = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export function resolveMasked<T>(o: T, showSensitive = false): T {
  if (!isArray(o) && !isObject(o)) {
    return o;
  }

  const clone: any = isArray(o) ? [] : {};

  for (const k in o) {
    if (Object.prototype.hasOwnProperty.call(o, k)) {
      // 后缀键自己不进结果
      if (k.endsWith(MASKED_SUFFIX)) continue;

      // 同级有后缀键 → 当前 key 取它的值
      const maskedKey = k + MASKED_SUFFIX;
      const child =
        Object.prototype.hasOwnProperty.call(o, maskedKey) && !showSensitive
          ? (o as any)[maskedKey]
          : (o as any)[k];

      if (isObject(child) || isArray(child)) {
        clone[k] = resolveMasked(child, showSensitive);
      } else {
        clone[k] = child;
      }
    }
  }

  return clone as T;
}

/**
 * 自检：列出结果里残留的后缀键路径。
 * 开发环境断言它为空数组 —— 有残留就说明有地方绕过了 resolveMasked。
 */
export function findMaskedKeys(
  o: unknown,
  path = '',
  hits: string[] = [],
): string[] {
  if (!isObject(o) && !isArray(o)) return hits;

  if (isArray(o)) {
    o.forEach((item, i) => findMaskedKeys(item, `${path}[${i}]`, hits));
    return hits;
  }

  for (const k in o) {
    if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
    const here = path ? `${path}.${k}` : k;
    if (k.endsWith(MASKED_SUFFIX)) hits.push(here);
    findMaskedKeys((o as any)[k], here, hits);
  }
  return hits;
}
