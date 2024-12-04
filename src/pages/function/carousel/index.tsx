import React from 'react';
import { Card } from 'antd';
import BasicCarousel from './components/BasicCarousel';
import Carousel3D from './components/Carousel3D';
import VerticalCarousel from './components/VerticalCarousel';
import './carousel.scss';

const CarouselDemo: React.FC = () => {
  const items = [
    {
      title: '第一张',
      imageUrl: 'https://picsum.photos/800/300?random=1'
    },
    {
      title: '第二张',
      imageUrl: 'https://picsum.photos/800/300?random=2'
    },
    {
      title: '第三张',
      imageUrl: 'https://picsum.photos/800/300?random=3'
    },
    {
      title: '第四张',
      imageUrl: 'https://picsum.photos/800/300?random=4'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Card title="基础轮播图">
        <BasicCarousel items={items} />
      </Card>

      <Card title="3D 轮播图">
        <Carousel3D items={items} />
      </Card>

      <Card title="垂直轮播图">
        <VerticalCarousel items={items} />
      </Card>
    </div>
  );
};

export default CarouselDemo; 

export const routeConfig={
  title:'轮播图',
  layout: true,

}