/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Button, Timeline, Tag, Tooltip, Alert, Badge } from 'antd';
// import type { Dayjs } from 'dayjs';
import { 
  ArrowUpOutlined, ArrowDownOutlined, UserOutlined, ShoppingCartOutlined, 
  FileTextOutlined, TeamOutlined, ReloadOutlined,
  CheckCircleOutlined, ClockCircleOutlined, InfoCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Area, Pie } from '@ant-design/plots';
import { RouteConfig } from '@/types/route';
export const routeConfig: RouteConfig = {
    title: '首页',
    icon: <HomeOutlined />,
    layout: true,
    auth: true,
    sort: 0,
    // roles: ['admin'] // 可以添加权限控制
}
const Dashboard: React.FC = () => {
  // 统计数据
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 112893,
    orders: 8846,
    articles: 93,
    teams: 12
  });

  // 系统公告
  const announcements = [
    {
      id: 1,
      title: '系统升级通知',
      type: 'warning',
      content: '系统将于本周六凌晨2点进行升级维护，预计耗时2小时。',
      date: '2024-01-20'
    },
    {
      id: 2,
      title: '新功能上线',
      type: 'success',
      content: '新版本数据分析功能已上线，欢迎体验！',
      date: '2024-01-19'
    }
  ];

  // 待办事项
  const todos = [
    { id: 1, title: '审核新用户申请', status: 'pending', priority: 'high', deadline: '2024-01-21' },
    { id: 2, title: '系统升级维护', status: 'completed', priority: 'medium', deadline: '2024-01-20' },
    { id: 3, title: '数据周报生成', status: 'pending', priority: 'low', deadline: '2024-01-22' }
  ];

  // 访问量数据
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

  // 刷新数据
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(prev => ({
        ...prev,
        users: prev.users + Math.floor(Math.random() * 100)
      }));
    } finally {
      setLoading(false);
    }
  };

  const areaConfig = {
    data: visitData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
    line: {
      color: '#1890ff'
    }
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}'
    },
    interactions: [
      {
        type: 'element-active'
      }
    ]
  };

  return (
    <div>
      {/* 系统公告 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          {announcements.map(announcement => (
            <Alert
              key={announcement.id}
              message={announcement.title}
              description={announcement.content}
              type={announcement.type as any}
              showIcon
              style={{ marginBottom: '12px' }}
            />
          ))}
        </Col>
      </Row>

      {/* 数据概览卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="总用户数"
              value={stats.users}
              prefix={<UserOutlined />}
              suffix={
                <Tooltip title="较上月增长8.5%">
                  <ArrowUpOutlined style={{ color: '#3f8600' }} />
                </Tooltip>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={85} showInfo={false} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} loading={loading}>
            <Statistic
              title="订单总量"
              value={stats.orders}
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
          <Card bordered={false} loading={loading}>
            <Statistic
              title="文章数量"
              value={stats.articles}
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
          <Card bordered={false} loading={loading}>
            <Statistic
              title="团队数量"
              value={stats.teams}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={60} showInfo={false} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表和待办事项 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title="访问量趋势" 
            bordered={false}
            extra={
              <Button 
                type="text" 
                icon={<ReloadOutlined />} 
                loading={loading}
                onClick={handleRefresh}
              >
                刷新
              </Button>
            }
          >
            <Area {...areaConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="待办事项" 
            bordered={false}
            extra={<Button type="link">查看全部</Button>}
          >
            <Timeline style={{ padding: '20px 0' }}>
              {todos.map(todo => (
                <Timeline.Item
                  key={todo.id}
                  dot={
                    todo.status === 'completed' 
                      ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      : <ClockCircleOutlined style={{ color: '#faad14' }} />
                  }
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{todo.title}</span>
                    <Tag color={
                      todo.priority === 'high' ? 'red' : 
                      todo.priority === 'medium' ? 'orange' : 'blue'
                    }>
                      {todo.priority.toUpperCase()}
                    </Tag>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    {todo.deadline}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 数据分布和活动列表 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card 
            title="数据分布" 
            bordered={false}
            extra={
              <Tooltip title="最近30天数据">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            }
          >
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="最近活动" 
            bordered={false}
            extra={<Button type="link">更多</Button>}
          >
            <List
              dataSource={[
                { title: '用户A完成了订单', time: '2分钟前', type: 'success' },
                { title: '新用户注册', time: '5分钟前', type: 'info' },
                { title: '系统更新完成', time: '1小时前', type: 'warning' },
                { title: '数据备份成功', time: '2小时前', type: 'success' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Badge status={item.type as any} />}
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
// Dashboard.displayName = 'Dashboard'
// Dashboard.meta = {
//     title: 'Dashboard',
//     icon: 'icon-dashboard',
//     order: 1
// }
export default Dashboard; 
