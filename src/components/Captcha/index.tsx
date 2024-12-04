import React, { useEffect, useRef, useState } from 'react'
import { generateCaptcha } from '@/utils/captcha'

interface CaptchaProps {
  width?: number
  height?: number
  onChange?: (code: string) => void
}

const Captcha: React.FC<CaptchaProps> = ({ 
  width = 100, 
  height = 40,
  onChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [, setCaptcha] = useState('')

  const refreshCaptcha = () => {
    if (canvasRef.current) {
      const newCaptcha = generateCaptcha(canvasRef.current)
      setCaptcha(newCaptcha)
      onChange?.(newCaptcha)
    }
  }

  useEffect(() => {
    refreshCaptcha()
  }, [])

  return (
    <div 
      className="captcha-image-container flex-shrink-0 cursor-pointer"
      onClick={refreshCaptcha}
      title="点击刷新验证码"
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="h-full w-full"
      />
    </div>
  )
}

export default Captcha 