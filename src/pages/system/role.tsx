import React, { useState, useEffect } from 'react';
import { Button, Tag, Modal, Form, Input, Select, message, Space, Steps, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableColumnType } from '@/components/Table/types';
// import PermissionTree from '@/components/PermissionTree';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  type RoleType,
} from '@/services/role';
import { useStore } from '@/store';
import { CoRouteObject } from '@/types/route';
import type { Key } from 'antd/es/table/interface';

const steps = [
  {
    title: '基本信息',
    description: '设置角色的基本信息'
  },
  {
    title: '权限配置',
    description: '配置角色的权限'
  }
];

const RoleManagement: React.FC = () => {
  const { UserStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [dataSource, setDataSource] = useState<RoleType[]>([]);
  const [form] = Form.useForm();
  const [expandAll, setExpandAll] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const treeRef = React.useRef<any>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>([]);

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setDataSource(data || []);
    } catch (error: any) {
      message.error(error.message || '获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns: TableColumnType<RoleType>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setCurrentRole(null);
    setCurrentStep(0);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: RoleType) => {
    console.log('Edit record:', record);
    setCurrentRole(record);
    setCurrentStep(0);
    console.log('record.dynamicRoutesList',record.dynamicRoutesList)
    // if(record.dynamicRoutesList.includes('*')){
    //   // setCheckedKeys(record.dynamicRoutesList || []);
    //   setCheckAll(true);
    //   setCheckedKeys(allKeys);
    // }else{
      setCheckedKeys(record.dynamicRoutesList || []);
    // }
    form.setFieldsValue({
      ...record,
      dynamicRoutesList: record.dynamicRoutesList || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (record: RoleType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色"${record.name}"吗？`,
      onOk: async () => {
        try {
          await deleteRole(record.id);
          message.success('删除成功');
          fetchRoles();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // 验证并保存基本信息
        await form.validateFields(['name', 'code', 'status', 'description']);
        const basicInfo = form.getFieldsValue(['name', 'code', 'status', 'description']);
        console.log('Basic info saved:', basicInfo);
      } else {
        // 验证权限配置
        await form.validateFields(['dynamicRoutesList']);
        const permissionInfo = form.getFieldsValue(['dynamicRoutesList']);
        console.log('Permission info saved:', permissionInfo);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // 添加一理权限树选择的函数
  const processSelectedRoutes = (selectedKeys: (string | number)[], treeData: any[]): string[] => {
    // 如果全选了，直接返回 ['/']
    if (checkAll) {
      return ['/'];
    }

    const result = new Set<string>();
    const keyMap = new Map<string, any>();
    const childrenMap = new Map<string, Set<string>>();
    
    // 构建节点映射和父子关系
    const buildMaps = (nodes: any[], parentKey?: string) => {
      nodes.forEach(node => {
        keyMap.set(node.key, node);
        
        if (parentKey) {
          if (!childrenMap.has(parentKey)) {
            childrenMap.set(parentKey, new Set());
          }
          childrenMap.get(parentKey)?.add(node.key);
        }
        
        if (node.children) {
          buildMaps(node.children, node.key);
        }
      });
    };
    buildMaps(treeData);

    // 检查节点的所有子节点是否都被选中
    const areAllChildrenSelected = (nodeKey: string, selected: Set<string>): boolean => {
      const children = childrenMap.get(nodeKey);
      if (!children || children.size === 0) return true;
      
      return Array.from(children).every(childKey => 
        selected.has(childKey) && areAllChildrenSelected(childKey, selected)
      );
    };

    // 获取节点的所有子节点
    const getAllChildren = (nodeKey: string): string[] => {
      const children = childrenMap.get(nodeKey);
      if (!children) return [];
      
      const allChildren: string[] = [];
      children.forEach(childKey => {
        allChildren.push(childKey);
        allChildren.push(...getAllChildren(childKey));
      });
      return allChildren;
    };

    const selectedSet = new Set(selectedKeys.map(String));

    // 处理选中的节点
    Array.from(selectedSet).forEach(key => {
      const node = keyMap.get(key);
      if (!node) return;

      // 如果该节点的所有子节点都被选中
      if (childrenMap.has(key) && areAllChildrenSelected(key, selectedSet)) {
        // 只添加父节点
        result.add(key);
        
        // 从结果中移除所有子节点
        const children = getAllChildren(key);
        children.forEach(childKey => {
          selectedSet.delete(childKey);
        });
      } else if (!Array.from(result).some(parentKey => 
        childrenMap.get(parentKey)?.has(key)
      )) {
        // 如果不是某个已选父节点的子节点，则添加该节点
        result.add(key);
      }
    });

    return Array.from(result);
  };

  const handleModalOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue(true);
      
      // 处理选中的路由 这个方法待定吧，这里处理没问题但是处理路由的时候就麻烦太多了
      // const treeData = generatePermissionTree(UserStore.allRoutes);
      // const processedRoutes = processSelectedRoutes(checkedKeys as string[], treeData);
      
      const roleData = {
        name: values.name,
        code: values.code,
        description: values.description,
        status: values.status || 'active',
        dynamicRoutesList: checkAll ? ['/'] : values.dynamicRoutesList || []
      };

      if (currentRole) {
        await updateRole(currentRole.id, roleData);
      } else {
        await createRole(roleData);
      }
      setModalVisible(false);
      fetchRoles();
    } catch (error: any) {
      console.error('Submit error:', error);
      message.error(error.message || '操作失败');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="px-8">
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input placeholder="请输入角色名称" maxLength={30} showCount />
            </Form.Item>
            <Form.Item
              name="code"
              label="角色编码"
              rules={[{ required: true, message: '请输入角色编码' }]}
              extra="角色编码用于系统识别，建议使用英文和下划线"
            >
              <Input placeholder="请输入角色编码" maxLength={50} showCount />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea 
                placeholder="请输入角色描述" 
                maxLength={200} 
                showCount 
                rows={4}
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select>
                <Select.Option value="active">启用</Select.Option>
                <Select.Option value="inactive">禁用</Select.Option>
              </Select>
            </Form.Item>
          </div>
        );
      case 1:
        const treeData = generatePermissionTree(UserStore.allRoutes);
        const allKeys = getAllKeys(treeData);
        if(checkedKeys.includes('*')){
          setCheckAll(true);
          setCheckedKeys(allKeys);
        }
        return (
          <div className="px-4">
            <div className="mb-4 flex gap-2">
              <Button 
                size="small" 
                onClick={() => setExpandAll(!expandAll)}
              >
                {expandAll ? '全部折叠' : '全部展开'}
              </Button>
              <Button 
                size="small" 
                onClick={() => {
                  const newCheckAll = !checkAll;
                  setCheckAll(newCheckAll);
                  const newKeys = newCheckAll ? allKeys : [];
                  setCheckedKeys(newKeys);
                  form.setFieldsValue({ dynamicRoutesList: newKeys });
                }}
              >
                {checkAll ? '取消全选' : '全部选中'}
              </Button>
            </div>
            <Form.Item
              name="dynamicRoutesList"
              label="权限"
              rules={[{ required: true, message: '请选择权限' }]}
            >
              <Tree
                ref={treeRef}
                checkable
                checkedKeys={checkedKeys}
                expandedKeys={expandAll ? allKeys : expandedKeys}
                autoExpandParent={true}
                treeData={treeData}
                fieldNames={{
                  title: 'title',
                  key: 'key',
                  children: 'children'
                }}
                onExpand={(keys: Key[], info) => {
                  if (!expandAll) {
                    setExpandedKeys(keys.map(String));
                  }
                }}
                onCheck={(keys: any) => {
                  console.log('Tree onCheck keys:', keys);
                  setCheckedKeys(keys);
                  form.setFieldsValue({ dynamicRoutesList: keys });
                  setCheckAll(keys.length === allKeys.length);
                }}
              />
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  // 将路由转换为权限树数据
  interface TreeNode {
    title: string;
    key: string;
    children: TreeNode[] | undefined;
    disabled: boolean;
    selectable: boolean;
  }

  const generatePermissionTree = (routes: CoRouteObject[]): TreeNode[] => {
    // 第一层调用时查找根路由
    if (routes === UserStore.allRoutes) {
      const rootRoute = routes.find(route => route.root);
      if (!rootRoute || !rootRoute.children) return [];
      routes = rootRoute.children;
    }

    // 递归处理所有子路由，只返回有 path 的路由作为权限节点
    return routes.map(route => ({
      title: route.meta?.title || route.path || '未命名',
      key: route.path || '',
      children: route.children ? generatePermissionTree(route.children) : undefined,
      disabled: !route.path, // 没有 path 的节点不可选
      selectable: !!route.path
    })).filter((node): node is TreeNode => !!node.key);
  };

  const getAllKeys = (treeData: TreeNode[]): string[] => {
    const keys: string[] = [];
    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (!node.disabled) {
          keys.push(node.key);
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(treeData);
    return keys;
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        toolbarRight={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
        }
        cardProps={{
          title: '角色管理',
        }}
      />

      <Modal
        title={currentRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        width={650}
        styles={{
          body: {
            padding: '24px 0',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }
        }}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          currentStep > 0 && (
            <Button key="prev" onClick={handlePrev}>
              上一步
            </Button>
          ),
          currentStep < steps.length - 1 ? (
            <Button key="next" type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button key="submit" type="primary" onClick={handleModalOk}>
              确定
            </Button>
          ),
        ]}
      >
        <Steps
          current={currentStep}
          items={steps}
          className="px-8 mb-6"
        />
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', dynamicRoutesList: [] }}
        >
          {renderStepContent()}
        </Form>
      </Modal>
    </>
  );
};

export default RoleManagement;

export const routeConfig = {
  title: '角色管理',
  sort: 3,
  roles: ['admin'],
}; 