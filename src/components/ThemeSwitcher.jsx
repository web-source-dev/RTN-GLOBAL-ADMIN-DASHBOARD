import React from 'react';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { mode, setThemeMode } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newMode) => {
    setThemeMode(newMode);
    handleClose();
  };

  const getThemeIcon = () => {
    switch (mode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };

  return (
    <>
      <Tooltip title={('Theme Switch')}>
        <IconButton
          onClick={handleClick}
          color="inherit"
          sx={{
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? 'rgba(0, 0, 0, 0.04)' 
                : 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleThemeChange('light')}>
          <LightModeIcon sx={{ mr: 1 }} />
          {('Light')}
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')}>
          <DarkModeIcon sx={{ mr: 1 }} />
          {('Dark')}
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('system')}>
          <SettingsBrightnessIcon sx={{ mr: 1 }} />
          {('System')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeSwitcher;
