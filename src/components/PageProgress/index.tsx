import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import { useLocation } from 'react-router-dom'
import './index.scss'

const PageProgress: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      minimum: 0.3,
      easing: 'ease',
      speed: 500,
      trickleSpeed: 200,
    })
  }, [])

  useEffect(() => {
    NProgress.start()

    // 使用 requestAnimationFrame 确保在下一帧结束进度条
    const timer = requestAnimationFrame(() => {
      NProgress.done()
    })
    return () => {
      cancelAnimationFrame(timer)
      NProgress.done()
    }
  }, [location.pathname])

  return null
}

export default PageProgress 