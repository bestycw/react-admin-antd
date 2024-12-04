import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Modal, Button, Slider } from 'antd';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  src?: string;
  visible: boolean;
  aspectRatio?: number;
  onCancel: () => void;
  onOk: (croppedImage: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  visible,
  aspectRatio,
  onCancel,
  onOk,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const getCroppedImg = async (
    image: HTMLImageElement,
    pixelCrop: PixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(pixelCrop.width * scaleX);
    canvas.height = Math.floor(pixelCrop.height * scaleY);

    ctx.save();

    // 移动画布原点到中心以便旋转
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // 绘制裁剪的图像
    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  const handleComplete = async () => {
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      try {
        const croppedImage = await getCroppedImg(
          imageRef.current,
          completedCrop,
          rotate
        );
        onOk(croppedImage);
      } catch (e) {
        console.error('Error cropping image:', e);
      }
    }
  };

  return (
    <Modal
      title="图片裁剪"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleComplete}>
          确定
        </Button>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            className="max-h-[500px]"
          >
            <img
              ref={imageRef}
              src={src}
              alt="Crop"
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxHeight: '500px',
                width: 'auto',
              }}
            />
          </ReactCrop>
        </div>

        <div className="flex gap-8 items-center">
          <div className="flex-1">
            <div className="mb-2">缩放</div>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={scale}
              onChange={setScale}
              tooltip={{ formatter: (value) => `${value}x` }}
            />
          </div>
          <div className="flex-1">
            <div className="mb-2">旋转</div>
            <Slider
              min={0}
              max={360}
              value={rotate}
              onChange={setRotate}
              tooltip={{ formatter: (value) => `${value}°` }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropper; 