import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  PeopleOutline,
  ArticleOutlined,
  WorkOutline,
  MailOutline,
  Chat as ChatIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../../BackendAPi/ApiProvider';

const StatCard = ({ title, value, icon: Icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: `${color}15`,
              color: color,
              mr: 2,
            }}
          >
            <Icon />
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Overview = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    jobs: 0,
    newsletters: 0,
    chats: 0,
    tickets: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/api/admin/stats/overview');
      const data = response.data;
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await API.get('/api/admin/stats/chart');
      const data = response.data;
      setChartData(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.users}
            icon={PeopleOutline}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Blogs"
            value={stats.blogs}
            icon={ArticleOutlined}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Job Applications"
            value={stats.jobs}
            icon={WorkOutline}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Newsletter Subscribers"
            value={stats.newsletters}
            icon={MailOutline}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Chats"
            value={stats.chats}
            icon={ChatIcon}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Support Tickets"
            value={stats.tickets}
            icon={SupportIcon}
            color="#e91e63"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Activity Overview
        </Typography>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke={theme.palette.primary.main} />
              <Line type="monotone" dataKey="blogs" stroke={theme.palette.secondary.main} />
              <Line type="monotone" dataKey="tickets" stroke="#e91e63" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default Overview; 