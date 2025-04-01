import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Box,
  useTheme,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../BackendAPi/ApiProvider';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await API.post('/api/auth/logout');
      // Clear any remaining user data in localStorage
      localStorage.removeItem('user');
      // Use the auth context to update the app state
      if (logout) logout();
      // Redirect to login page
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={7} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Box 
          sx={{ ml: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleMenuOpen}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.firstName}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ ml: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administrator
            </Typography>
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 