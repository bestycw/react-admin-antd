import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Table,
  Tag,
  Space,
  Drawer,
  Radio,
  message,
  InputNumber,
  Row,
  Col,
  Divider
} from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined, DownOutlined, UpOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TableItem {
  key: string;
  name: string;
  status: string;
  type: string;
  date: string;
  amount: number;
}

const SearchForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TableItem[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const columns: TableColumnsType<TableItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'completed' ? 'success' :
          status === 'pending' ? 'processing' :
          'error'
        }>
          {status === 'completed' ? '已完成' :
           status === 'pending' ? '进行中' :
           '已取消'}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) => `￥${amount.toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">查看</Button>
          <Button type="link">编辑</Button>
        </Space>
      ),
    },
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      console.log('Search values:', values);
      // 模拟API请求
      setTimeout(() => {
        const mockData: TableItem[] = Array(10).fill(null).map((_, index) => ({
          key: index.toString(),
          name: `项目 ${index + 1}`,
          status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
          type: ['类型A', '类型B', '类型C'][Math.floor(Math.random() * 3)],
          date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 10000)
        }));
        setData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Search form error:', error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Card className="mb-4 shadow-sm">
        {/* 搜索表单部分 */}
        <div className="mb-4">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSearch}
            className="w-full"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="keyword" label="关键词">
                  <Input placeholder="请输入关键词" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="status" label="状态">
                  <Select placeholder="请选择状态" allowClear>
                    <Option value="completed">已完成</Option>
                    <Option value="pending">进行中</Option>
                    <Option value="cancelled">已取消</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="type" label="类型">
                  <Select placeholder="请选择类型" allowClear>
                    <Option value="typeA">类型A</Option>
                    <Option value="typeB">类型B</Option>
                    <Option value="typeC">类型C</Option>
                  </Select>
                </Form.Item>
              </Col>
              {expanded && (
                <>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="dateRange" label="日期范围">
                      <RangePicker className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="minAmount" label="最小金额">
                      <InputNumber
                        className="w-full"
                        placeholder="请输入最小金额"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="maxAmount" label="最大金额">
                      <InputNumber
                        className="w-full"
                        placeholder="请输入最大金额"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
            <Row>
              <Col span={24} className="flex justify-center">
                <a
                  className="text-gray-600 hover:text-blue-600 mb-4"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <span>收起 <UpOutlined /></span>
                  ) : (
                    <span>展开 <DownOutlined /></span>
                  )}
                </a>
              </Col>
            </Row>
          </Form>
        </div>

        {/* 操作按钮部分 */}
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              新建
            </Button>
            <Button icon={<FilterOutlined />} onClick={() => setShowFilter(true)}>
              筛选
            </Button>
          </Space>
          <Space>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              重置
            </Button>
            <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />} loading={loading}>
              搜索
            </Button>
          </Space>
        </div>

        <Divider className="my-4" />

        {/* 表格部分 */}
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 筛选抽屉 */}
      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setShowFilter(false)}
        open={showFilter}
        width={320}
      >
        <Form layout="vertical">
          <Form.Item label="排序方式">
            <Radio.Group>
              <Radio value="time">时间</Radio>
              <Radio value="amount">金额</Radio>
            </Radio.Group>
          </Form.Item>
          {/* 更多筛选项 */}
        </Form>
      </Drawer>
    </div>
  );
};

export default SearchForm;

export const routeConfig = {
  title: '搜索表单',
  layout: true,
  auth: true,
};
