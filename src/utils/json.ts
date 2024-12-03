export const tryParseJsObject = (str: string): string => {
    try {
      // 首先尝试直接解析
      JSON.parse(str);
      return str;
    } catch {
      try {
        // 替换 JavaScript 对象中的特殊语法
        let processed = str
          // 替换未加引号的键名
          .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
          // 替换单引号为双引号
          .replace(/'/g, '"')
          // 替换 undefined 为 null
          .replace(/undefined/g, 'null')
          // 处理最后一个逗号
          .replace(/,(\s*[}\]])/g, '$1');

        // 验证处理后的字符串是否为有效的 JSON
        JSON.parse(processed);
        return processed;
      } catch (e) {
        throw new Error('无法解析为有效的 JSON 格式');
      }
    }
  };

// 判断是否是 React 组件
const isReactComponent = (value: any): boolean => {
    return value?.$$typeof || typeof value === 'function' || value instanceof Function;
};

// 判断是否是普通对象
const isPlainObject = (obj: any): boolean => {
    if (!obj || typeof obj !== 'object') return false;
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
};

/**
 * 深拷贝，但保留特定值的引用（如 React 组件）
 * @param obj 要拷贝的对象
 * @param preserveKeys 需要保留引用的键名数组，默认为 ['element', 'component']
 */
export function deepClone<T>(obj: T, preserveKeys: string[] = ['element', 'component']): T {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item, preserveKeys)) as unknown as T;
    }
    if (isReactComponent(obj)) return obj;

    const result = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            // 保留特定键名的值引用
            if (preserveKeys.includes(key) || isReactComponent(value)) {
                result[key] = value;
            } else if (isPlainObject(value) || Array.isArray(value)) {
                result[key] = deepClone(value, preserveKeys);
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}

  