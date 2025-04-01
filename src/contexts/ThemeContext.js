import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { getDesignTokens } from '../theme';
import API from '../BackendAPi/ApiProvider';
import { useAuth } from './AuthContext';

export const ThemeContext = createContext({
  mode: 'system',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('system');
  const { user, isAuthenticated } = useAuth();

  // Get user preferences from database on mount
  useEffect(() => {
    const getUserPreferences = async () => {
      try {
        if (isAuthenticated) {
          const response = await API.get('/api/user/preferences');
          
          if (response.data?.theme) {
            // Set theme preference
            setMode(response.data.theme);
          } else {
            // Use system defaults if no preferences saved
            setMode(getSystemTheme());
          }
        } else {
          // Not logged in - use system defaults
          setMode(getSystemTheme());
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
        // Fallback to system defaults
        setMode(getSystemTheme());
      }
    };

    getUserPreferences();
  }, [isAuthenticated, user]);

  // Get system theme preference
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Listen for system theme changes
  useEffect(() => {
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        // Just rerender with the new system value
        setMode('system');
      };
      
      // Use the event listener approach based on browser support
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    updateUserPreferences({ theme: newMode });
  };

  const setThemeMode = (newMode) => {
    setMode(newMode);
    updateUserPreferences({ theme: newMode });
  };

  // Update user preferences in database
  const updateUserPreferences = async (preferences) => {
    try {
      if (isAuthenticated) {
        await API.put('/api/user/preferences', { 
          ...preferences 
        });
      }
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  const actualMode = mode === 'system' ? getSystemTheme() : mode;
  const theme = useMemo(() => createTheme(getDesignTokens(actualMode)), [actualMode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setThemeMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
