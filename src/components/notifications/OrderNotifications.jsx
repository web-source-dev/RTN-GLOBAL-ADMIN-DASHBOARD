import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoneyIcon from '@mui/icons-material/Money';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BuildIcon from '@mui/icons-material/Build';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { format } from 'date-fns';
import API from '../../BackendAPi/ApiProvider';

/**
 * Component to display order-related notifications
 * Can be filtered to show notifications for a specific order
 * 
 * @param {Object} props Component props
 * @param {string} [props.orderId] Optional order ID to filter notifications
 * @param {number} [props.limit] Optional limit to number of notifications shown
 * @param {boolean} [props.showTitle] Whether to show the component title (default: true)
 * @param {string} [props.title] Title override (default: "Order Notifications")
 */
const OrderNotifications = ({ orderId, limit = 5, showTitle = true, title = "Order Notifications" }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, [orderId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/user/notifications/orders');
      
      let filteredNotifications = response.data;
      
      // If orderId is provided, filter notifications for this specific order
      if (orderId) {
        filteredNotifications = response.data.filter(
          notification => notification.metadata && notification.metadata.orderId === orderId
        );
      }
      
      // Apply limit
      if (limit && filteredNotifications.length > limit) {
        filteredNotifications = filteredNotifications.slice(0, limit);
      }
      
      setNotifications(filteredNotifications);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order notifications');
      console.error('Error fetching order notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await API.patch(`/api/user/notifications/${notificationId}/read`);
      
      // Update the notifications state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      
      // Handle notification link if it exists
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && notification.link) {
        window.location.href = notification.link;
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (notification) => {
    const { type } = notification;
    
    // Check for specific order notification scenarios based on title
    const title = notification.title.toLowerCase();
    if (title.includes('payment')) {
      return <MoneyIcon color="success" />;
    } else if (title.includes('review')) {
      return <RateReviewIcon color="primary" />;
    } else if (title.includes('revision')) {
      return <BuildIcon color="warning" />;
    } else if (title.includes('offer')) {
      return <ShoppingCartIcon color="primary" />;
    } else if (title.includes('status')) {
      return <InfoIcon color="info" />;
    } else if (title.includes('tip')) {
      return <MoneyIcon color="success" />;
    } else if (title.includes('invoice') || title.includes('receipt')) {
      return <ReceiptIcon color="primary" />;
    }
    
    // Default based on notification type
    switch (type) {
      case 'info':
        return <InfoIcon color="info" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <ShoppingCartIcon color="primary" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const renderNotificationContent = (notification) => (
    <ListItem
      alignItems="flex-start"
      sx={{
        backgroundColor: notification.read ? 'inherit' : 'action.hover',
        '&:hover': { backgroundColor: 'action.selected' },
        cursor: 'pointer',
        borderRadius: 1,
        mb: 1
      }}
      onClick={() => markAsRead(notification.id)}
    >
      <ListItemIcon>
        {getNotificationIcon(notification)}
      </ListItemIcon>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" component="div">
              {notification.title}
            </Typography>
            {notification.priority && (
              <Chip 
                label={notification.priority} 
                size="small" 
                color={getPriorityColor(notification.priority)}
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
        }
        secondary={
          <React.Fragment>
            <Typography variant="body2" color="text.secondary" component="div">
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );

  return (
    <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
      {showTitle && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      {loading ? (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={20} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : notifications.length === 0 ? (
        <Typography color="text.secondary">No notifications</Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              {renderNotificationContent(notification)}
              {index < notifications.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default OrderNotifications; 