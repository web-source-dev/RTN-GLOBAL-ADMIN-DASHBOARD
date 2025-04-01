import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  useEffect(() => {
    // Ensure smooth scroll to top on component mount
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y:30 }} // Start from slightly below
      animate={{ opacity: 1, y: 0 }} // Move to normal position
      exit={{ opacity: 0 }}
      transition={{
        type: "tween",
        ease: "easeOut",
        duration: 1
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
