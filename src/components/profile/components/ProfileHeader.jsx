import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Badge,
  useTheme,
  Skeleton,
  Stack,
  Paper,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { motion } from 'framer-motion';

const ProfileHeader = ({ userData, isEditing, handleImageUpload, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Skeleton variant="circular" width={150} height={150} />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={150} height={24} />
      </Box>
    );
  }

  return (
    <Paper 
      elevation={0}
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}15, ${theme.palette.secondary.dark}15)`,
        boxShadow: theme.shadows[1],
        mb: 4,
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          overflow: 'hidden',
          opacity: 0.07,
          zIndex: 0,
        }}
      >
        <Box
          component={motion.div}
          initial={{ rotate: -5, scale: 1.2 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            filter: 'blur(40px)',
          }}
        />
      </Box>

      {/* Left circular background */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `linear-gradient(-45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
          opacity: 0.1,
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          p: { xs: 4, md: 5 },
          gap: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                isEditing && (
                  <IconButton
                    component="label"
                    sx={{
                      bgcolor: 'background.paper',
                      boxShadow: `0 4px 20px 0px ${theme.palette.primary.main}50`,
                      '&:hover': {
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                      },
                      transition: 'all 0.3s',
                    }}
                    size="medium"
                  >
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <PhotoCameraIcon />
                  </IconButton>
                )
              }
            >
              <Avatar
                src={userData.avatar ? `${process.env.REACT_APP_API_URL}${userData.avatar}` : ''}
                alt={`${userData.firstName} ${userData.lastName}`}
                sx={{
                  width: 150,
                  height: 150,
                  boxShadow: `0 8px 24px 0px ${theme.palette.primary.main}30`,
                  border: `4px solid ${theme.palette.background.paper}`,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '4rem',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
              >
                {userData.firstName && userData.lastName
                  ? `${userData.firstName[0]}${userData.lastName[0]}`
                  : '?'}
              </Avatar>
            </Badge>
          </motion.div>
          
          {/* Decorative ring */}
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              left: -8,
              right: -8,
              bottom: -8,
              borderRadius: '50%',
              border: `2px dashed ${theme.palette.primary.light}40`,
              animation: 'spin 60s linear infinite',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
              display: { xs: 'none', md: 'block' },
            }}
          />
        </Box>

        <Stack spacing={1} sx={{ textAlign: { xs: 'center', md: 'left' }, flexGrow: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                mb: 1,
              }}
            >
              {userData.firstName && userData.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : 'Welcome User'}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: 0.5,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: { xs: '25%', md: 0 },
                  width: { xs: '50%', md: '40%' },
                  height: 3,
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.main}00)`,
                }
              }}
            >
              {userData.position || userData.company
                ? `${userData.position || 'Professional'} ${
                    userData.company ? `at ${userData.company}` : ''
                  }`
                : 'Complete your profile to showcase your professional details'}
            </Typography>
          </motion.div>
          
          {/* Membership badge - optional decorative element */}
          {userData.role && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ 
                alignSelf: { xs: 'center', md: 'flex-start' },
                marginTop: 16 
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 2,
                  py: 0.5,
                  mt: 2,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                  border: `1px solid ${theme.palette.primary.main}30`,
                  color: theme.palette.primary.main,
                  fontWeight: 'medium',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {userData.role === 'admin' ? 'Administrator' : 'Member'}
              </Box>
            </motion.div>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProfileHeader; 