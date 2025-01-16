import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  onIntersect?: (entry: IntersectionObserverEntry) => void;
  enabled?: boolean;
}

/**
 * 通用的 Intersection Observer Hook
 * @param elementRef 需要观察的元素引用
 * @param options 配置选项
 * @returns isIntersecting 是否进入视口
 */
const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    onIntersect,
    enabled = true,
  }: UseIntersectionObserverOptions = {}
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 如果禁用或没有元素引用，则不执行
    if (!enabled || !elementRef.current) {
      return;
    }

    // 清理之前的 observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // 创建新的 observer
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onIntersect?.(entry);
        });
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    // 开始观察
    observer.current.observe(elementRef.current);

    // 清理函数
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [elementRef, threshold, root, rootMargin, onIntersect, enabled]);
};

export default useIntersectionObserver; 