import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  useTheme,
  Backdrop,
  CircularProgress,
  Fade,
  useMediaQuery,
} from '@mui/material';
import API from '../../BackendAPi/ApiProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import components
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import TabPanel from './components/TabPanel';
import ActionButton from './components/ActionButton';

// Import tab components
import ProfileInfoTab from './components/tabs/ProfileInfoTab';
import BusinessDetailsTab from './components/tabs/BusinessDetailsTab';
import SocialLinksTab from './components/tabs/SocialLinksTab';
import SecurityTab from './components/tabs/SecurityTab';

const UserProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    company: '',
    position: '',
    bio: '',
    website: '',
    avatar: null,
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
    },
    businessDetails: {}
  });
  
  const [originalUserData, setOriginalUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/user/profile');
      setUserData(response.data);
      setOriginalUserData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile data');
      
      // Redirect to login if unauthorized
      if (err.response?.status === 401) {
        navigate('/auth/login', { state: { from: '/profile' } });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditMode = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setUserData(originalUserData);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      await API.put('/api/user/profile', userData);
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setOriginalUserData(userData);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      await API.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setOpenPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSubmitting(true);
      await API.delete('/api/user/account');
      navigate('/auth/login', { state: { message: 'Your account has been deleted successfully' } });
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.response?.data?.message || 'Failed to delete account');
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await API.post('/api/user/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update the avatar in the local state
      setUserData(prevData => ({
        ...prevData,
        avatar: response.data.avatar
      }));
      
      setOriginalUserData(prevData => ({
        ...prevData,
        avatar: response.data.avatar
      }));
      
      setSuccess('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate content container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        position: 'relative',
        background: theme.palette.background.default,
        minHeight: '100vh',
        pb: 6,
        pt: { xs: 3, md: 6 },
        overflow: 'hidden',
      }}
    >

      <Container
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        maxWidth="xl" 
        sx={{
          position: 'relative', 
          zIndex: 1,
        }}
      >
        {/* Error/Success Messages */}
        <Fade in={!!(error || success)}>
          <Box sx={{ mb: 3 }}>
            {error && (
              <Alert 
                severity="error" 
                variant="filled"
              sx={{ 
                borderRadius: 2,
                  boxShadow: theme.shadows[3],
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert 
                severity="success" 
                variant="filled"
                    sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                }}
              >
                {success}
              </Alert>
                  )}
                </Box>
        </Fade>

        {/* Profile Header with Avatar and Name */}
        <ProfileHeader 
          userData={userData} 
          isEditing={isEditing} 
          handleImageUpload={handleImageUpload} 
          loading={loading} 
        />

        {/* Action Buttons - Edit/Save/Cancel */}
        <Box 
                  sx={{
            display: 'flex', 
            justifyContent: 'flex-end',
            mt: 2,
            mb: 4,
            mx: { xs: 2, md: 0 }
          }}
        >
          <ActionButton 
            isEditing={isEditing}
            onEdit={handleEditMode}
            onSave={handleSubmit}
            onCancel={handleCancelEdit}
            loading={submitting}
          />
        </Box>

        {/* Main Content Grid */}
        <Grid 
          container 
          spacing={isMobile ? 3 : 4}
          component={motion.div}
          variants={containerVariants}
        >
          {/* Left Column - Navigation */}
          <Grid 
            item 
            xs={12} 
            md={3}
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </Grid>

          {/* Right Column - Tab Content */}
          <Grid 
            item 
            xs={12} 
            md={9}
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Box
                  sx={{
                position: 'relative',
                minHeight: 500,
                background: theme.palette.background.paper,
                borderRadius: 4,
                p: 0.5,
                boxShadow: `0 4px 20px 0 ${theme.palette.mode === 'light' 
                  ? 'rgba(0,0,0,0.05)' 
                  : 'rgba(0,0,0,0.2)'}`,
                // Subtle border
                border: `1px solid ${theme.palette.divider}`,
                // Subtle gradient
                backgroundImage: theme.palette.mode === 'light' 
                  ? `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}f8)`
                  : 'none',
                // Loading state indicator
                '&:before': loading ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: '4px 4px 0 0',
                  animation: 'loadingProgress 1.5s ease-in-out infinite',
                  '@keyframes loadingProgress': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                  },
                  zIndex: 10,
                } : {},
                overflow: 'hidden',
              }}
            >
                <TabPanel value={activeTab} index={0}>
                <ProfileInfoTab 
                  userData={userData} 
                  setUserData={setUserData} 
                  isEditing={isEditing} 
                  loading={loading} 
                />
                </TabPanel>
              
                <TabPanel value={activeTab} index={1}>
                <BusinessDetailsTab 
                  userData={userData} 
                  setUserData={setUserData} 
                  isEditing={isEditing} 
                  loading={loading} 
                />
                </TabPanel>
              
                <TabPanel value={activeTab} index={2}>
                <SocialLinksTab 
                  userData={userData} 
                  setUserData={setUserData} 
                  isEditing={isEditing} 
                  loading={loading} 
                  setIsEditing={setIsEditing}
                />
                </TabPanel>
              
                <TabPanel value={activeTab} index={3}>
                <SecurityTab 
                  handlePasswordChange={handlePasswordChange}
                  handleDeleteAccount={handleDeleteAccount}
                  passwordData={passwordData}
                  setPasswordData={setPasswordData}
                  openPasswordDialog={openPasswordDialog}
                  setOpenPasswordDialog={setOpenPasswordDialog}
                  error={error}
                  success={success}
                  loading={loading}
                />
                </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Loading overlay */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)',
          background: 'rgba(0,0,0,0.4)',
        }}
        open={submitting}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            color="inherit" 
            size={60}
            thickness={4}
            sx={{
              boxShadow: '0 0 20px rgba(255,255,255,0.3)',
              borderRadius: '50%',
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 2, 
              fontWeight: 'medium',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            Processing...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default UserProfile; 