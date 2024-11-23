import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { slideAnimation, fadeAnimation, scaleAnimation, transitions } from './animations'
import { useStore } from '@/store'

interface PageTransitionProps {
  children: React.ReactNode
  animation?: 'slide' | 'fade' | 'scale'
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  animation = 'slide' 
}) => {
  const location = useLocation()
  const { ConfigStore } = useStore()

  const getAnimation = () => {
    switch (animation) {
      case 'slide':
        return slideAnimation
      case 'fade':
        return fadeAnimation
      case 'scale':
        return scaleAnimation
      default:
        return slideAnimation
    }
  }

  // 如果是抽屉模式，禁用动画
  if (ConfigStore.isDrawerMode) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={getAnimation()}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transitions.spring}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition 