export const generateCaptcha = (canvas: HTMLCanvasElement): string => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''
  
  // 生成随机验证码
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    code += chars[randomIndex]
  }

  const ctx = canvas.getContext('2d')
  if (ctx) {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 设置背景
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制文字
    ctx.fillStyle = '#e5e7eb'
    ctx.font = '24px Arial'
    ctx.textBaseline = 'middle'
    
    // 随机旋转和位置
    for (let i = 0; i < code.length; i++) {
      const x = 15 + i * 23
      const y = canvas.height / 2
      const rotation = (Math.random() - 0.5) * 0.3
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.fillText(code[i], 0, 0)
      ctx.restore()
    }

    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(229, 231, 235, ${Math.random() * 0.2})`
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }

    // 添加噪点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(229, 231, 235, ${Math.random() * 0.3})`
      ctx.beginPath()
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        2 * Math.PI
      )
      ctx.fill()
    }
  }

  return code
} 