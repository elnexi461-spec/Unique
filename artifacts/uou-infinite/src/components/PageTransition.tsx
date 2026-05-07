import { motion } from "framer-motion";
import type { ReactNode } from "react";

const VARIANTS = {
  initial: { opacity: 0, x: 18, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0,  filter: "blur(0px)" },
  exit:    { opacity: 0, x: -12, filter: "blur(2px)" },
};

const TRANSITION = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      variants={VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={TRANSITION}
      className={className}
    >
      {children}
    </motion.div>
  );
}
