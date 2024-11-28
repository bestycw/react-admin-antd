import React from 'react';
import { useTranslation } from 'react-i18next';

const QrCodeLogin: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="qrcode-container">
      <div className="qrcode-wrapper">
        <div className="qrcode-content">
          {/* QR Code content */}
        </div>
      </div>
      <div className="qrcode-tip">
        {t('login.scanQrcode')}
      </div>
    </div>
  );
};

export default QrCodeLogin; 