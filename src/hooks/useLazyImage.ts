import { useState, useRef, useCallback } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  enabled?: boolean;
}

/**
 * 图片懒加载 Hook
 * @param src 图片实际地址
 * @param options 配置选项
 * @returns 返回需要的状态和引用
 */
const useLazyImage = (
  src: string,
  {
    threshold = 0,
    rootMargin = '50px',
    root = null,
    placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    onLoad,
    onError,
  }: UseLazyImageOptions = {}
) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // 图片加载处理函数
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // 图片加载错误处理函数
  const handleError = useCallback((err: Error) => {
    setError(err);
    onError?.();
  }, [onError]);

  // 当元素进入视口时的处理函数
  const handleIntersect = useCallback((entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting && imgRef.current) {
      // 创建新的图片对象来预加载
      const img = new Image();
      
      img.onload = () => {
        setCurrentSrc(src);
        handleLoad();
      };
      
      img.onerror = () => {
        handleError(new Error('Failed to load image'));
      };

      img.src = src;
    }
  }, [src, handleLoad, handleError]);

  // 使用 Intersection Observer
  useIntersectionObserver(imgRef, {
    threshold,
    root,
    rootMargin,
    onIntersect: handleIntersect,
    enabled: !isLoaded && !error,
  });

  return {
    imgRef,
    currentSrc,
    isLoaded,
    error,
    // 返回 props 方便直接展开到 img 标签上
    imgProps: {
      ref: imgRef,
      src: currentSrc,
      alt: '',
      style: {
        opacity: isLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out',
      },
    },
  };
};

export default useLazyImage; 