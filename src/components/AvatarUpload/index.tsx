import React, { useState, useRef } from 'react';
import { Modal, message, Avatar, Button } from 'antd';
import { UserOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { authService } from '@/services/auth';
import type { RcFile } from 'antd/es/upload/interface';

interface AvatarUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        message.error(t('profile.avatarSizeError'));
        return;
      }
      if (!file.type.startsWith('image/')) {
        message.error(t('profile.avatarTypeError'));
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPreviewUrl(reader.result?.toString() || '');
        setModalVisible(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerAspectCrop(width, height, 1);
    setCrop(crop);
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string
  ): Promise<File> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const file = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(file);
        },
        'image/jpeg',
        1
      );
    });
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop || !selectedFile) return;

    try {
      setLoading(true);
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        selectedFile.name
      );

      console.log('Uploading cropped file:', {
        name: croppedFile.name,
        type: croppedFile.type,
        size: croppedFile.size
      });

      const response = await authService.uploadAvatar(croppedFile);
      console.log('Upload response:', response);
      if (response.url) {
        onChange?.(response.url);
        message.success(t('profile.avatarUpdateSuccess'));
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      message.error(t('profile.avatarUpdateFailed'));
    } finally {
      setLoading(false);
      setModalVisible(false);
      setPreviewUrl('');
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setPreviewUrl('');
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative cursor-pointer group"
        onClick={() => inputRef.current?.click()}
      >
        <Avatar
          size={100}
          src={value}
          icon={<UserOutlined />}
          className="shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <UploadOutlined className="text-white text-xl" />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
      />

      <Modal
        title={t('profile.cropAvatar')}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            {t('common.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleCropComplete}
          >
            {t('common.confirm')}
          </Button>
        ]}
        width={520}
        destroyOnClose
      >
        {previewUrl && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            className="max-w-full"
          >
            <img
              ref={imgRef}
              src={previewUrl}
              alt="Crop preview"
              onLoad={onImageLoad}
              style={{ maxWidth: '100%' }}
            />
          </ReactCrop>
        )}
      </Modal>
    </div>
  );
};

export default AvatarUpload; 