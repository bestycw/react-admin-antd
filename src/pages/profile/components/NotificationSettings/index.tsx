import React from 'react';
import { List, Switch, Radio, Space, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  BellOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { NotificationSetting } from '@/types/notification';

interface NotificationChannel {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface NotificationSettingsProps {
  settings: NotificationSetting[];
  onSettingChange: (type: string, channel: string, value: boolean) => void;
  notificationMode: 'all' | 'important' | 'none';
  onModeChange: (mode: 'all' | 'important' | 'none') => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSettingChange,
  notificationMode,
  onModeChange
}) => {
  const { t } = useTranslation();

  const channels: NotificationChannel[] = [
    {
      key: 'email',
      label: 'Email',
      description: 'Receive notifications via email',
      icon: <GlobalOutlined />
    },
    {
      key: 'browser',
      label: 'Browser',
      description: 'Show browser notifications',
      icon: <NotificationOutlined />
    },
    {
      key: 'mobile',
      label: 'Mobile',
      description: 'Send push notifications to mobile',
      icon: <BellOutlined />
    }
  ];

  const notificationTypes = [
    {
      type: 'system',
      label: t('profile.notificationTypes.system'),
      icon: <GlobalOutlined />,
      description: 'System updates and maintenance notifications'
    },
    {
      type: 'security',
      label: t('profile.notificationTypes.security'),
      icon: <SecurityScanOutlined />,
      description: 'Security alerts and suspicious activity'
    },
    {
      type: 'activity',
      label: t('profile.notificationTypes.activity'),
      icon: <BellOutlined />,
      description: 'Account activity and changes'
    }
  ];

  return (
    <div className="space-y-6">
      <Card title="Notification Mode" className="shadow-sm">
        <Radio.Group
          value={notificationMode}
          onChange={(e) => onModeChange(e.target.value)}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            <Radio value="all" className="w-full py-2">
              <div>
                <div className="font-medium">Receive all notifications</div>
                <div className="text-sm text-gray-500">
                  Get notified about all activities
                </div>
              </div>
            </Radio>
            <Radio value="important" className="w-full py-2">
              <div>
                <div className="font-medium">Important only</div>
                <div className="text-sm text-gray-500">
                  Only receive notifications about important activities
                </div>
              </div>
            </Radio>
            <Radio value="none" className="w-full py-2">
              <div>
                <div className="font-medium">Do not disturb</div>
                <div className="text-sm text-gray-500">
                  Turn off all notifications
                </div>
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </Card>

      <Card title="Notification Channels" className="shadow-sm">
        <List
          itemLayout="horizontal"
          dataSource={channels}
          renderItem={(channel) => (
            <List.Item
              actions={[
                <Switch
                  checked={settings.every(s => s[channel.key as keyof NotificationSetting])}
                  onChange={(checked) => {
                    settings.forEach(s => {
                      onSettingChange(s.type, channel.key, checked);
                    });
                  }}
                />
              ]}
            >
              <List.Item.Meta
                avatar={channel.icon}
                title={channel.label}
                description={channel.description}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Notification Types" className="shadow-sm">
        <List
          itemLayout="horizontal"
          dataSource={notificationTypes}
          renderItem={(item) => {
            const setting = settings.find(s => s.type === item.type);
            if (!setting) return null;

            return (
              <List.Item>
                <List.Item.Meta
                  avatar={item.icon}
                  title={item.label}
                  description={item.description}
                />
                <div className="flex gap-4">
                  {channels.map(channel => (
                    <div key={channel.key} className="flex items-center gap-2">
                      {channel.icon}
                      <Switch
                        size="small"
                        checked={setting[channel.key as keyof NotificationSetting]}
                        onChange={(checked) => onSettingChange(item.type, channel.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default NotificationSettings; 