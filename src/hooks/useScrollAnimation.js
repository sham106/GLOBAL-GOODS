// src/hooks/useScrollAnimation.js
import { useEffect, useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' } 
  }
};

/**
 * Custom hook to trigger scroll-triggered framer-motion animations
 * when components enter the viewport.
 */
export default function useScrollAnimation() {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-100px' 
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return { 
    ref, 
    controls, 
    variants: fadeInUp 
  };
}
