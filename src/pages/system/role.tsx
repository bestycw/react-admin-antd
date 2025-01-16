import React, { useState, useEffect } from 'react';
import { Button, Tag, Modal, Form, Input, Select, message, Space, Steps, Tree, Checkbox } from 'antd';
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
import './role.scss'; // 引入自定义样式

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
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [nodePermissions, setNodePermissions] = useState<Record<string, string[]>>({});

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
    setCurrentRole(record);
    setCurrentStep(0);
    
    // 检查是否是全选状态（dynamicRoutesList 为 ['/']）
    const isAllSelected = record.dynamicRoutesList?.length === 1 && record.dynamicRoutesList[0] === '/';
    
    if (isAllSelected) {
      // 如果是全选状态，设置所有路由为选中
      const treeData = generatePermissionTree(UserStore.allRoutes);
      const allKeys = getAllKeys(treeData);
      setCheckedKeys(allKeys);
      setCheckAll(true);
    } else {
      // 否则使用原有的路由列表
      setCheckedKeys(record.dynamicRoutesList || []);
      setCheckAll(false);
    }
    
    setNodePermissions(record.permissions || {});
    form.setFieldsValue({
      ...record,
      dynamicRoutesList: isAllSelected ? getAllKeys(generatePermissionTree(UserStore.allRoutes)) : (record.dynamicRoutesList || [])
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
      
      // 只保存有特殊权限控制的路由
      const permissions = Object.entries(nodePermissions)
        .reduce((acc, [routePath, codes]) => {
          // 跳过无效的路由路径
          if (!routePath || routePath === '0') return acc;
          
          // 确保codes是数组
          const codeArray = Array.isArray(codes) ? codes : [];
          
          const customCodes = codeArray.filter(code => 
            !['read', 'create', 'update', 'delete'].includes(code)
          );
          const hasAllBasicOps = ['read', 'create', 'update', 'delete']
            .every(op => codeArray.includes(op));
          
          // 只有当有自定义codes或基础操作权限不完整时，才保存该路由的权限
          if (customCodes.length > 0 || !hasAllBasicOps) {
            acc[routePath] = codeArray;
          }
          return acc;
        }, {} as Record<string, string[]>);

      const roleData = {
        ...values,
        dynamicRoutesList: checkAll ? ['/'] : values.dynamicRoutesList || [],
        permissions: Object.keys(permissions).length > 0 ? permissions : undefined
      };

      if (currentRole) {
        await updateRole(currentRole.id, roleData);
      } else {
        await createRole(roleData);
      }
      
      message.success(currentRole ? '更新成功' : '创建成功');
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
        if (checkedKeys.includes('*')) {
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
            <div className="permission-tree-container">
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
                    const newCheckedKeys = Array.isArray(keys) ? keys : keys.checked;
                    
                    // 如果之前是全选状态，现在取消某个节点
                    if (checkAll && newCheckedKeys.length < allKeys.length) {
                      // 获取所有未选中的键
                      const uncheckedKeys = allKeys.filter(key => !newCheckedKeys.includes(key));
                      console.log('Unchecked keys:', uncheckedKeys);
                      
                      // 设置为非全选状态，但保持其他节点的选中状态
                      setCheckAll(false);
                      setCheckedKeys(newCheckedKeys);
                      form.setFieldsValue({ dynamicRoutesList: newCheckedKeys });
                      
                      // 移除未选中节点的权限
                      setNodePermissions(prevState => {
                        const newState = { ...prevState };
                        uncheckedKeys.forEach(path => {
                          delete newState[path];
                        });
                        return newState;
                      });
                    } else {
                      // 正常的选中/取消选中处理
                      setCheckedKeys(newCheckedKeys);
                      form.setFieldsValue({ dynamicRoutesList: newCheckedKeys });
                      setCheckAll(newCheckedKeys.length === allKeys.length);

                      // 找出新增的选中项
                      const addedKeys = newCheckedKeys.filter((key: string) => !checkedKeys.includes(key));
                      
                      // 为新选中的路由添加所有基础操作权限
                      if (addedKeys.length > 0) {
                        setNodePermissions(prevState => {
                          const newState = { ...prevState };
                          addedKeys.forEach((path: string) => {
                            if (!newState[path]) {
                              newState[path] = ['read', 'create', 'update', 'delete'];
                            }
                          });
                          return newState;
                        });
                      }
                    }
                  }}
                  // selectedKeys={selectedKeys}
                  // onSelect={(keys: Key[]) => {
                  //   setSelectedKeys(keys);
                  // }}
                />
              </Form.Item>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 将路由转换为权限树数据
  type TreeNodeType = {
    title: JSX.Element;
    key: string;
    children: TreeNodeType[] | undefined;
    disabled: boolean;
    selectable: boolean;
  }

  const generatePermissionTree = (routes: CoRouteObject[]): TreeNodeType[] => {
    if (routes === UserStore.allRoutes) {
      const rootRoute = routes.find(route => route.root);
      if (!rootRoute || !rootRoute.children) return [];
      routes = rootRoute.children;
    }

    return routes.map(route => {
      const path = route.path || '';
      if (!path) return null;

      const isLeaf = !route.children || route.children.length === 0;
      const isSelected = checkedKeys.includes(path);
      
      return {
        title: (
          <div className="permission-node-container">
            <span className="node-title">{route.meta?.title || path || '未命名'}</span>
            {isLeaf && isSelected && (
              <div className="permission-buttons">
                <Input 
                  size="small" 
                  style={{ width: 120 }} 
                  placeholder="输入Code，逗号分割"
                  defaultValue={nodePermissions[path]?.filter(code => 
                    !['read', 'create', 'update', 'delete'].includes(code)
                  ).join(',')}
                  onBlur={(e) => {
                    const customCodes = e.target.value
                      .split(/[,，]/)
                      .map(code => code.trim())
                      .filter(Boolean);
                    
                    // 如果没有自定义codes且没有基础操作权限，则不需要在permissions中保存
                    if (customCodes.length === 0 && 
                        (!nodePermissions[path] || 
                         nodePermissions[path].every(code => 
                           ['read', 'create', 'update', 'delete'].includes(code)
                         ))
                    ) {
                      const newPermissions = { ...nodePermissions };
                      delete newPermissions[path];
                      setNodePermissions(newPermissions);
                    } else {
                      const basicOps = nodePermissions[path]?.filter(code => 
                        ['read', 'create', 'update', 'delete'].includes(code)
                      ) || [];

                      setNodePermissions(prevState => ({
                        ...prevState,
                        [path]: [...basicOps, ...customCodes]
                      }));
                    }
                  }}
                />
                <div className="button-group">
                  {[
                    { key: 'read', label: '查' },
                    { key: 'create', label: '增' },
                    { key: 'update', label: '改' },
                    { key: 'delete', label: '删' }
                  ].map(({ key, label }) => (
                    <Checkbox 
                      key={key}
                      checked={!nodePermissions[path] || nodePermissions[path]?.includes(key)}
                      onChange={(e) => {
                        const currentCodes = nodePermissions[path] || [];
                        let newCodes;
                        
                        if (e.target.checked) {
                          newCodes = [...currentCodes, key];
                        } else {
                          newCodes = currentCodes.filter(code => code !== key);
                        }

                        // 如果所有基础操作都选中且没有自定义codes，则从permissions中移除该路由
                        const hasAllBasicOps = ['read', 'create', 'update', 'delete']
                          .every(op => newCodes.includes(op));
                        const hasCustomCodes = newCodes.some(code => 
                          !['read', 'create', 'update', 'delete'].includes(code)
                        );

                        if (hasAllBasicOps && !hasCustomCodes) {
                          const newPermissions = { ...nodePermissions };
                          delete newPermissions[path];
                          setNodePermissions(newPermissions);
                        } else {
                          setNodePermissions(prevState => ({
                            ...prevState,
                            [path]: newCodes
                          }));
                        }
                      }}
                    >
                      {label}
                    </Checkbox>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
        key: path,
        children: route.children ? generatePermissionTree(route.children) : undefined,
        disabled: !path,
        selectable: !!path
      };
    }).filter((node): node is TreeNodeType => !!node?.key);
  };

  const getAllKeys = (treeData: TreeNodeType[]): string[] => {
    const keys: string[] = [];
    const traverse = (nodes: TreeNodeType[]) => {
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
  title: 'route.system.role',
  sort: 3,
  roles: ['admin'],
}; 