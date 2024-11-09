import React, { useEffect, useRef, useState } from 'react';

interface CaptchaProps {
  width?: number;
  height?: number;
  onChange?: (code: string) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ width = 120, height = 40, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState('');

  const generateCode = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制背景
    ctx.fillStyle = '#1e293b'; // 深色背景
    ctx.fillRect(0, 0, width, height);

    // 绘制干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // 绘制文字
    ctx.font = '28px Arial';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < code.length; i++) {
      const x = (width / code.length) * i + 15;
      const y = height / 2 + Math.random() * 8 - 4;
      ctx.fillStyle = `rgb(${Math.random() * 70 + 185}, ${Math.random() * 70 + 185}, ${Math.random() * 70 + 185})`;
      ctx.setTransform(
        1,
        Math.random() * 0.4 - 0.2,
        Math.random() * 0.4 - 0.2,
        1,
        0,
        0
      );
      ctx.fillText(code[i], x, y);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  };

  const refresh = () => {
    const newCode = generateCode();
    setCode(newCode);
    onChange?.(newCode);
    drawCaptcha(newCode);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={refresh}
      className="cursor-pointer rounded"
      title="点击刷新验证码"
    />
  );
};

export default Captcha; 