import React, { useState } from 'react';
import { Form, Input, Select, Button, Space, Tag, message, Modal, DatePicker, Dropdown, Layout } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  DownloadOutlined, 
  UploadOutlined,
  MoreOutlined,
  EyeOutlined
} from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableParams, TableColumnType } from '@/components/Table/types';
import type { MenuProps } from 'antd';
// import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface AdvancedUser {
  id: number;
  name: string;
  department: string;
  role: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  tags: string[];
}

const AdvancedTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<AdvancedUser[]>([]);
  const [dataSource, setDataSource] = useState<AdvancedUser[]>([
    {
      id: 1,
      name: 'John Brown',
      department: '技术部',
      role: '开发工程师',
      email: 'john@example.com',
      status: 'active',
      lastLogin: '2023-12-01 10:00:00',
      createdAt: '2023-01-01',
      tags: ['前端', 'React'],
    },
    // 添加更多示例数据...
  ]);

  // 状态映射
  const statusMap = {
    active: { text: '在职', color: 'success' },
    inactive: { text: '离职', color: 'error' },
    pending: { text: '待入职', color: 'warning' },
  };

  // 列定义
  const columns: TableColumnType<AdvancedUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left' as const,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      fixed: 'left' as const,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
      filters: [
        { text: '技术部', value: '技术部' },
        { text: '产品部', value: '产品部' },
      ],
    },
    {
      title: '职位',
      dataIndex: 'role',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: keyof typeof statusMap) => (
        <Tag color={statusMap[status].color}>
          {statusMap[status].text}
        </Tag>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      width: 180,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: AdvancedUser) => (
        <Dropdown menu={{ items: getActionMenuItems(record) }}>
          <Button type="link" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // 获取操作菜单项
  const getActionMenuItems = (record: AdvancedUser): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看',
      onClick: () => handleView(record),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => handleEdit(record),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      onClick: () => handleDelete(record),
    },
  ];

//   // 搜索表单
//   const searchForm = (
//     <>
//       <Form.Item name="name" label="姓名">
//         <Input placeholder="请输入姓名" allowClear />
//       </Form.Item>
//       <Form.Item name="department" label="部门">
//         <Select
//           placeholder="请选择部门"
//           allowClear
//           options={[
//             { label: '技术部', value: '技术部' },
//             { label: '产品部', value: '产品部' },
//           ]}
//         />
//       </Form.Item>
//       <Form.Item name="status" label="状态">
//         <Select
//           placeholder="请选择状态"
//           allowClear
//           options={Object.entries(statusMap).map(([value, { text }]) => ({
//             label: text,
//             value,
//           }))}
//         />
//       </Form.Item>
//       <Form.Item name="dateRange" label="创建时间">
//         <RangePicker />
//       </Form.Item>
//     </>
//   );

  // 处理导出选中
  const handleExportSelected = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要导出的记录');
      return;
    }
    message.success(`导出 ${selectedRows.length} 条记录`);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRows.length} 条记录吗？`,
      onOk: () => {
        const ids = selectedRows.map(row => row.id);
        setDataSource(dataSource.filter(item => !ids.includes(item.id)));
        setSelectedRows([]);
        message.success('批量删除成功');
      },
    });
  };

  // 批量操作菜单
  const batchActionItems: MenuProps['items'] = [
    {
      key: 'export',
      icon: <DownloadOutlined />,
      label: '导出所选',
      onClick: handleExportSelected,
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '批量删除',
      danger: true,
      onClick: handleBatchDelete,
    },
  ];

  // 模拟API请求
  const fetchData = (params: TableParams) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Fetching data with params:', params);
      setLoading(false);
    }, 500);
  };

  // 处理表格变化
  const handleTableChange = (params: TableParams) => {
    fetchData(params);
  };

  // 处理查看
  const handleView = (record: AdvancedUser) => {
    Modal.info({
      title: '用户详情',
      content: (
        <div>
          <p>ID: {record.id}</p>
          <p>姓名: {record.name}</p>
          <p>部门: {record.department}</p>
          <p>职位: {record.role}</p>
          <p>邮箱: {record.email}</p>
        </div>
      ),
    });
  };

  // 处理编辑
  const handleEdit = (record: AdvancedUser) => {
    message.info(`编辑用户: ${record.name}`);
  };

  // 处理删除
  const handleDelete = (record: AdvancedUser) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${record.name} 吗？`,
      onOk: () => {
        setDataSource(dataSource.filter(item => item.id !== record.id));
        message.success('删除成功');
      },
    });
  };

  // 处理新建
  const handleAdd = () => {
    message.info('点击了新建按钮');
  };

  // 处理导入
  const handleImport = () => {
    message.info('点击了导入按钮');
  };

  // 处理导出
  const handleExport = () => {
    message.info('点击了导出按钮');
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
    //   searchForm={searchForm}
      toolbarLeft={
        selectedRows.length > 0 ? (
          <Space>
            <span>已选择 {selectedRows.length} 项</span>
            <Dropdown menu={{ items: batchActionItems }}>
              <Button>
                批量操作
              </Button>
            </Dropdown>
          </Space>
        ) : null
      }
      toolbarRight={
        <Space>
          <Button icon={<UploadOutlined />} onClick={handleImport}>
            导入
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出
          </Button>
          <Button type="primary" onClick={handleAdd}>
            新建
          </Button>
        </Space>
      }
      loading={loading}
      onChange={handleTableChange}
      onRefresh={() => fetchData({})}
      rowSelection={{
        selectedRowKeys: selectedRows.map(row => row.id),
        onChange: (_, rows) => setSelectedRows(rows),
      }}
      cardProps={{
        title: '高级表格',
      }}
    />
  );
};

export default AdvancedTable; 

export const routeConfig ={
    title: '高级表格',
    
    sort:2,
}