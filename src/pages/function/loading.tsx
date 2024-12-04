import React from 'react';
import { Card, Divider } from 'antd';
import Loading from '@/components/Loading';
import WaveLoading from '@/components/Loading/Wave';
import CircleLoading from '@/components/Loading/Circle';
import PulseLoading from '@/components/Loading/Pulse';

const LoadingDemo: React.FC = () => {
  return (
    <Card title="Loading 效果展示" className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Loading className="!opacity-100" />
          <Divider type="vertical" className="h-12 mx-8" />
          <div className="text-gray-500">原子动画</div>
        </div>
        
        <div className="flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg">
          <WaveLoading />
          <Divider type="vertical" className="h-12 mx-8" />
          <div className="text-gray-500">波浪动画</div>
        </div>
        
        <div className="flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg">
          <CircleLoading />
          <Divider type="vertical" className="h-12 mx-8" />
          <div className="text-gray-500">环形动画</div>
        </div>
        
        <div className="flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg">
          <PulseLoading />
          <Divider type="vertical" className="h-12 mx-8" />
          <div className="text-gray-500">脉冲动画</div>
        </div>
      </div>
    </Card>
  );
};

export default LoadingDemo;

export const routeConfig = {
  title: 'Loading效果',
  sort: 2,
};