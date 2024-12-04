import React from 'react';
import { Carousel, Radio, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface BasicCarouselProps {
  items: Array<{
    title: string;
    imageUrl: string;
  }>;
}

const BasicCarousel: React.FC<BasicCarouselProps> = ({ items }) => {
  const [effect, setEffect] = React.useState<'scrollx' | 'fade'>('scrollx');
  const carouselRef = React.useRef<any>(null);

  const handleEffectChange = (e: RadioChangeEvent) => {
    setEffect(e.target.value);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end items-center mb-4 space-x-4">
        <Radio.Group onChange={handleEffectChange} value={effect}>
          <Radio.Button value="scrollx">滚动</Radio.Button>
          <Radio.Button value="fade">淡入淡出</Radio.Button>
        </Radio.Group>
        <Space>
          <LeftOutlined 
            className="cursor-pointer hover:text-blue-500 transition-colors" 
            onClick={() => carouselRef.current?.prev()} 
          />
          <RightOutlined 
            className="cursor-pointer hover:text-blue-500 transition-colors" 
            onClick={() => carouselRef.current?.next()} 
          />
        </Space>
      </div>
      <Carousel
        ref={carouselRef}
        effect={effect}
        autoplay
        className="basic-carousel bg-gray-100"
      >
        {items.map((item, index) => (
          <div key={index}>
            <div className="relative h-[300px] bg-gray-200 overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <h3 className="text-white text-2xl">{item.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BasicCarousel; 