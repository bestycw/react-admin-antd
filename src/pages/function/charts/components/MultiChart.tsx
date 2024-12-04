import React from 'react';
import { DualAxes } from '@ant-design/plots';

const MultiChart: React.FC = () => {
  const data = [
    Array.from({ length: 12 }, (_, i) => ({
      month: `${i + 1}月`,
      订单量: Math.floor(Math.random() * 1000 + 500),
      利润: Math.floor(Math.random() * 10000 + 5000),
    }))
  ];

  const config = {
    data: data[0],
    xField: 'month',
    yField: ['订单量', '利润'],
    geometryOptions: [
      {
        geometry: 'column',
        color: '#5B8FF9',
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
        },
        color: '#5AD8A6',
      },
    ],
  };

  return <DualAxes {...config} />;
};

export default MultiChart; 