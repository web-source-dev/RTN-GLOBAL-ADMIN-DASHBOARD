import React from 'react';
import { Button, Box, useTheme, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion } from 'framer-motion';

const ActionButton = ({ isEditing, onEdit, onSave, onCancel, loading }) => {
  const theme = useTheme();

  // Gradient for buttons
  const buttonGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  
  // Common button hover effect
  const buttonHoverStyle = {
    boxShadow: `0 4px 20px 0 ${theme.palette.primary.main}40`,
    transform: 'translateY(-2px)',
  };

  if (isEditing) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <Button
          component={motion.button}
          whileHover={buttonHoverStyle}
          whileTap={{ scale: 0.97 }}
          variant="contained"
          onClick={onSave}
          disabled={loading}
          startIcon={loading ? null : <SaveIcon />}
          sx={{
            background: buttonGradient,
            px: 3,
            py: 1.2,
            fontWeight: 'medium',
            position: 'relative',
            overflow: 'hidden',
            minWidth: 160,
            
            // Background animation
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, 
                transparent, 
                rgba(255,255,255,0.2), 
                transparent)`,
              transition: 'left 0.7s',
            },
            '&:hover:before': {
              left: '100%',
            },
            
            // Disabled state
            '&.Mui-disabled': {
              background: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
            
            transition: 'all 0.3s',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Saving...
            </Box>
          ) : (
            'Save Changes'
          )}
        </Button>
        
        <Button
          component={motion.button}
          whileHover={{
            boxShadow: `0 4px 10px 0 ${theme.palette.grey[500]}20`,
            background: theme.palette.background.paper,
          }}
          whileTap={{ scale: 0.97 }}
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          startIcon={<CancelIcon />}
          sx={{
            borderWidth: 2,
            px: 3,
            py: 1.1,
            fontWeight: 'medium',
            borderColor: theme.palette.grey[300],
            '&:hover': {
              borderWidth: 2,
              borderColor: theme.palette.grey[400],
            },
            transition: 'all 0.3s',
          }}
        >
          Cancel
        </Button>
        
        {/* Animated particles for save button */}
        {!loading && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
            }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: 20, 
                  y: 20, 
                  opacity: 0.7,
                  scale: 0.5 + Math.random() * 0.5,
                }}
                animate={{ 
                  x: -20 - Math.random() * 20, 
                  y: -20 - Math.random() * 20,
                  opacity: 0,
                  scale: 0,
                  transition: { 
                    repeat: Infinity,
                    duration: 1 + Math.random() * 1,
                    delay: Math.random() * 2,
                    ease: 'easeOut'
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '30%',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: theme.palette.primary.main,
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Button
      component={motion.button}
      whileHover={buttonHoverStyle}
      whileTap={{ scale: 0.97 }}
      variant="contained"
      onClick={onEdit}
      startIcon={<EditIcon />}
      sx={{
        background: buttonGradient,
        px: 3,
        py: 1.2,
        fontWeight: 'medium',
        position: 'relative',
        overflow: 'hidden',
        
        // Animated border effect
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: -4,
          padding: 4,
          borderRadius: 'inherit',
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.light}, 
            ${theme.palette.secondary.light})`,
          WebkitMask: 
            'linear-gradient(#fff 0 0) content-box, ' +
            'linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&:hover:before': {
          opacity: 1,
        },
        
        transition: 'all 0.3s',
      }}
    >
      Edit Profile
    </Button>
  );
};

export default ActionButton; 