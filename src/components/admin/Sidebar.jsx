import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Work as WorkIcon,
  Mail as MailIcon,
  Chat as ChatIcon,
  Support as SupportIcon,
  Settings as SettingsIcon,
  Subscriptions as SubscriptionsIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Overview', icon: DashboardIcon, path: '/' },
  { text: 'Users', icon: PeopleIcon, path: '/users' },
  { text: 'Subscription Plans', icon: SubscriptionsIcon, path: '/subscription-plans' },
  { text: 'Blogs', icon: ArticleIcon, path: '/blog/manage' },
  { text: 'Job Applications', icon: WorkIcon, path: '/jobs' },
  { text: 'Newsletter', icon: MailIcon, path: '/newsletter' },
  { text: 'Live Chat', icon: ChatIcon, path: '/chat' },
  { text: 'Support Tickets', icon: SupportIcon, path: '/support' },
  { text: 'Consultation Request', icon: SupportIcon, path: '/consultation' },
];

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: `${theme.palette.primary.main}15`,
                borderRight: `3px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}25`,
                },
              },
            }}
          >
            <ListItemIcon>
              <item.icon color={location.pathname === item.path ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 