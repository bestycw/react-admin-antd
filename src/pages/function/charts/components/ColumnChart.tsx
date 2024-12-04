import React from 'react';
import { Column } from '@ant-design/plots';

const ColumnChart: React.FC = () => {
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}月`,
    value: Math.floor(Math.random() * 1000 + 200),
    type: '销售额'
  })).concat(
    Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}月`,
      value: Math.floor(Math.random() * 800 + 100),
      type: '利润'
    }))
  );

  const config = {
    data,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'middle',
    },
    interaction: {
      type: 'active-region',
    },
  };

  return <Column {...config} />;
};

export default ColumnChart; 