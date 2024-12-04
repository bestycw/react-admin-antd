import React from 'react';
import { Carousel, Space } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

interface VerticalCarouselProps {
  items: Array<{
    title: string;
    imageUrl: string;
  }>;
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({ items }) => {
  const verticalRef = React.useRef<any>(null);

  return (
    <div className="w-full">
      <div className="flex justify-end items-center mb-4 space-x-4">
        <Space>
          <UpOutlined 
            className="cursor-pointer hover:text-blue-500 transition-colors" 
            onClick={() => verticalRef.current?.prev()} 
          />
          <DownOutlined 
            className="cursor-pointer hover:text-blue-500 transition-colors" 
            onClick={() => verticalRef.current?.next()} 
          />
        </Space>
      </div>
      <div className="h-[400px]">
        <Carousel
          ref={verticalRef}
          dots={false}
          vertical
          autoplay
          className="vertical-carousel h-full"
        >
          {items.map((item, index) => (
            <div key={index} className="h-full">
              <div className="relative h-full rounded-lg overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="vertical-overlay absolute inset-0 flex items-center justify-center bg-black/30">
                  <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default VerticalCarousel; 