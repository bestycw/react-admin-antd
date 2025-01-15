import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import BasicGallery from './components/BasicGallery';
import BlurGallery from './components/BlurGallery';
import WaterfallGallery from './components/WaterfallGallery';

const LazyImageDemo: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: 'basic',
      label: '基础懒加载',
      children: <BasicGallery />,
    },
    {
      key: 'blur',
      label: '模糊渐进式加载',
      children: <BlurGallery />,
    },
    {
      key: 'waterfall',
      label: '瀑布流懒加载',
      children: <WaterfallGallery />,
    },
  ];

  return (
    <div className="p-4 bg-white min-h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">图片懒加载示例</h1>
        <p className="text-gray-500">展示不同的图片懒加载实现方式和效果</p>
      </div>
      <Tabs
        defaultActiveKey="basic"
        items={items}
        className="lazy-image-tabs"
      />
    </div>
  );
};

export default LazyImageDemo;

export const routeConfig = {
  title: '图片懒加载',
  sort: 1,
};
