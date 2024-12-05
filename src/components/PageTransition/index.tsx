import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ 
          opacity: 0,
          scale: 0.98,
          y: 10
        }}
        animate={{ 
          opacity: 1,
          scale: 1,
          y: 0
        }}
        exit={{ 
          opacity: 0,
          scale: 0.96,
          y: -10
        }}
        transition={{
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1] // 使用 ease-out 缓动函数
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition 