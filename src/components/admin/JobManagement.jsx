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
  FormControl,
  InputLabel,
  Grid,
  useTheme,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Stack,
  FormControlLabel,
  Switch,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  PersonAdd as ApplicationsIcon,
  FeaturedPlayList as FeaturedIcon,
} from '@mui/icons-material';
import API from '../../BackendAPi/ApiProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import JobDetails from './JobDetails';
import { useSnackbar } from 'notistack';

const statusColors = {
  'Draft': 'default',
  'Published': 'success',
  'Closed': 'error',
};

const JobManagement = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [page, rowsPerPage, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        `/api/admin/jobs/postings?page=${page + 1}&limit=${rowsPerPage}&status=${statusFilter}`
      );
      
      setJobs(response.data.jobs || []);
      if (response.data.total) {
        setTotalCount(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      enqueueSnackbar('Failed to load job postings', { variant: 'error' });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const jobSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    department: Yup.string().required('Department is required'),
    location: Yup.string().required('Location is required'),
    type: Yup.string().required('Job type is required'),
    experienceLevel: Yup.string().required('Experience level is required'),
    description: Yup.string().required('Description is required').min(100, 'Description must be at least 100 characters'),
    responsibilities: Yup.array().of(Yup.string()),
    requirements: Yup.array().of(Yup.string()),
    benefits: Yup.array().of(Yup.string()),
    status: Yup.string().required('Status is required'),
    featured: Yup.boolean(),
    salary: Yup.object().shape({
      min: Yup.number().nullable(),
      max: Yup.number().nullable(),
      currency: Yup.string(),
      displaySalary: Yup.boolean(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experienceLevel: 'Mid Level',
      description: '',
      responsibilities: [''],
      requirements: [''],
      benefits: [''],
      status: 'Draft',
      featured: false,
      salary: {
        min: '',
        max: '',
        currency: 'USD',
        displaySalary: false,
      },
    },
    validationSchema: jobSchema,
    onSubmit: async (values) => {
      try {
        // Clean up empty array entries
        const cleanedValues = {
          ...values,
          responsibilities: values.responsibilities.filter(item => item.trim() !== ''),
          requirements: values.requirements.filter(item => item.trim() !== ''),
          benefits: values.benefits.filter(item => item.trim() !== ''),
          salary: {
            ...values.salary,
            min: values.salary.min ? Number(values.salary.min) : null,
            max: values.salary.max ? Number(values.salary.max) : null,
          }
        };

        if (isEditMode) {
          await API.put(`/api/admin/jobs/postings/${selectedJob._id}`, cleanedValues);
          enqueueSnackbar('Job posting updated successfully', { variant: 'success' });
        } else {
          await API.post('/api/admin/jobs/postings', cleanedValues);
          enqueueSnackbar('Job posting created successfully', { variant: 'success' });
        }
        setDialogOpen(false);
        fetchJobs();
      } catch (error) {
        console.error('Error saving job:', error);
        enqueueSnackbar(`Failed to ${isEditMode ? 'update' : 'create'} job posting`, { variant: 'error' });
      }
    },
  });

  const handleAddArrayField = (fieldName) => {
    formik.setFieldValue(fieldName, [...formik.values[fieldName], '']);
  };

  const handleRemoveArrayField = (fieldName, index) => {
    const newArray = [...formik.values[fieldName]];
    newArray.splice(index, 1);
    formik.setFieldValue(fieldName, newArray);
  };

  const handleArrayFieldChange = (fieldName, index, value) => {
    const newArray = [...formik.values[fieldName]];
    newArray[index] = value;
    formik.setFieldValue(fieldName, newArray);
  };

  const handleCreateClick = () => {
    setIsEditMode(false);
    formik.resetForm();
    setDialogOpen(true);
  };

  const handleEditClick = (job) => {
    setIsEditMode(true);
    setSelectedJob(job);
    
    // Prepare job data for the form
    const jobData = {
      ...job,
      responsibilities: job.responsibilities?.length > 0 ? job.responsibilities : [''],
      requirements: job.requirements?.length > 0 ? job.requirements : [''],
      benefits: job.benefits?.length > 0 ? job.benefits : [''],
      salary: {
        min: job.salary?.min || '',
        max: job.salary?.max || '',
        currency: job.salary?.currency || 'USD',
        displaySalary: job.salary?.displaySalary || false,
      }
    };
    
    formik.setValues(jobData);
    setDialogOpen(true);
  };

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/admin/jobs/postings/${selectedJob._id}`);
      enqueueSnackbar('Job posting deleted successfully', { variant: 'success' });
      fetchJobs();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting job:', error);
      enqueueSnackbar('Failed to delete job posting', { variant: 'error' });
    }
  };

  const handleViewClick = (job) => {
    setSelectedJob(job);
    setViewDialogOpen(true);
  };

  const handleViewApplicationsClick = (jobId) => {
    // Navigate to applications filtered by this job
    window.location.href = `/admin/applications?jobId=${jobId}`;
  };

  const handleToggleFeatured = async (job) => {
    try {
      await API.put(`/api/admin/jobs/postings/${job._id}`, {
        ...job,
        featured: !job.featured
      });
      fetchJobs();
    } catch (error) {
      console.error('Error updating job featured status:', error);
      enqueueSnackbar('Failed to update job featured status', { variant: 'error' });
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.department.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Job Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Create Job Posting
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Jobs" />
        <Tab label="Published" />
        <Tab label="Drafts" />
        <Tab label="Closed" />
      </Tabs>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          sx={{ flexGrow: 1 }}
          variant="outlined"
          placeholder="Search job postings..."
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applications</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {job.title}
                  </Typography>
                </TableCell>
                <TableCell>{job.department}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>
                  <Chip
                    label={job.status}
                    color={statusColors[job.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{job.applicationCount || 0}</TableCell>
                <TableCell>
                  <Switch
                    checked={job.featured || false}
                    onChange={() => handleToggleFeatured(job)}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewClick(job)}
                    title="View Job Details"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => handleViewApplicationsClick(job._id)}
                    title="View Applications"
                  >
                    <ApplicationsIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditClick(job)}
                    title="Edit Job"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(job)}
                    title="Delete Job"
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

      {/* View Job Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {selectedJob && <JobDetails job={selectedJob} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setViewDialogOpen(false);
              handleEditClick(selectedJob);
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Job Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{isEditMode ? 'Edit Job Posting' : 'Create Job Posting'}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Job Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="department"
                    label="Department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    error={formik.touched.department && Boolean(formik.errors.department)}
                    helperText={formik.touched.department && formik.errors.department}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="location"
                    label="Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      label="Job Type"
                    >
                      <MenuItem value="Full-time">Full-time</MenuItem>
                      <MenuItem value="Part-time">Part-time</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                      <MenuItem value="Remote">Remote</MenuItem>
                      <MenuItem value="Internship">Internship</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Experience Level</InputLabel>
                    <Select
                      name="experienceLevel"
                      value={formik.values.experienceLevel}
                      onChange={formik.handleChange}
                      label="Experience Level"
                    >
                      <MenuItem value="Entry Level">Entry Level</MenuItem>
                      <MenuItem value="Mid Level">Mid Level</MenuItem>
                      <MenuItem value="Senior">Senior</MenuItem>
                      <MenuItem value="Lead">Lead</MenuItem>
                      <MenuItem value="Executive">Executive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Salary Information (Optional)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="salary.min"
                        label="Minimum Salary"
                        type="number"
                        value={formik.values.salary.min}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="salary.max"
                        label="Maximum Salary"
                        type="number"
                        value={formik.values.salary.max}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          name="salary.currency"
                          value={formik.values.salary.currency}
                          onChange={formik.handleChange}
                          label="Currency"
                        >
                          <MenuItem value="USD">USD</MenuItem>
                          <MenuItem value="EUR">EUR</MenuItem>
                          <MenuItem value="GBP">GBP</MenuItem>
                          <MenuItem value="CAD">CAD</MenuItem>
                          <MenuItem value="AUD">AUD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="salary.displaySalary"
                            checked={formik.values.salary.displaySalary}
                            onChange={formik.handleChange}
                          />
                        }
                        label="Display salary range publicly"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Job Description"
                    multiline
                    rows={6}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Responsibilities
                  </Typography>
                  {formik.values.responsibilities.map((responsibility, index) => (
                    <Stack direction="row" spacing={1} key={index} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        value={responsibility}
                        onChange={(e) => handleArrayFieldChange('responsibilities', index, e.target.value)}
                        placeholder={`Responsibility ${index + 1}`}
                      />
                      {formik.values.responsibilities.length > 1 && (
                        <Button 
                          variant="outlined" 
                          color="error" 
                          onClick={() => handleRemoveArrayField('responsibilities', index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                  ))}
                  <Button 
                    variant="outlined" 
                    onClick={() => handleAddArrayField('responsibilities')}
                  >
                    Add Responsibility
                  </Button>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Requirements
                  </Typography>
                  {formik.values.requirements.map((requirement, index) => (
                    <Stack direction="row" spacing={1} key={index} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        value={requirement}
                        onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                        placeholder={`Requirement ${index + 1}`}
                      />
                      {formik.values.requirements.length > 1 && (
                        <Button 
                          variant="outlined" 
                          color="error" 
                          onClick={() => handleRemoveArrayField('requirements', index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                  ))}
                  <Button 
                    variant="outlined" 
                    onClick={() => handleAddArrayField('requirements')}
                  >
                    Add Requirement
                  </Button>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Benefits
                  </Typography>
                  {formik.values.benefits.map((benefit, index) => (
                    <Stack direction="row" spacing={1} key={index} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        value={benefit}
                        onChange={(e) => handleArrayFieldChange('benefits', index, e.target.value)}
                        placeholder={`Benefit ${index + 1}`}
                      />
                      {formik.values.benefits.length > 1 && (
                        <Button 
                          variant="outlined" 
                          color="error" 
                          onClick={() => handleRemoveArrayField('benefits', index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                  ))}
                  <Button 
                    variant="outlined" 
                    onClick={() => handleAddArrayField('benefits')}
                  >
                    Add Benefit
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      label="Status"
                    >
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Published">Published</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="featured"
                        checked={formik.values.featured}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Featured Job (will appear at the top of job listings)"
                  />
                </Grid>
                
                {formik.values.status === 'Published' && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      This job will be publicly visible on the careers page once saved with 'Published' status.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? 'Save Changes' : 'Create Job'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <>
              <Typography gutterBottom>
                Are you sure you want to delete the job posting "{selectedJob.title}"?
              </Typography>
              {selectedJob.applicationCount > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This job has {selectedJob.applicationCount} applications. Deleting it will remove all associated applications.
                </Alert>
              )}
            </>
          )}
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

export default JobManagement;