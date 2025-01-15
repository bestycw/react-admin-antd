import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import AntdVirtualTable from './components/AntdVirtualTable';
import TransformVirtualTable from './components/TransformVirtualTable';
import { generateData, VIRTUAL_CONFIG } from './config';
import './index.scss';
import WindowVirtualTable from './components/WindowVirtualTable';

const VirtualTable: React.FC = () => {
  const [data, setData] = useState(() => generateData(VIRTUAL_CONFIG.TOTAL_COUNT));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(generateData(VIRTUAL_CONFIG.TOTAL_COUNT));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const items: TabsProps['items'] = [
    {
      key: 'antd',
      label: 'Antd虚拟滚动',
      children: <AntdVirtualTable dataSource={data} loading={loading} />,
    },
    {
      key: 'transform',
      label: 'Transform虚拟滚动',
      children: <TransformVirtualTable dataSource={data} loading={loading} />,
    },
    {
      key: 'window',
      label: 'React Window',
      children: <WindowVirtualTable dataSource={data} loading={loading} />,
    },
  ];

  return (
    <div className=" bg-white p-4">
      <Tabs
        defaultActiveKey="antd"
        items={items}
        className="virtual-table-tabs"
      />
    </div>
  );
};

export default VirtualTable;

export const routeConfig = {
  title: '虚拟滚动',
  sort: 5,
}; 