import React, { useState, useCallback } from 'react';
import useLazyImage from '@/hooks/useLazyImage';

interface ImageProps {
  src: string;
  thumbSrc: string;
  alt?: string;
  className?: string;
}

const BlurImage: React.FC<ImageProps> = ({ src, thumbSrc, alt = '', className = '' }) => {
  const [isThumbLoaded, setIsThumbLoaded] = useState(false);
  
  const { imgProps: thumbProps } = useLazyImage(thumbSrc, {
    rootMargin: '50px',
    onLoad: () => setIsThumbLoaded(true),
  });

  const { imgProps, isLoaded } = useLazyImage(src, {
    rootMargin: '50px',
    enabled: isThumbLoaded, // 只有当缩略图加载完成后才加载原图
  });

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-100">
      {/* 缩略图（模糊） */}
      <img
        {...thumbProps}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 filter blur-lg scale-105 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* 原图 */}
      <img
        {...imgProps}
        alt={alt}
        className={`relative w-full h-[200px] object-cover transition-all duration-1000 ${className} ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        }`}
      />
    </div>
  );
};

const BlurGallery: React.FC = () => {
  // 生成测试图片数据
  const images = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: `https://picsum.photos/800/600?random=${i + 1}`,
    // 使用较小的图片作为缩略图
    thumbSrc: `https://picsum.photos/80/60?random=${i + 1}`,
    alt: `Random image ${i + 1}`,
  }));

  return (
    <div className="space-y-4">
      <div className="text-gray-500 mb-4">
        模糊渐进式加载实现，先加载一个模糊的缩略图，然后在其上加载清晰的原图，
        实现平滑的过渡效果。
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <BlurImage
            key={image.id}
            src={image.src}
            thumbSrc={image.thumbSrc}
            alt={image.alt}
            className="shadow-md hover:shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default BlurGallery; 