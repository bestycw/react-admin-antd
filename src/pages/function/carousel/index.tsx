import React from 'react';
import { Tabs, Card } from 'antd';
import Carousel3D from './components/Carousel3D';
import CardStackCarousel from './components/CardStackCarousel';
import CubeCarousel from './components/CubeCarousel';
import ParallaxCarousel from './components/ParallaxCarousel';
import BasicCarousel from './components/BasicCarousel';
import VerticalCarousel from './components/VerticalCarousel';

const CarouselPage: React.FC = () => {
  // 示例数据
  const items = [
    {
      title: "Mountain View",
      imageUrl: "https://picsum.photos/800/500?random=1",
    },
    {
      title: "Ocean Sunset",
      imageUrl: "https://picsum.photos/800/500?random=2",
    },
    {
      title: "Forest Path",
      imageUrl: "https://picsum.photos/800/500?random=3",
    },
    {
      title: "City Lights",
      imageUrl: "https://picsum.photos/800/500?random=4",
    },
    {
      title: "Desert Dunes",
      imageUrl: "https://picsum.photos/800/500?random=5",
    },
  ];

  return (
    <div className="p-6">
      <Card title="轮播图展示" className="shadow-lg">
        <Tabs
          defaultActiveKey="basic"
          items={[
            {
              key: 'basic',
              label: '基础轮播',
              children: <BasicCarousel items={items} />,
            },
            {
              key: 'vertical',
              label: '垂直轮播',
              children: <VerticalCarousel items={items} />,
            },
            {
              key: '3d',
              label: '3D 覆盖轮播',
              children: <Carousel3D items={items} />,
            },
            {
              key: 'cards',
              label: '卡片堆叠轮播',
              children: <CardStackCarousel items={items} />,
            },
            {
              key: 'cube',
              label: '立方体轮播',
              children: <CubeCarousel items={items} />,
            },
            {
              key: 'parallax',
              label: '视差轮播',
              children: <ParallaxCarousel items={items} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default CarouselPage;

export const routeConfig = {
  title: '轮播图',
  layout: true,
}; 