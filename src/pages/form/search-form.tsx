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
  InputNumber
} from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchFormValues {
  keyword?: string;
  status?: string;
  type?: string;
  dateRange?: [Dayjs, Dayjs];
}

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
      render: (_, record) => (
        <Space>
          <Button type="link">查看</Button>
          <Button type="link">编辑</Button>
        </Space>
      ),
    },
  ];

  const handleSearch = async (values: SearchFormValues) => {
    setLoading(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据
      const mockData: TableItem[] = Array(10).fill(0).map((_, index) => ({
        key: index.toString(),
        name: `项目 ${index + 1}`,
        status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
        type: ['类型A', '类型B', '类型C'][Math.floor(Math.random() * 3)],
        date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
        amount: Math.floor(Math.random() * 10000),
      }));

      setData(mockData);
      message.success('查询成功！');
    } catch (error) {
      message.error('查询失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-md mb-6">
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSearch}
          className="flex flex-wrap gap-4 items-end"
        >
          <Form.Item label="关键词" name="keyword">
            <Input placeholder="请输入关键词" style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Select placeholder="请选择状态" style={{ width: 200 }}>
              <Option value="completed">已完成</Option>
              <Option value="pending">进行中</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>

          <Form.Item label="日期范围" name="dateRange">
            <RangePicker style={{ width: 300 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
                loading={loading}
              >
                搜索
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  form.resetFields();
                  setData([]);
                }}
              >
                重置
              </Button>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilter(true)}
              >
                筛选
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card className="shadow-md">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            total: data.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setShowFilter(false)}
        open={showFilter}
        width={360}
      >
        <Form layout="vertical">
          <Form.Item label="排序方式">
            <Radio.Group>
              <Radio value="time">时间排序</Radio>
              <Radio value="amount">金额排序</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="金额范围">
            <Space>
              <InputNumber placeholder="最小金额" />
              <Input style={{ width: 30 }} disabled value="-" />
              <InputNumber placeholder="最大金额" />
            </Space>
          </Form.Item>

          <Form.Item label="类型">
            <Select mode="multiple" placeholder="请选择类型">
              <Option value="typeA">类型A</Option>
              <Option value="typeB">类型B</Option>
              <Option value="typeC">类型C</Option>
            </Select>
          </Form.Item>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <Space className="w-full justify-end">
              <Button onClick={() => setShowFilter(false)}>取消</Button>
              <Button type="primary" onClick={() => {
                message.success('筛选条件已应用');
                setShowFilter(false);
              }}>
                应用
              </Button>
            </Space>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default SearchForm;

export const routeConfig = {
  title: '搜索表单',
  icon: <SearchOutlined />,
  layout: true,
  auth: true,
};
