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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import API from '../../BackendAPi/ApiProvider';

const priorityColors = {
  'Low': 'info',
  'Medium': 'warning',
  'High': 'error',
  'Critical': 'error'
};

const statusColors = {
  'Open': 'error',
  'In Progress': 'warning',
  'Resolved': 'success',
  'Closed': 'default'
};

const Support = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [page, rowsPerPage, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      const response = await API.get(
        `/api/admin/support?page=${page + 1}&limit=${rowsPerPage}&status=${statusFilter}&priority=${priorityFilter}`
      );
      const data = response.data;
      setTickets(data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await API.patch(
        `/api/admin/support/${ticketId}/status`,
        { status: newStatus }
      );

      if (!response.data) {
        throw new Error('Failed to update ticket status');
      }

      fetchTickets();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update ticket status');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/api/admin/support/${selectedTicket._id}`);

      if (!response.data) {
        throw new Error('Failed to delete ticket');
      }

      setDeleteDialogOpen(false);
      setSelectedTicket(null);
      fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setError('Failed to delete ticket');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Support Tickets
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          sx={{ flexGrow: 1 }}
          placeholder="Search tickets..."
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
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            label="Priority"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.ticketNumber}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority}
                    color={priorityColors[ticket.priority]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setViewDialogOpen(true);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setDeleteDialogOpen(true);
                    }}
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
          count={100}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* View Ticket Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTicket && (
          <>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Ticket Number</Typography>
                  <Typography variant="h6">{selectedTicket.ticketNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedTicket.status}
                    color={statusColors[selectedTicket.status]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Priority</Typography>
                  <Chip
                    label={selectedTicket.priority}
                    color={priorityColors[selectedTicket.priority]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Category</Typography>
                  <Typography>{selectedTicket.issueCategory}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Subject</Typography>
                  <Typography>{selectedTicket.subject}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Description</Typography>
                  <Typography>{selectedTicket.description}</Typography>
                </Grid>
                {selectedTicket.attachments && (
                  <Grid item xs={12}>
                    <Typography color="text.secondary">Attachment</Typography>
                    <Button
                      href={`${process.env.REACT_APP_API_URL}/${selectedTicket.attachments}`}
                      target="_blank"
                      variant="outlined"
                      size="small"
                    >
                      View Attachment
                    </Button>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete ticket {selectedTicket?.ticketNumber}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Support;