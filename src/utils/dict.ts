import { request } from './request';

interface DictItem {
  itemValue: string;
  itemLabel: string;
  status: '0' | '1';
}

class DictUtil {
  private static cache: Map<string, DictItem[]> = new Map();

  // 获取字典数据
  static async getDict(dictCode: string): Promise<DictItem[]> {
    // 先从缓存获取
    if (this.cache.has(dictCode)) {
      return this.cache.get(dictCode)!;
    }

    // 缓存不存在则请求接口
    try {
      const res:any = await request.get(`/api/dict/items/${dictCode}`);
      const items = res.data.filter((item: DictItem) => item.status === '1');
      this.cache.set(dictCode, items);
      return items;
    } catch (error) {
      console.error('获取字典数据失败:', error);
      return [];
    }
  }

  // 根据值获取标签
  static async getLabelByValue(dictCode: string, value: string): Promise<string> {
    const items = await this.getDict(dictCode);
    const item = items.find(item => item.itemValue === value);
    return item ? item.itemLabel : '';
  }

  // 清除缓存
  static clearCache(dictCode?: string) {
    if (dictCode) {
      this.cache.delete(dictCode);
    } else {
      this.cache.clear();
    }
  }
}

export default DictUtil; 