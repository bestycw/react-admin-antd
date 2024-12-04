import StorageManager from './storageManager';

class CacheStorage {
  set<T>(key: string, value: T, expires?: number) {
    StorageManager.set(`cache:${key}`, value, { 
      type: 'local',
      expires: expires ? Date.now() + expires * 1000 : undefined 
    });
  }

  get<T>(key: string, defaultValue: T): T {
    return StorageManager.get<T>(`cache:${key}`, defaultValue, { type: 'local' });
  }

  getOptional<T>(key: string): T | undefined {
    return StorageManager.get<T | undefined>(`cache:${key}`, undefined, { type: 'local' });
  }

  has(key: string): boolean {
    return StorageManager.has(`cache:${key}`, { type: 'local' });
  }

  remove(key: string) {
    StorageManager.remove(`cache:${key}`, { type: 'local' });
  }

  clear() {
    const keys = StorageManager.keys('local')
      .filter(key => key.startsWith('cache:'));
    StorageManager.remove(keys, { type: 'local' });
  }
}

export const cacheStorage = new CacheStorage();
export default cacheStorage; 