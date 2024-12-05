import React, { useState, useEffect } from 'react';
import { QRCode, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ReloadOutlined } from '@ant-design/icons';

const QrCodeLogin: React.FC = () => {
  const { t } = useTranslation();
  const [qrValue, setQrValue] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  
  // 生成随机的二维码值
  const generateQrValue = () => {
    const timestamp = new Date().getTime();
    return `https://github.com/bestycw/react-admin-antd?login=true&timestamp=${timestamp}`;
  };

  // 刷新二维码
  const refreshQrCode = () => {
    setQrValue(generateQrValue());
    setIsExpired(false);
    message.success('二维码已刷新');
    startExpireTimer();
  };

  // 设置二维码过期定时器
  const startExpireTimer = () => {
    setTimeout(() => {
      setIsExpired(true);
    }, 5 * 60 * 1000); // 5分钟后过期
  };

  // 初始化二维码
  useEffect(() => {
    refreshQrCode();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <div className="relative">
        {isExpired ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg">
            <span className="text-white mb-2">二维码已过期</span>
            <button
              onClick={refreshQrCode}
              className="flex items-center space-x-1 px-3 py-1 bg-white/90 rounded-full text-sm hover:bg-white"
            >
              <ReloadOutlined />
              <span>刷新</span>
            </button>
          </div>
        ) : null}
        <QRCode
          value={qrValue}
          size={200}
          style={{ margin: '0 auto' }}
          errorLevel="H"
          bordered={false}
          icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
      </div>
      <div className="text-center space-y-2">
        <p className="text-gray-600">{t('login.scanQrcode')}</p>
        {/* <p className="text-gray-400 text-sm">使用手机扫码登录，更快更安全</p> */}
      </div>
    </div>
  );
};

export default QrCodeLogin; 