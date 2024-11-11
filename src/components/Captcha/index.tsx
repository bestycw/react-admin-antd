import { useEffect, useState } from 'react'
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
  const [, setCaptcha] = useState('')

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha()
    setCaptcha(newCaptcha)
    onChange?.(newCaptcha)
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
        width={width}
        height={height}
        id="captcha"
        className="h-full w-full"
      />
    </div>
  )
}

export default Captcha 