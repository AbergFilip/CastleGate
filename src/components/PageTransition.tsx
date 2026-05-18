import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

interface PageTransitionProps {
  children: ReactNode
}

const variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.16, ease: 'linear' }}
        style={{
          minHeight: '100vh',
          willChange: 'opacity',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
