import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Header />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 