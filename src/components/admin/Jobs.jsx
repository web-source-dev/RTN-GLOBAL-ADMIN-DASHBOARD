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
  MenuItem,
  Select,
  Grid,
  FormControl,
  InputLabel,
  useTheme,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import API from '../../BackendAPi/ApiProvider';
const statusColors = {
  'Pending': 'warning',
  'Reviewing': 'info',
  'Shortlisted': 'primary',
  'Interview': 'secondary',
  'Rejected': 'error',
  'Accepted': 'success',
};

const Jobs = () => {
  const theme = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [page, rowsPerPage, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        `/api/admin/jobs?page=${page + 1}&limit=${rowsPerPage}&status=${statusFilter}`
      );
      
      setApplications(response.data.applications || []);
      if (response.data.total) {
        setTotalCount(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  const handleStatusChange = async (applicationId, newStatus) => {
    if (newStatus === 'Interview') {
      setSelectedApplication(applications.find(app => app._id === applicationId));
      setInterviewDialogOpen(true);
      return;
    }

    try {
      await API.patch(`/api/admin/jobs/${applicationId}/status`, {
        status: newStatus 
      });
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleInterviewSubmit = async () => {
    try {
      await API.patch(`/api/admin/jobs/${selectedApplication._id}/status`, {
        status: 'Interview',
        interviewDetails: interviewData
      });
      setInterviewDialogOpen(false);
      setInterviewData({ date: '', time: '', notes: '' });
      fetchApplications();
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  const handleDeleteClick = (application) => {
    setSelectedApplication(application);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/admin/job-applications/${selectedApplication._id}`);
      fetchApplications();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting application:', error);
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
        Job Applications
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          sx={{ flexGrow: 1 }}
          variant="outlined"
          placeholder="Search applications..."
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            {Object.keys(statusColors).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application._id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {application.firstName} {application.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {application.email}
                  </Typography>
                </TableCell>
                <TableCell>{application.position}</TableCell>
                <TableCell>{application.department}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={application.applicationStatus}
                      onChange={(e) => handleStatusChange(application._id, e.target.value)}
                      sx={{ minWidth: 150 }}
                    >
                      {Object.keys(statusColors).map((status) => (
                        <MenuItem key={status} value={status}>
                          <Chip
                            label={status}
                            color={statusColors[status]}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  {new Date(application.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedApplication(application);
                      setViewDialogOpen(true);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                   color="info"
                    onClick={() => {
                      const downloadUrl = `${process.env.REACT_APP_API_URL}/${application.resume}`;
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `resume_${application.firstName}_${application.lastName}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(application)}
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
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this application?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedApplication.firstName} {selectedApplication.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedApplication.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{selectedApplication.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1">{selectedApplication.department}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Position
                  </Typography>
                  <Typography variant="body1">{selectedApplication.position}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Experience Level
                  </Typography>
                  <Typography variant="body1">{selectedApplication.experienceLevel}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Company
                  </Typography>
                  <Typography variant="body1">{selectedApplication.currentCompany || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    LinkedIn Profile
                  </Typography>
                  <Typography variant="body1">
                    {selectedApplication.linkedInProfile ? (
                      <a href={selectedApplication.linkedInProfile} target="_blank" rel="noopener noreferrer">
                        View Profile
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Portfolio URL
                  </Typography>
                  <Typography variant="body1">
                    {selectedApplication.portfolioUrl ? (
                      <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        View Portfolio
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cover Letter
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedApplication.coverLetter}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Willing to Relocate
                  </Typography>
                  <Typography variant="body1">
                    {selectedApplication.willingToRelocate ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Resume
                  </Typography>
                  <Box sx={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
                    <iframe
                      src={`${process.env.REACT_APP_API_URL}/${selectedApplication.resume}`}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title="Resume Preview"
                    />
                  </Box>
                  <Button
                    component={Link}
                    href={`${process.env.REACT_APP_API_URL}/${selectedApplication.resume}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<DownloadIcon />}
                    sx={{ mt: 2 }}
                  >
                    Download Resume
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Interview Scheduling Dialog */}
      <Dialog
        open={interviewDialogOpen}
        onClose={() => setInterviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={interviewData.date}
                  onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={interviewData.time}
                  onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={4}
                  value={interviewData.notes}
                  onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                  placeholder="Enter any additional information for the candidate..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInterviewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleInterviewSubmit} variant="contained" color="primary">
            Schedule Interview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Jobs;