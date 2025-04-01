import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Switch,
  useTheme,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import API from '../../BackendAPi/ApiProvider';

const Newsletter = () => {
  const theme = useTheme();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [activeSubscribers, setActiveSubscribers] = useState(0);

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [page, rowsPerPage]);

  const fetchSubscribers = async () => {
    try {
      const response = await API.get(`/api/admin/newsletter?page=${page + 1}&limit=${rowsPerPage}`);
      const data = response.data;
      setSubscribers(data.subscribers);
      setTotalSubscribers(data.total);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get('/api/admin/newsletter/stats');
      const data = response.data;
      setActiveSubscribers(data.activeSubscribers);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubscriptionToggle = async (subscriberId, isSubscribed) => {
    try {
      await API.patch(`/api/admin/newsletter/${subscriberId}/status`, { isSubscribed });
      fetchSubscribers();
      fetchStats();
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const handleDeleteClick = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/admin/newsletter/${selectedSubscriber._id}`);
      fetchSubscribers();
      fetchStats();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const exportSubscribers = () => {
    // Implementation for exporting subscribers list
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
        Newsletter Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">Total Subscribers</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              {totalSubscribers}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="h6">Active Subscribers</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              {activeSubscribers}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          sx={{ flexGrow: 1 }}
          variant="outlined"
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportSubscribers}
        >
          Export
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Preferences</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subscribed Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber._id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {subscriber.firstName} {subscriber.lastName}
                  </Typography>
                </TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>{subscriber.company || '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {subscriber.preferences.map((pref) => (
                      <Chip
                        key={pref}
                        label={pref}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={subscriber.isSubscribed}
                    onChange={(e) => handleSubscriptionToggle(subscriber._id, e.target.checked)}
                    color="primary"
                  />
                  <Chip
                    label={subscriber.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                    color={subscriber.isSubscribed ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(subscriber)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalSubscribers}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subscriber?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Newsletter; 