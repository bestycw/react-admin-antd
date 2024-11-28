import React, { useState, useEffect } from 'react';
import {  Button, Modal, Form, Input, Select, DatePicker, Tag, Space, message } from 'antd';
import { PlusOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import Table from '@/components/Table';

dayjs.extend(relativeTime);

interface ApiToken {
  id: string;
  name: string;
  token: string;
  permissions: string[];
  expiresAt: string;
  lastUsed: string;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';
}

interface ApiTokenManagerProps {
  tokens: ApiToken[];
  onCreateToken: (values: any) => Promise<void>;
  onRevokeToken: (tokenId: string) => Promise<void>;
}

const ApiTokenManager: React.FC<ApiTokenManagerProps> = observer(({
  tokens,
  onCreateToken,
  onRevokeToken
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ConfigStore } = useStore();
  const isMobile = ConfigStore.isDrawerMode;


  const handleCreate = async (values: any) => {
    try {
      setLoading(true);
      await onCreateToken(values);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Token created successfully');
    } catch (error) {
      message.error('Failed to create token');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard');
  };

  const getColumns = () => {
    const baseColumns = [
      {
        title: t('profile.apiTokenSettings.name'),
        dataIndex: 'name',
        key: 'name',
        width: isMobile ? 120 : 'auto',
        ellipsis: true,
      },
      {
        title: t('profile.apiTokenSettings.token'),
        dataIndex: 'token',
        key: 'token',
        width: isMobile ? 150 : 'auto',
        render: (token: string) => (
          <Space>
            <span className="font-mono text-xs">
              {token.substring(0, 8)}...{token.substring(token.length - 8)}
            </span>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(token)}
            />
          </Space>
        ),
      },
      {
        title: t('profile.apiTokenSettings.status'),
        dataIndex: 'status',
        key: 'status',
        width: isMobile ? 100 : 'auto',
        render: (status: string) => {
          const colors = {
            active: 'green',
            expired: 'orange',
            revoked: 'red',
          };
          return (
            <Tag color={colors[status as keyof typeof colors]}>
              {t(`profile.apiTokenSettings.${status}`)}
            </Tag>
          );
        },
      }
    ];

    const desktopColumns = [
      ...baseColumns,
      {
        title: t('profile.apiTokenSettings.permissions'),
        dataIndex: 'permissions',
        key: 'permissions',
        render: (permissions: string[]) => (
          <Space wrap>
            {permissions.map(perm => (
              <Tag key={perm} color="blue">{perm}</Tag>
            ))}
          </Space>
        ),
      },
      {
        title: t('profile.apiTokenSettings.lastUsed'),
        dataIndex: 'lastUsed',
        key: 'lastUsed',
        render: (date: string) => dayjs(date).fromNow(),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 100,
        render: (_: any, record: ApiToken) => (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRevokeToken(record.id)}
            disabled={record.status !== 'active'}
          >
            {/* {!isMobile && 'Revoke'} */}
          </Button>
        ),
      }
    ];

    return isMobile ? baseColumns : desktopColumns;
  };

  const expandedRowRender = (record: ApiToken) => {
    if (!isMobile) return null;

    return (
      <div className="space-y-2 p-4">
        <div>
          <div className="text-sm font-medium mb-1">Permissions:</div>
          <Space wrap>
            {record.permissions.map(perm => (
              <Tag key={perm} color="blue">{perm}</Tag>
            ))}
          </Space>
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Last Used:</div>
          <span className="text-gray-600">{dayjs(record.lastUsed).fromNow()}</span>
        </div>
        <div className="pt-2">
          <Button
            type="primary"
            danger
            onClick={() => onRevokeToken(record.id)}
            disabled={record.status !== 'active'}
          >
            Revoke Access
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          {t('profile.apiTokenSettings.create')}
        </Button>
      </div>

      <Table<ApiToken>
        dataSource={tokens}
        columns={getColumns()}
        pagination={false}
        // scroll={{ x: isMobile ? 400 : true }}
        expandable={isMobile ? {
          expandedRowRender: (record: ApiToken) => expandedRowRender(record),
          expandRowByClick: true
        } : undefined}
      />

      <Modal
        title={t('profile.apiTokenSettings.create')}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={isMobile ? '100%' : 520}
        style={isMobile ? { top: 0, margin: 0, maxWidth: '100%', paddingBottom: 0 } : undefined}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label={t('profile.apiTokenSettings.name')}
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="permissions"
            label={t('profile.apiTokenSettings.permissions')}
            rules={[{ required: true, message: 'Please select permissions' }]}
          >
            <Select
              mode="multiple"
              options={[
                { label: 'Read', value: 'read' },
                { label: 'Write', value: 'write' },
                { label: 'Delete', value: 'delete' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="expiresAt"
            label={t('profile.apiTokenSettings.expiresAt')}
            rules={[{ required: true, message: 'Please select expiry date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default ApiTokenManager; 