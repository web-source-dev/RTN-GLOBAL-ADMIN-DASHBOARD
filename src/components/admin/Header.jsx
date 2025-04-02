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
  Divider,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationComponent from '../notifications/NotificationComponent';
const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout ,isAuthenticated} = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    try {
     await logout();
     window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/auth/login`;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleProfile = () => {
    navigate('/admin/profile');
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
          <NotificationComponent />
        </IconButton>
        <Box 
          sx={{ ml: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleMenuOpen}
        >
          <Avatar
            src={user?.avatar ? `${process.env.REACT_APP_API_URL}${user.avatar}` : undefined}
            alt={user?.firstName}
            sx={{ width: 40, height: 40 }}
          />
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

          <MenuItem>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Chip label="Admin" size="small" sx={{ ml: 1 }} />
          </MenuItem>
          <MenuItem>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.email}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <PersonIcon sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <Divider />
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