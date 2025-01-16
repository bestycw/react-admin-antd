import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  Line, Column, Pie, Area, DualAxes, 
  Gauge, Rose, Radar, Funnel,
  Scatter, Heatmap, WordCloud,
  Waterfall, Violin,
  Bullet, RadialBar,
  Sankey, BidirectionalBar
} from '@ant-design/plots';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import LineChart from './components/LineChart';
import ColumnChart from './components/ColumnChart';
import MultiChart from './components/MultiChart';

const ChartsPage: React.FC = () => {
  // 散点图数据
  const scatterData = Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 5,
    type: ['类型A', '类型B', '类型C'][Math.floor(Math.random() * 3)]
  }));

  // 热力图数据
  const heatmapData = Array.from({ length: 7 }, (_, i) => 
    Array.from({ length: 24 }, (_, j) => ({
      hour: `${j}:00`,
      day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      value: Math.floor(Math.random() * 100)
    }))
  ).flat();

  // 词云图数据
  const wordCloudData = [
    { word: 'React', weight: 30 },
    { word: 'Vue', weight: 25 },
    { word: 'Angular', weight: 20 },
    { word: 'JavaScript', weight: 35 },
    { word: 'TypeScript', weight: 28 },
    // ... 更多数据
  ];

  // 新增仪表盘数据
  const gaugeData = {
    percent: 0.75,
    range: { color: 'l(0) 0:#B8E1FF 1:#3D76DD' },
  };

  // 新增漏斗图数据
  const funnelData = [
    { stage: '浏览', value: 1000 },
    { stage: '点击', value: 800 },
    { stage: '加购', value: 600 },
    { stage: '下单', value: 400 },
    { stage: '支付', value: 200 },
  ];

  // 新增玫瑰图数据
  const roseData = [
    { type: '分类A', value: 27 },
    { type: '分类B', value: 25 },
    { type: '分类C', value: 18 },
    { type: '分类D', value: 15 },
    { type: '分类E', value: 10 },
  ];

  // 新增树图数据
  const treeMapData = {
    name: '总体',
    children: [
      {
        name: '分类1',
        value: 560,
        children: [
          { name: '子项1', value: 280 },
          { name: '子项2', value: 180 },
          { name: '子项3', value: 100 },
        ],
      },
      {
        name: '分类2',
        value: 440,
        children: [
          { name: '子项4', value: 230 },
          { name: '子项5', value: 210 },
        ],
      },
      // ... 更多数据
    ],
  };

  // 新增桑基图数据
  const sankeyData = {
    nodes: [
      { id: '0', name: '起点' },
      { id: '1', name: '节点1' },
      { id: '2', name: '节点2' },
      { id: '3', name: '节点3' },
      { id: '4', name: '终点' },
    ],
    edges: [
      { source: '0', target: '1', value: 5 },
      { source: '0', target: '2', value: 3 },
      { source: '1', target: '3', value: 4 },
      { source: '2', target: '3', value: 2 },
      { source: '3', target: '4', value: 6 },
    ],
  };

  // 新增子弹图数据
  const bulletData = [
    {
      title: '指标1',
      ranges: [40, 70, 100],
      measures: [80],
      target: 85,
    },
    {
      title: '指标2',
      ranges: [20, 50, 100],
      measures: [60],
      target: 70,
    },
  ];

  // 漏斗图配置
  const funnelConfig = {
    data: funnelData,
    xField: 'stage',
    yField: 'value',
    shape: 'pyramid',
  };

  // 仪表盘配置
  const gaugeConfig = {
    percent: 0.75,
    range: {
      color: 'l(0) 0:#B8E1FF 1:#3D76DD',
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: '36px',
          lineHeight: '36px',
        },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-50">
      {/* 主要图表区域 */}
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="销售趋势" bordered={false}>
            <LineChart />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="转化漏斗" bordered={false}>
            <Funnel {...funnelConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="数据流向" bordered={false}>
            <Sankey
              data={sankeyData}
              nodePaddingRatio={0.03}
              nodeWidth={0.008}
              nodeDraggable={true}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="玫瑰图表" bordered={false}>
            <Rose
              data={roseData}
              xField="type"
              yField="value"
              seriesField="type"
              radius={0.9}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="目标完成度" bordered={false}>
            <Bullet
              data={bulletData}
              measureField="measures"
              rangeField="ranges"
              targetField="target"
              xField="title"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="双向对比" bordered={false}>
            <BidirectionalBar
              data={[
                { country: '中国', '2020': 100, '2021': 120 },
                { country: '美国', '2020': 90, '2021': 110 },
                { country: '英国', '2020': 80, '2021': 95 },
              ]}
              xField="country"
              yField={['2020', '2021']}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="径向进度" bordered={false}>
            <RadialBar
              data={[
                { name: '指标1', star: 80 },
                { name: '指标2', star: 60 },
                { name: '指标3', star: 40 },
              ]}
              xField="name"
              yField="star"
              maxAngle={350}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="瀑布图" bordered={false}>
            <Waterfall
              data={[
                { type: '期初', value: 100 },
                { type: '收入', value: 60 },
                { type: '支出', value: -30 },
                { type: '期末', value: 130 },
              ]}
              xField="type"
              yField="value"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="小提琴图" bordered={false}>
            <Violin
              data={[
                { x: '类别1', y: 1.2 },
                { x: '类别1', y: 2.3 },
                { x: '类别2', y: 3.1 },
                { x: '类别2', y: 1.8 },
              ]}
              xField="x"
              yField="y"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChartsPage;

export const routeConfig = {
  title: 'route.function.charts',
  layout: true,
}; 