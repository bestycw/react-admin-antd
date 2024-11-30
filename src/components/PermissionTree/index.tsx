import React from 'react';
import { Card, Input, Collapse, Checkbox, Space, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface Permission {
  title: string;
  key: string;
  actions: string[];
}

interface ModulePermission {
  title: string;
  key: string;
  permissions: Permission[];
}

// 预定义的权限模块
const permissionModules: ModulePermission[] = [
  {
    title: '系统管理',
    key: 'system',
    permissions: [
      {
        title: '用户管理',
        key: 'system:user',
        actions: ['view', 'create', 'edit', 'delete']
      },
      {
        title: '角色管理',
        key: 'system:role',
        actions: ['view', 'create', 'edit', 'delete']
      }
    ]
  },
  // 可以添加更多模块
];

interface PermissionTreeProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

const PermissionTree: React.FC<PermissionTreeProps> = ({ 
  value = [], 
  onChange,
  className 
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedAll, setSelectedAll] = React.useState<Record<string, boolean>>({});

  // 处理模块全选
  const handleModuleCheckAll = (moduleKey: string, checked: boolean) => {
    const module = permissionModules.find(m => m.key === moduleKey);
    if (!module) return;

    const newPermissions = [...value];
    module.permissions.forEach(permission => {
      permission.actions.forEach(action => {
        const permKey = `${permission.key}:${action}`;
        if (checked && !newPermissions.includes(permKey)) {
          newPermissions.push(permKey);
        } else if (!checked) {
          const index = newPermissions.indexOf(permKey);
          if (index > -1) {
            newPermissions.splice(index, 1);
          }
        }
      });
    });

    setSelectedAll({ ...selectedAll, [moduleKey]: checked });
    onChange?.(newPermissions);
  };

  // 处理单个权限选择
  const handlePermissionCheck = (
    permissionKey: string,
    action: string,
    e: CheckboxChangeEvent
  ) => {
    const permKey = `${permissionKey}:${action}`;
    const newPermissions = e.target.checked
      ? [...value, permKey]
      : value.filter(key => key !== permKey);
    
    onChange?.(newPermissions);
  };

  // 检查模块是否全选
  const isModuleChecked = (moduleKey: string) => {
    const module = permissionModules.find(m => m.key === moduleKey);
    if (!module) return false;

    return module.permissions.every(permission =>
      permission.actions.every(action =>
        value.includes(`${permission.key}:${action}`)
      )
    );
  };

  // 检查模块是否部分选中
  const isModuleIndeterminate = (moduleKey: string) => {
    const module = permissionModules.find(m => m.key === moduleKey);
    if (!module) return false;

    const checkedCount = module.permissions.reduce((acc, permission) =>
      acc + permission.actions.filter(action =>
        value.includes(`${permission.key}:${action}`)
      ).length,
      0
    );

    const totalCount = module.permissions.reduce((acc, permission) =>
      acc + permission.actions.length,
      0
    );

    return checkedCount > 0 && checkedCount < totalCount;
  };

  // 过滤搜索结果
  const filteredModules = permissionModules.filter(module =>
    module.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    module.permissions.some(permission =>
      permission.title.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const actionLabels: Record<string, string> = {
    view: '查看',
    create: '新增',
    edit: '编辑',
    delete: '删除'
  };

  return (
    <Card 
      className={className}
      bodyStyle={{ padding: 0 }}
      bordered={false}
    >
      <div className="p-4 border-b bg-gray-50">
        <Input
          placeholder="搜索权限"
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={e => setSearchValue(e.target.value)}
          allowClear
        />
      </div>
      <div className="max-h-[400px] overflow-auto px-2">
        <Collapse 
          defaultActiveKey={permissionModules.map(m => m.key)}
          ghost
          className="bg-white"
        >
          {filteredModules.map(module => (
            <Collapse.Panel
              key={module.key}
              header={
                <div className="flex items-center">
                  <Checkbox
                    checked={isModuleChecked(module.key)}
                    indeterminate={isModuleIndeterminate(module.key)}
                    onChange={e => handleModuleCheckAll(module.key, e.target.checked)}
                    onClick={e => e.stopPropagation()}
                  >
                    <span className="font-medium">{module.title}</span>
                  </Checkbox>
                </div>
              }
            >
              <div className="pl-6">
                {module.permissions.map(permission => (
                  <div key={permission.key} className="mb-4 last:mb-0">
                    <div className="text-gray-600 mb-2">{permission.title}</div>
                    <Space size="middle" wrap>
                      {permission.actions.map(action => (
                        <Checkbox
                          key={action}
                          checked={value.includes(`${permission.key}:${action}`)}
                          onChange={e => handlePermissionCheck(permission.key, action, e)}
                        >
                          {actionLabels[action]}
                        </Checkbox>
                      ))}
                    </Space>
                  </div>
                ))}
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </Card>
  );
};

export default PermissionTree; 