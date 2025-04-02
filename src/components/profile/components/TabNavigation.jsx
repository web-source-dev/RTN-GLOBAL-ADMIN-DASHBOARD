import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Paper,
  alpha,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';

// Import icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const theme = useTheme();

  const tabItems = [
    {
      text: 'Personal Information',
      icon: <PersonOutlineIcon />,
      description: 'Manage your personal details and contact information'
    },
    {
      text: 'Business Details',
      icon: <BusinessCenterOutlinedIcon />,
      description: 'Update your business information and company profile'
    },
    {
      text: 'Social Links',
      icon: <ShareOutlinedIcon />,
      description: 'Connect your social media profiles and networking channels'
    },
    {
      text: 'Security',
      icon: <LockOutlinedIcon />,
      description: 'Update your password and manage account security'
    },
  ];

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Paper
      elevation={0}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 4px 20px 0 ${theme.palette.mode === 'light' 
          ? 'rgba(0,0,0,0.04)' 
          : 'rgba(0,0,0,0.2)'}`,
      }}
    >
      <List 
        component={motion.ul}
        variants={listVariants}
        initial="hidden"
        animate="visible"
        sx={{ p: 1 }}
      >
        {tabItems.map((item, index) => (
          <Tooltip 
            key={index}
            title={item.description} 
            placement="right"
            arrow
          >
            <ListItem
              component={motion.li}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                transition: { duration: 0.2 }
              }}
              onClick={() => setActiveTab(index)}
              sx={{
                mb: 1,
                borderRadius: 3,
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.2s ease-in-out',
                background: index === activeTab 
                  ? `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.12)})`
                  : 'transparent',

                // Active tab indicator
                '&::before': index === activeTab ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '10%',
                  bottom: '10%',
                  width: 4,
                  borderRadius: '0 4px 4px 0',
                  background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                } : {},
                
                // Hover effect when not active
                '&:hover': {
                  background: index !== activeTab 
                    ? alpha(theme.palette.action.hover, 0.1)
                    : `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.15)})`,
                },
                
                // Selected states
                '&.Mui-selected': {
                  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.12)})`,
                },
                
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: index === activeTab ? theme.palette.primary.main : theme.palette.text.secondary,
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {item.icon}
              </ListItemIcon>
              
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: index === activeTab ? theme.palette.text.primary : theme.palette.text.secondary,
                    fontWeight: index === activeTab ? 600 : 400,
                    transition: 'color 0.2s ease-in-out, font-weight 0.2s ease-in-out',
                    fontSize: '0.95rem',
                  },
                }}
              />
              
              {/* Active indicator dot */}
              {index === activeTab && (
                <Box
                  component={motion.div}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    ml: 1,
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Paper>
  );
};

export default TabNavigation; 