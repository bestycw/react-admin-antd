import React from 'react';
import { Line } from '@ant-design/plots';

const LineChart: React.FC = () => {
  const data = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 1000 + 500),
    type: '今日',
  })).concat(
    Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 1000 + 500),
      type: '昨日',
    }))
  );

  const config = {
    data,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
  };

  return <Line {...config} />;
};

export default LineChart; 