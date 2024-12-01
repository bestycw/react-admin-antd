class FrameCache {
  private cache: Map<string, string> = new Map();
  private maxSize: number = 100;

  add(key: string, frame: string) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, frame);
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const frameCache = new FrameCache(); 