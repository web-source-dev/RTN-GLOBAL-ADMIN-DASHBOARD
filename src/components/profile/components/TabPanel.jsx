import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// TabPanel component to display content based on selected tab
const TabPanel = ({ children, value, index, ...other }) => {
  const theme = useTheme();
  const isActive = value === index;
  
  // Animation variants for tabs
  const panelVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.98,
      filter: 'blur(3px)',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.4,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      scale: 0.96,
      filter: 'blur(2px)',
      transition: { 
        duration: 0.2,
        ease: 'easeIn',
      }
    }
  };

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ 
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
      {...other}
    >
      <AnimatePresence mode="wait">
        {isActive && (
          <Box
            component={motion.div}
            key={`panel-${index}`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            sx={{
              p: { xs: 2, sm: 3 },
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 3,
              // Subtle background pattern based on theme mode
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.04,
                pointerEvents: 'none',
                backgroundImage: theme.palette.mode === 'light'
                  ? `radial-gradient(${theme.palette.primary.main}20 1px, transparent 1px)`
                  : `radial-gradient(${theme.palette.primary.light}15 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0',
                zIndex: -1,
              },
            }}
          >
            {children}
          </Box>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TabPanel; 