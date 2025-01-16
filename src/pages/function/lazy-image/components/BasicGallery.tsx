import React from 'react';
import useLazyImage from '@/hooks/useLazyImage';
import { Skeleton } from 'antd';

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const LazyImage: React.FC<ImageProps> = ({ src, alt = '', className = '' }) => {
  const { imgProps, isLoaded, error } = useLazyImage(src, {
    rootMargin: '50px',
    onLoad: () => console.log('Image loaded:', src),
    onError: () => console.error('Failed to load image:', src),
  });

  return (
    <div className="relative rounded-lg overflow-hidden">
      <img
        {...imgProps}
        alt={alt}
        className={`w-full h-[200px] object-cover transition-all duration-500 ${className} ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-100">
          <Skeleton.Image className="w-full h-full" active />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500">
          加载失败
        </div>
      )}
    </div>
  );
};

const BasicGallery: React.FC = () => {
  // 生成测试图片数据
  const images = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: `https://picsum.photos/800/600?random=${i + 1}`,
    alt: `Random image ${i + 1}`,
  }));

  return (
    <div className="space-y-4">
      <div className="text-gray-500 mb-4">
        基础懒加载实现，使用 Intersection Observer 监测图片是否进入视口，
        并添加了加载状态和错误处理。
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <LazyImage
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="shadow-md hover:shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default BasicGallery; 