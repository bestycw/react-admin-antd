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