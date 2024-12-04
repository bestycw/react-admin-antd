import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Radio } from 'antd';
import { getRoles, type RoleType } from '@/services/role';

interface UserFormProps {
  initialValues?: any;
}

const UserForm: React.FC<UserFormProps> = ({ initialValues }) => {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        tooltip="不填写将使用默认密码：123456"
      >
        <Input.Password placeholder="请输入密码，不填则使用默认密码" />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { type: 'email', message: '请输入正确的邮箱格式' }
        ]}
      >
        <Input placeholder="请输入邮箱（选填）" />
      </Form.Item>

      <Form.Item
        name="roles"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select
          mode="multiple"
          placeholder="请选择角色"
          loading={loading}
          options={roles.map(role => ({
            label: role.name,
            value: role.code,
            disabled: role.status === 'inactive'
          }))}
        />
      </Form.Item>

      <Form.Item
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Radio.Group>
          <Radio value="active">启用</Radio>
          <Radio value="inactive">禁用</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
};

export default UserForm; 