import React, { useState, useEffect, useRef } from 'react';
import useLazyImage from '@/hooks/useLazyImage';
import { Skeleton } from 'antd';

interface ImageProps {
  id?: number;
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
}

const WaterfallImage: React.FC<ImageProps> = ({ src, alt = '', width, height, className = '' }) => {
  const aspectRatio = height / width;
  
  const { imgProps, isLoaded, error } = useLazyImage(src, {
    rootMargin: '100px',
    onLoad: () => console.log('Image loaded:', src),
    onError: () => console.error('Failed to load image:', src),
  });

  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-gray-100 w-full"
      style={{ paddingBottom: `${aspectRatio * 100}%` }}
    >
      <img
        {...imgProps}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${className} ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
      {!isLoaded && !error && (
        <div className="absolute inset-0">
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

const WaterfallGallery: React.FC = () => {
  const [columns, setColumns] = useState<ImageProps[][]>([[], [], []]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 生成测试图片数据
  const images: ImageProps[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: `https://picsum.photos/${800 + i % 3 * 100}/${500 + i % 2 * 100}?random=${i + 1}`,
    alt: `Random image ${i + 1}`,
    width: 800 + i % 3 * 100,
    height: 500 + i % 2 * 100,
  }));

  // 计算每列的高度
  const getShortestColumn = (cols: ImageProps[][]) => {
    const heights = cols.map(col => 
      col.reduce((sum, img) => sum + (img.height / img.width), 0)
    );
    return heights.indexOf(Math.min(...heights));
  };

  // 分配图片到最短的列
  useEffect(() => {
    const newColumns: ImageProps[][] = [[], [], []];
    images.forEach(image => {
      const shortestCol = getShortestColumn(newColumns);
      newColumns[shortestCol].push(image);
    });
    setColumns(newColumns);
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-gray-500 mb-4">
        瀑布流布局实现，根据图片原始比例展示，并使用懒加载优化加载性能。
      </div>
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {column.map((image) => (
              <WaterfallImage
                key={image.id}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="shadow-md hover:shadow-lg"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterfallGallery; 