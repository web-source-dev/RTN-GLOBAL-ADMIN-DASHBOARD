import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Button,
  Skeleton,
  useTheme,
  Grid,
  InputAdornment,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

const SocialLinksTab = ({ userData, setUserData, isEditing, loading, setIsEditing }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newLinkType, setNewLinkType] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Initialize socialLinks if it doesn't exist
  const socialLinks = userData.socialLinks || {};

  // Define available social platforms
  const socialPlatforms = {
    linkedin: { name: 'LinkedIn', icon: <LinkedInIcon sx={{ color: '#0077b5' }} />, placeholder: 'https://linkedin.com/in/yourprofile' },
    twitter: { name: 'Twitter', icon: <TwitterIcon sx={{ color: '#1DA1F2' }} />, placeholder: 'https://twitter.com/yourusername' },
    website: { name: 'Website', icon: <LanguageIcon color="primary" />, placeholder: 'https://yourwebsite.com' },
    github: { name: 'GitHub', icon: <GitHubIcon sx={{ color: '#333' }} />, placeholder: 'https://github.com/yourusername' },
    instagram: { name: 'Instagram', icon: <InstagramIcon sx={{ color: '#E1306C' }} />, placeholder: 'https://instagram.com/yourusername' },
    facebook: { name: 'Facebook', icon: <FacebookIcon sx={{ color: '#1877F2' }} />, placeholder: 'https://facebook.com/yourprofile' },
    youtube: { name: 'YouTube', icon: <YouTubeIcon sx={{ color: '#FF0000' }} />, placeholder: 'https://youtube.com/channel/yourchannelid' },
  };

  // Get currently used platforms
  const usedPlatforms = Object.keys(socialLinks).filter(key => socialLinks[key]);
  
  // Get available platforms (not already used)
  const availablePlatforms = Object.keys(socialPlatforms).filter(
    platform => !usedPlatforms.includes(platform) || !socialLinks[platform]
  );

  // Check if we've reached the maximum number of social links
  const canAddMore = usedPlatforms.length < 5;

  const handleSocialLinkChange = (platform, value) => {
    setUserData({
      ...userData,
      socialLinks: {
        ...socialLinks,
        [platform]: value,
      },
    });
  };

  const handleAddLink = () => {
    handleSocialLinkChange(newLinkType, newLinkUrl);
    setNewLinkType('');
    setNewLinkUrl('');
    setOpenAddDialog(false);
  };

  const handleDeleteLink = (platform) => {
    const updatedSocialLinks = { ...socialLinks };
    delete updatedSocialLinks[platform];
    
    setUserData({
      ...userData,
      socialLinks: updatedSocialLinks,
    });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddDialogOpen = (platform) => {
    setNewLinkType(platform);
    setOpenAddDialog(true);
    handleMenuClose();
  };

  // Fix: Migrate 'github' key to 'website' if needed
  React.useEffect(() => {
    if (socialLinks.github && !socialLinks.website) {
      // Move github value to website if it's a website URL
      if (!socialLinks.github.includes('github.com')) {
        handleSocialLinkChange('website', socialLinks.github);
        handleSocialLinkChange('github', '');
      }
    }
  }, []);

  const getSocialIcon = (platform, props = {}) => {
    if (socialPlatforms[platform]) {
      return React.cloneElement(socialPlatforms[platform].icon, props);
    }
    return <LanguageIcon {...props} />;
  };

  const getSocialName = (platform) => {
    return socialPlatforms[platform]?.name || platform;
  };

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 2,
          height: '100%',
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="text" height={40} width="50%" />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={0}
      sx={{
        borderRadius: 2,
        p: 0,
        overflow: 'hidden',
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(120deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          color: 'white',
        }}
      >
        <Typography variant="h5" fontWeight="medium">
          Social Links
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          {isEditing
            ? 'Connect your social profiles below'
            : 'Manage your social media connections'}
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {isEditing ? (
          // Edit Mode
          <Grid container spacing={3}>
            {/* Default social inputs */}
            {Object.entries(socialLinks).map(([platform, url]) => 
              platform && socialPlatforms[platform] && (
                <Grid item xs={12} key={platform}>
                  <TextField
                    label={`${getSocialName(platform)} URL`}
                    value={url || ''}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder={socialPlatforms[platform].placeholder}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {getSocialIcon(platform)}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={() => handleDeleteLink(platform)}
                            edge="end"
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )
            )}

            {/* Add more social links button */}
            {canAddMore && (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleMenuOpen}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Add Another Social Link
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: { 
                      width: 220,
                      maxHeight: 300,
                      mt: 1,
                      boxShadow: theme.shadows[3],
                    }
                  }}
                >
                  {availablePlatforms.length > 0 ? (
                    availablePlatforms.map((platform) => (
                      <MenuItem 
                        key={platform} 
                        onClick={() => handleAddDialogOpen(platform)}
                        sx={{ py: 1.5 }}
                      >
                        <ListItemIcon>
                          {getSocialIcon(platform)}
                        </ListItemIcon>
                        <ListItemText primary={getSocialName(platform)} />
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <ListItemText primary="No more platforms available" />
                    </MenuItem>
                  )}
                </Menu>
              </Grid>
            )}
          </Grid>
        ) : (
          // View Mode
          <Stack spacing={2}>
            {Object.entries(socialLinks).some(([_, value]) => !!value) ? (
              Object.entries(socialLinks).map(
                ([platform, url]) =>
                  url && (
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 2,
                          borderRadius: 2,
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: theme.palette.mode === 'light' 
                              ? 'rgba(0, 82, 204, 0.04)'
                              : 'rgba(76, 154, 255, 0.08)',
                          },
                        }}
                      >
                        <Stack 
                          direction="row" 
                          justifyContent="space-between" 
                          alignItems="center"
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            {getSocialIcon(platform, { fontSize: 'large' })}
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {getSocialName(platform)}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  maxWidth: 230,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {url}
                              </Typography>
                            </Box>
                          </Stack>
                          <Tooltip title="Visit Link">
                            <IconButton
                              color="primary"
                              size="small"
                              component="a"
                              href={url.startsWith('http') ? url : `https://${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                bgcolor: theme.palette.mode === 'light' 
                                  ? 'rgba(0, 82, 204, 0.08)'
                                  : 'rgba(76, 154, 255, 0.16)',
                              }}
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Card>
                    </motion.div>
                  )
              )
            ) : (
              <Box
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  gap: 2,
                }}
              >
                <LanguageIcon color="action" sx={{ fontSize: 48 }} />
                <Typography variant="body1" color="text.secondary">
                  No social links added yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your social profiles to connect with your network
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsEditing(true)}
                sx={{ mt: 2 }}
                fullWidth
              >
                Add Social Links
              </Button>
            </Box>
          </Stack>
        )}
      </CardContent>

      {/* Dialog for adding a new social link */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          sx: { 
            borderRadius: 2,
            width: { xs: '90%', sm: '500px' },
            maxWidth: '100%',
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            {newLinkType && getSocialIcon(newLinkType)}
            <Typography variant="h6">
              Add {newLinkType ? getSocialName(newLinkType) : 'Social Link'}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder={newLinkType ? socialPlatforms[newLinkType]?.placeholder : ''}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenAddDialog(false)}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddLink}
            variant="contained"
            disabled={!newLinkUrl}
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            Add Link
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SocialLinksTab; 