import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Progress, List } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ShoppingCartOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import { Pie } from '@ant-design/plots';

const Dashboard: React.FC = () => {
  // 模拟数据
  const [visitData] = useState([
    { date: '2024-01', value: 3 },
    { date: '2024-02', value: 4 },
    { date: '2024-03', value: 3.5 },
    { date: '2024-04', value: 5 },
    { date: '2024-05', value: 4.9 },
    { date: '2024-06', value: 6 },
  ]);

  const pieData = [
    { type: '分类一', value: 27 },
    { type: '分类二', value: 25 },
    { type: '分类三', value: 18 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
  ];

  const recentActivities = [
    { title: '用户A完成了订单', time: '2分钟前' },
    { title: '新用户注册', time: '5分钟前' },
    { title: '系统更新完成', time: '1小时前' },
    { title: '数据备份成功', time: '2小时前' },
  ];

  const areaConfig = {
    data: visitData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 数据概览卡片 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="总用户数"
              value={112893}
              prefix={<UserOutlined />}
              suffix="人"
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={85} showInfo={false} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="订单总量"
              value={8846}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={75} showInfo={false} status="active" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="文章数量"
              value={93}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix={<ArrowDownOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={45} showInfo={false} status="exception" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title="团队数量"
              value={12}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={60} showInfo={false} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={14}>
          <Card title="访问量趋势" bordered={false}>
            <Area {...areaConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card title="数据占比" bordered={false}>
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="最近活动" bordered={false}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 