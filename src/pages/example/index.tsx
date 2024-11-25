import React, { useState } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import ImageCropper from '@/components/ImageCropper';

const ExamplePage: React.FC = () => {
  const [cropVisible, setCropVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [croppedImage, setCroppedImage] = useState<string>();

  const handleUpload = (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    setCropVisible(true);
    return false; // 阻止自动上传
  };

  const handleCropComplete = (result: string) => {
    setCroppedImage(result);
    setCropVisible(false);
    message.success('裁剪成功！');
  };

  return (
    <div className="p-6">
      <div className="flex gap-4">
        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>选择图片</Button>
        </Upload>
        {croppedImage && (
          <div className="mt-4">
            <h3>裁剪结果：</h3>
            <img src={croppedImage} alt="Cropped" className="max-w-md" />
          </div>
        )}
      </div>

      <ImageCropper
        visible={cropVisible}
        src={imageUrl}
        aspectRatio={1} // 可选，设置裁剪比例
        onCancel={() => setCropVisible(false)}
        onOk={handleCropComplete}
      />
    </div>
  );
};

export default ExamplePage; 