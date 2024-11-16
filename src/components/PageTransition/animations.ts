import { Variants } from 'framer-motion'

export const slideAnimation: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export const fadeAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleAnimation: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.1 },
}

export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
  },
  tween: {
    type: 'tween',
    duration: 0.3,
  },
} 