import React, { useState } from 'react';
import { Button, Space, Tag, message, Modal, Dropdown, Tooltip } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  DownloadOutlined, 
  UploadOutlined,
  MoreOutlined,
  EyeOutlined,
  DownOutlined
} from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableParams, TableColumnType } from '@/components/Table/types';
import type { MenuProps } from 'antd';

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
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

  const hasSelected = selectedRowKeys.length > 0;

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
      ellipsis: true,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '部门',
      dataIndex: 'department',
      ellipsis: true,
      width: 120,
      filters: [
        { text: '技术部', value: '技术部' },
        { text: '产品部', value: '产品部' },
      ],
    },
    {
      title: '职位',
      dataIndex: 'role',
      ellipsis: {
        showTitle: false, // 不使用原生 title 属性
      },
      width: 120,
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
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

  // 2. 添加工具栏按钮
  const toolbarRight = (
    <Space>
      <Button icon={<UploadOutlined />} onClick={handleImport}>导入</Button>
      <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
      <Button type="primary" onClick={handleAdd}>新建</Button>
    </Space>
  );

  // 处理导出选中
  const handleExportSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要导出的记录');
      return;
    }
    message.success(`导出 ${selectedRowKeys.length} 条记录`);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`,
      onOk: () => {
        setDataSource(dataSource.filter(item => !selectedRowKeys.includes(item.id)));
        setSelectedRowKeys([]);
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
      label: '���量删除',
      danger: true,
      onClick: handleBatchDelete,
    },
  ];

  // 3. 批量操作工具栏
  const toolbarLeft = hasSelected ? (
    <Space>
      <span>已选择 {selectedRowKeys.length} 项</span>
      <Dropdown menu={{ items: batchActionItems }}>
        <Button>批量操作<DownOutlined /></Button>
      </Dropdown>
    </Space>
  ) : null;

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

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
    //   searchForm={searchForm}
      toolbarLeft={toolbarLeft}
      toolbarRight={toolbarRight}
      loading={loading}
      rowKey="id"
      onChange={handleTableChange}
      onRefresh={() => fetchData({})}
      cardProps={{
        title: '高级表格',
      }}
      scroll={{ x: 1300 }}
    />
  );
};

export default AdvancedTable; 

export const routeConfig ={
    title: '高级表格',
    
    sort:2,
}