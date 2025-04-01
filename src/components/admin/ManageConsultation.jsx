import React, { useState, useEffect } from 'react';
import API from '../../BackendAPi/ApiProvider';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Check as CheckIcon,
  Cancel as CancelIcon,
  Link as LinkIcon,
  Payment as PaymentIcon,
  VideoCall as VideoCallIcon,
  CloudDownload as CloudDownloadIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const ManageConsultation = () => {
  const [consultations, setConsultations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [paymentLink, setPaymentLink] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [linksUpdating, setLinksUpdating] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/admin/consultations');
      setConsultations(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch consultations', error);
      setError('Failed to load consultations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/api/admin/consultations/${id}`, { status: newStatus });
      fetchConsultations();
    } catch (error) {
      console.error('Failed to update consultation status', error);
      setError('Failed to update status. Please try again.');
    }
  };

  const handleOpenDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setPaymentLink(consultation.paymentLink || '');
    setMeetingLink(consultation.meetingLink || '');
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedConsultation(null);
    setPaymentLink('');
    setMeetingLink('');
  };

  const updateConsultationLinks = async () => {
    if (!selectedConsultation) return;
    
    try {
      setLinksUpdating(true);
      await API.put(`/api/admin/consultations/${selectedConsultation._id}`, {
        paymentLink,
        meetingLink
      });
      
      // Update the consultation in state
      setConsultations(prev => 
        prev.map(c => 
          c._id === selectedConsultation._id 
            ? { ...c, paymentLink, meetingLink } 
            : c
        )
      );
      
      setError('');
      handleCloseDetails();
    } catch (error) {
      console.error('Failed to update links', error);
      setError('Failed to update links. Please try again.');
    } finally {
      setLinksUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      completed: 'primary',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const filteredConsultations = consultations.filter((consultation) =>
    filter === 'all' ? true : consultation.status === filter
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading consultations...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Consultation Requests
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="all">All Requests</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConsultations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No consultation requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredConsultations.map((consultation) => (
              <TableRow key={consultation._id}>
                <TableCell>{`${consultation.firstName} ${consultation.lastName}`}</TableCell>
                <TableCell>{consultation.email}</TableCell>
                <TableCell>{consultation.consultationType}</TableCell>
                  <TableCell>
                    {new Date(consultation.preferredDate).toLocaleDateString()} at {consultation.preferredTime}
                    <Typography variant="caption" display="block">
                      {consultation.duration} minutes
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={consultation.status}
                      color={getStatusColor(consultation.status)}
                    />
                  </TableCell>
                <TableCell>
                    {consultation.isFirstConsultation ? (
                      <Chip label="Free" color="success" size="small" />
                    ) : (
                      <Box>
                        <Chip 
                          label={consultation.paymentCompleted ? "Paid" : "Pending"} 
                          color={consultation.paymentCompleted ? "success" : "warning"} 
                          size="small" 
                        />
                        <Typography variant="caption" display="block">
                          ${consultation.estimatedPrice}
                        </Typography>
                      </Box>
                    )}
                </TableCell>
                <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Manage Details">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDetails(consultation)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                  {consultation.status === 'pending' && (
                    <>
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                        color="success"
                        onClick={() => handleStatusUpdate(consultation._id, 'confirmed')}
                      >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Decline">
                            <IconButton
                              size="small"
                        color="error"
                        onClick={() => handleStatusUpdate(consultation._id, 'cancelled')}
                      >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                    </>
                  )}
                      
                  {consultation.status === 'confirmed' && (
                        <Tooltip title="Mark as Completed">
                          <IconButton
                            size="small"
                      color="primary"
                      onClick={() => handleStatusUpdate(consultation._id, 'completed')}
                    >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                  )}
                    </Box>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Consultation Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >
        {selectedConsultation && (
          <>
            <DialogTitle>
              Consultation Details
              {selectedConsultation.isFirstConsultation ? (
                <Chip 
                  label="Free Consultation" 
                  color="success" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              ) : (
                <Chip 
                  label={`Paid ($${selectedConsultation.estimatedPrice})`} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Client Information
                      </Typography>
                      <Typography><strong>Name:</strong> {selectedConsultation.firstName} {selectedConsultation.lastName}</Typography>
                      <Typography><strong>Email:</strong> {selectedConsultation.email}</Typography>
                      <Typography><strong>Phone:</strong> {selectedConsultation.phone}</Typography>
                      <Typography><strong>Company:</strong> {selectedConsultation.companyName || 'N/A'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Consultation Details
                      </Typography>
                      <Typography><strong>Type:</strong> {selectedConsultation.consultationType}</Typography>
                      <Typography><strong>Date:</strong> {new Date(selectedConsultation.preferredDate).toLocaleDateString()}</Typography>
                      <Typography><strong>Time:</strong> {selectedConsultation.preferredTime}</Typography>
                      <Typography><strong>Duration:</strong> {selectedConsultation.duration} minutes</Typography>
                      <Typography><strong>Status:</strong> {selectedConsultation.status}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {!selectedConsultation.isFirstConsultation && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Payment Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography><strong>Price:</strong> ${selectedConsultation.estimatedPrice}</Typography>
                            <Typography><strong>Payment Status:</strong> {selectedConsultation.paymentCompleted ? 'Paid' : 'Pending'}</Typography>
                            {selectedConsultation.paymentCompleted && selectedConsultation.paymentDate && (
                              <Typography><strong>Payment Date:</strong> {new Date(selectedConsultation.paymentDate).toLocaleString()}</Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            {selectedConsultation.invoicePath && (
                              <Button
                                variant="outlined"
                                startIcon={<CloudDownloadIcon />}
                                component="a"
                                href= {`${process.env.REACT_APP_API_URL}${selectedConsultation.invoicePath}`}
                                target="_blank"
                              >
                                View Invoice
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Management Links
                      </Typography>
                      <TextField
                        fullWidth
                        label="Payment Link"
                        value={paymentLink}
                        onChange={(e) => setPaymentLink(e.target.value)}
                        margin="normal"
                        placeholder="https://payment-gateway.com/your-payment-link"
                        disabled={selectedConsultation.isFirstConsultation || selectedConsultation.paymentCompleted}
                        helperText={selectedConsultation.isFirstConsultation ? "Free consultation - no payment required" : ""}
                        InputProps={{
                          startAdornment: <PaymentIcon color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Meeting Link"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        margin="normal"
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        InputProps={{
                          startAdornment: <VideoCallIcon color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                      
                      <Alert severity="info" sx={{ mt: 2 }}>
                        The meeting link will only be shown to the client after payment has been completed 
                        (or immediately for free consultations).
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
                
                {selectedConsultation.message && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Client Message
                        </Typography>
                        <Typography variant="body2">
                          {selectedConsultation.message}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {selectedConsultation.paymentCompleted && selectedConsultation.paymentReceiptPath && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Payment Receipt
                        </Typography>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CloudDownloadIcon />}
                          component="a"
                          href={`${process.env.REACT_APP_API_URL}${selectedConsultation.paymentReceiptPath}`}
                          target="_blank"
                          sx={{ mt: 1, ml: 1 }}
                        >
                          View Receipt
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>
                Cancel
              </Button>
              <Button 
                onClick={updateConsultationLinks}
                variant="contained"
                disabled={linksUpdating}
                startIcon={linksUpdating ? <CircularProgress size={20} /> : <LinkIcon />}
              >
                Update Links
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ManageConsultation;
