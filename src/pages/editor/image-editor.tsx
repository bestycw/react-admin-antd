import React, { useState } from 'react';
import { Card, Upload, Button, Slider, message, Select, Tabs, Radio, Tooltip } from 'antd';
import {
  PictureOutlined,
  UploadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  UndoOutlined,
  DownloadOutlined,
  ScissorOutlined,
  HighlightOutlined,
  CompressOutlined,
  BorderOuterOutlined
} from '@ant-design/icons';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// const { TabPane } = Tabs;

// 预设裁剪比例
const CROP_ASPECTS = [
  { label: '自由裁剪', value: undefined },
  { label: '1:1 (正方形)', value: 1 },
  { label: '4:3 (通用)', value: 4/3 },
  { label: '16:9 (宽屏)', value: 16/9 },
  { label: '3:4 (竖屏)', value: 3/4 },
  { label: '2:3 (证件照)', value: 2/3 },
  { label: '9:16 (手机屏幕)', value: 9/16 },
];

// 滤镜预设
const FILTERS = [
  { label: '原图', value: 'none' },
  { label: '黑白', value: 'grayscale' },
  { label: '复古', value: 'sepia' },
  { label: '锐化', value: 'sharpen' },
  { label: '模糊', value: 'blur' },
  { label: '暖色', value: 'warm' },
  { label: '冷色', value: 'cool' },
];

const ImageEditor: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [croppedImage, setCroppedImage] = useState<string>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [quality, setQuality] = useState(90);
  const [isCircular, setIsCircular] = useState(false);

  const handleUpload = (file: File) => {
    // 验证文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 验证文件大小（小于 5MB）
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片必须小于 5MB！');
      return false;
    }

    setImageUrl(URL.createObjectURL(file));
    // 重置编辑状态
    setScale(1);
    setRotate(0);
    setCroppedImage(undefined);
    return false;
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    pixelCrop: PixelCrop,
    rotation = 0,
    scale = 1
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
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

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

  const handleCrop = async () => {
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      try {
        const croppedImg = await getCroppedImg(
          imageRef.current,
          completedCrop,
          rotate,
          scale
        );
        setCroppedImage(croppedImg);
        message.success('裁剪成功！');
      } catch (e) {
        console.error('Error cropping image:', e);
        message.error('裁剪失败，请重试！');
      }
    }
  };

  const handleDownload = () => {
    if (croppedImage) {
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = '裁剪后的图片.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setScale(1);
    setRotate(0);
    setCroppedImage(undefined);
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    });
  };

  // 获取当前的滤镜样式
  const getFilterStyle = () => {
    let style = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    switch (filter) {
      case 'grayscale':
        style += ' grayscale(100%)';
        break;
      case 'sepia':
        style += ' sepia(100%)';
        break;
      case 'sharpen':
        style += ' contrast(150%) brightness(95%)';
        break;
      case 'blur':
        style += ' blur(2px)';
        break;
      case 'warm':
        style += ' sepia(30%)';
        break;
      case 'cool':
        style += ' hue-rotate(180deg)';
        break;
    }
    return style;
  };

  // Define tabs items configuration
  const tabItems = [
    {
      key: 'crop',
      label: <Tooltip title="裁剪"><ScissorOutlined /></Tooltip>,
      children: (
        <div className="flex flex-col gap-3">
          <Select
            placeholder="裁剪比例"
            options={CROP_ASPECTS}
            value={aspect}
            onChange={setAspect}
          />
          {aspect === 1 && (
            <Radio.Group 
              value={isCircular} 
              onChange={e => setIsCircular(e.target.value)}
            >
              <Radio value={false}>矩形</Radio>
              <Radio value={true}>圆形</Radio>
            </Radio.Group>
          )}
        </div>
      )
    },
    {
      key: 'adjust',
      label: <Tooltip title="调整"><HighlightOutlined /></Tooltip>,
      children: (
        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1 text-sm">亮度</div>
            <Slider
              min={0}
              max={200}
              value={brightness}
              onChange={setBrightness}
            />
          </div>
          <div>
            <div className="mb-1 text-sm">对比度</div>
            <Slider
              min={0}
              max={200}
              value={contrast}
              onChange={setContrast}
            />
          </div>
          <div>
            <div className="mb-1 text-sm">饱和度</div>
            <Slider
              min={0}
              max={200}
              value={saturation}
              onChange={setSaturation}
            />
          </div>
        </div>
      )
    },
    {
      key: 'filter',
      label: <Tooltip title="滤镜"><BorderOuterOutlined /></Tooltip>,
      children: (
        <Radio.Group 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          className="flex flex-col gap-2"
        >
          {FILTERS.map(f => (
            <Radio key={f.value} value={f.value}>
              {f.label}
            </Radio>
          ))}
        </Radio.Group>
      )
    },
    {
      key: 'export',
      label: <Tooltip title="导出"><CompressOutlined /></Tooltip>,
      children: (
        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1 text-sm">质量</div>
            <Slider
              min={10}
              max={100}
              value={quality}
              onChange={setQuality}
              marks={{
                10: '低',
                50: '中',
                100: '高'
              }}
            />
          </div>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            下载
          </Button>
        </div>
      )
    }
  ];

  return (
    <div >
      <Card title="图片编辑器" className="shadow-md">
        <div className="flex gap-6">
          {/* 左侧工具面板 */}
          <div className="w-64 flex flex-col gap-4 border-r pr-4">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleUpload}
            >
              <Button icon={<UploadOutlined />} block>
                选择图片
              </Button>
            </Upload>

            {imageUrl && (
              <Tabs defaultActiveKey="crop" items={tabItems} />
            )}
          </div>

          {/* 中间编辑区域 */}
          <div className="flex-1 flex flex-col">
            <div className="h-[600px] flex gap-6">
              {/* 编辑区域 - 固定大小 */}
              <div className="flex-1 flex flex-col">
                <div className="text-gray-500 mb-2">编辑区域</div>
                <div className="flex-1 border rounded-lg bg-gray-50 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center relative">
                    {imageUrl ? (
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        circularCrop={isCircular}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          ref={imageRef}
                          src={imageUrl}
                          alt="编辑"
                          className="max-w-full max-h-full object-contain"
                          style={{
                            transform: `scale(${scale}) rotate(${rotate}deg)`,
                            filter: getFilterStyle(),
                          }}
                        />
                      </ReactCrop>
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <PictureOutlined style={{ fontSize: '48px' }} />
                        <span>请选择图片</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 实时预览区域 - 固定大小 */}
              <div className="w-80 flex flex-col">
                <div className="text-gray-500 mb-2">实时预览</div>
                <div className="flex-1 border rounded-lg bg-gray-50 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="预览"
                        className="max-w-full max-h-full object-contain"
                        style={{
                          transform: `scale(${scale}) rotate(${rotate}deg)`,
                          filter: getFilterStyle(),
                        }}
                      />
                    )}
                  </div>
                </div>
                {croppedImage && (
                  <>
                    <div className="text-gray-500 mt-4 mb-2">裁剪结果</div>
                    <div className="h-48 border rounded-lg bg-gray-50 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={croppedImage}
                          alt="裁剪结果"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 底部工具栏 */}
            {imageUrl && (
              <div className="mt-4 pt-4 border-t flex items-center gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <Button 
                    icon={<RotateLeftOutlined />}
                    onClick={() => setRotate(r => r - 90)}
                  />
                  <Slider
                    className="flex-1"
                    min={0}
                    max={360}
                    value={rotate}
                    onChange={setRotate}
                    tooltip={{ formatter: value => `${value}°` }}
                  />
                  <Button 
                    icon={<RotateRightOutlined />}
                    onClick={() => setRotate(r => r + 90)}
                  />
                </div>
                <div className="w-px h-6 bg-gray-200" />
                <Button 
                  icon={<UndoOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
                <Button 
                  type="primary"
                  onClick={handleCrop}
                >
                  应用修改
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageEditor;

export const routeConfig = {
  title: 'route.editor.image',
  icon: <PictureOutlined />,
  layout: true,
  
}; 