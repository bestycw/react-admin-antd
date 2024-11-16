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
    })
  }, [])

  useEffect(() => {
    NProgress.start()
    return () => {
      NProgress.done()
    }
  }, [location])

  return null
}

export default PageProgress 