import React from 'react';
import { List, Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ChromeOutlined,
  CompassOutlined,
  IeOutlined,
  GlobalOutlined,
  WindowsOutlined,
  AppleOutlined,
  AndroidOutlined,
  DisconnectOutlined
} from '@ant-design/icons';

interface Device {
  id: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const getBrowserIcon = (browser: string) => {
  switch (browser.toLowerCase()) {
    case 'chrome':
      return <ChromeOutlined />;
    case 'safari':
      return <CompassOutlined />;
    case 'firefox':
      return <GlobalOutlined />;
    case 'ie':
      return <IeOutlined />;
    default:
      return <GlobalOutlined />;
  }
};

const getOSIcon = (os: string) => {
  switch (os.toLowerCase()) {
    case 'windows':
      return <WindowsOutlined />;
    case 'macos':
      return <AppleOutlined />;
    case 'android':
      return <AndroidOutlined />;
    case 'ios':
      return <AppleOutlined />;
    default:
      return <GlobalOutlined />;
  }
};

interface DeviceManagerProps {
  devices: Device[];
  onRevokeAccess: (deviceId: string) => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({
  devices,
  onRevokeAccess
}) => {
  const { t } = useTranslation();

  return (
    <List
      className="device-list"
      itemLayout="horizontal"
      dataSource={devices}
      renderItem={(device) => (
        <List.Item
          actions={[
            device.current ? (
              <Tag color="green">{t('profile.deviceInfo.current')}</Tag>
            ) : (
              <Popconfirm
                title={t('profile.deviceInfo.revokeConfirm')}
                onConfirm={() => onRevokeAccess(device.id)}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Button
                  type="text"
                  danger
                  icon={<DisconnectOutlined />}
                >
                  {t('profile.deviceInfo.revokeAccess')}
                </Button>
              </Popconfirm>
            )
          ]}
        >
          <List.Item.Meta
            avatar={
              <div className="flex space-x-2">
                <Tooltip title={device.browser}>
                  {getBrowserIcon(device.browser)}
                </Tooltip>
                <Tooltip title={device.os}>
                  {getOSIcon(device.os)}
                </Tooltip>
              </div>
            }
            title={
              <div className="flex items-center space-x-2">
                <span>{device.browser} on {device.os}</span>
                {device.current && (
                  <Tag color="green" className="ml-2">
                    {t('profile.deviceInfo.current')}
                  </Tag>
                )}
              </div>
            }
            description={
              <div className="text-sm text-gray-500 space-y-1">
                <div>
                  <span className="font-medium">IP:</span> {device.ip}
                </div>
                <div>
                  <span className="font-medium">{t('profile.deviceInfo.location')}:</span> {device.location}
                </div>
                <div>
                  <span className="font-medium">{t('profile.deviceInfo.lastActive')}:</span> {device.lastActive}
                </div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default DeviceManager; 