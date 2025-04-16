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
  DialogContentText,
  DialogActions,
  Switch,
  FormControlLabel,
  Chip,
  FormGroup,
  Tooltip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  AddCircleOutline,
  Star as StarIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import API from '../../BackendAPi/ApiProvider';

const SubscriptionPlans = () => {
  const theme = useTheme();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [featureInput, setFeatureInput] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [],
    price: {
      monthly: 0,
      yearly: 0
    },
    billingCycles: ['monthly', 'yearly'],
    trialPeriodDays: 0,
    tier: 1,
    isActive: true,
    isPopular: false,
    isFeatured: false
  });

  useEffect(() => {
    fetchPlans();
  }, [page, rowsPerPage]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/admin/subscriptions/plans');
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openAddDialog = () => {
    setSelectedPlan(null);
    setFormData({
      name: '',
      description: '',
      features: [],
      price: {
        monthly: 0,
        yearly: 0
      },
      billingCycles: ['monthly', 'yearly'],
      trialPeriodDays: 0,
      tier: 1,
      isActive: true,
      isPopular: false,
      isFeatured: false
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const openEditDialog = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      features: [...plan.features],
      price: {
        monthly: plan.price.monthly,
        yearly: plan.price.yearly
      },
      billingCycles: [...plan.billingCycles],
      trialPeriodDays: plan.trialPeriodDays,
      tier: plan.tier,
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      isFeatured: plan.isFeatured
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setOpenDeleteDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleBillingCycleChange = (cycle) => {
    let newBillingCycles;
    
    if (formData.billingCycles.includes(cycle)) {
      // Remove if already exists and there's at least one left
      if (formData.billingCycles.length > 1) {
        newBillingCycles = formData.billingCycles.filter(c => c !== cycle);
      } else {
        return; // Don't allow removing the last billing cycle
      }
    } else {
      // Add if doesn't exist
      newBillingCycles = [...formData.billingCycles, cycle];
    }
    
    setFormData({
      ...formData,
      billingCycles: newBillingCycles
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    if (formData.price.monthly <= 0) errors['price.monthly'] = 'Monthly price must be greater than 0';
    if (formData.price.yearly <= 0) errors['price.yearly'] = 'Yearly price must be greater than 0';
    
    if (formData.tier <= 0) errors.tier = 'Tier must be greater than 0';
    
    if (formData.features.length === 0) errors.features = 'At least one feature is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePlan = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      if (selectedPlan) {
        // Update existing plan
        await API.put(`/api/admin/subscriptions/plans/${selectedPlan._id}`, formData);
      } else {
        // Create new plan
        await API.post('/api/admin/subscriptions/plans', formData);
      }
      
      fetchPlans();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving subscription plan:', error);
      // Add server validation errors if available
      if (error.response && error.response.data && error.response.data.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await API.delete(`/api/admin/subscriptions/plans/${selectedPlan._id}`);
      fetchPlans();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(search.toLowerCase()) || 
    plan.description.toLowerCase().includes(search.toLowerCase())
  );

  const calculateYearlyDiscount = (monthly, yearly) => {
    const monthlyAnnual = monthly * 12;
    if (monthlyAnnual <= 0 || yearly <= 0) return 0;
    
    const discount = ((monthlyAnnual - yearly) / monthlyAnnual) * 100;
    return Math.round(discount);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Subscription Plans
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<HelpIcon />}
            sx={{ borderRadius: 2, mr: 2 }}
            onClick={() => setOpenHelpDialog(true)}
          >
            How It Works
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
            onClick={openAddDialog}
          >
            Add Plan
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search plans..."
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
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price (Monthly)</TableCell>
              <TableCell>Price (Yearly)</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No subscription plans found</TableCell>
              </TableRow>
            ) : (
              filteredPlans
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plan) => (
                  <TableRow key={plan._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 500 }}>
                          {plan.name}
                        </Typography>
                        {plan.isPopular && (
                          <Chip
                            label="Popular"
                            color="primary"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                        {plan.isFeatured && (
                          <Chip
                            label="Featured"
                            color="secondary"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>${plan.price.monthly.toFixed(2)}</TableCell>
                    <TableCell>
                      ${plan.price.yearly.toFixed(2)}
                      {calculateYearlyDiscount(plan.price.monthly, plan.price.yearly) > 0 && (
                        <Chip
                          label={`${calculateYearlyDiscount(plan.price.monthly, plan.price.yearly)}% off`}
                          color="success"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {plan.features.length} features
                      <Tooltip title={plan.features.join(', ')}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{plan.tier}</TableCell>
                    <TableCell>
                      <Chip
                        label={plan.isActive ? 'Active' : 'Inactive'}
                        color={plan.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary"
                        onClick={() => openEditDialog(plan)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(plan)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredPlans.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Add/Edit Subscription Plan Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPlan ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Plan Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Tier Level"
                name="tier"
                type="number"
                value={formData.tier}
                onChange={handleInputChange}
                error={!!formErrors.tier}
                helperText={formErrors.tier}
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                multiline
                rows={2}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Monthly Price ($)"
                name="price.monthly"
                type="number"
                value={formData.price.monthly}
                onChange={handleInputChange}
                error={!!formErrors['price.monthly']}
                helperText={formErrors['price.monthly']}
                InputProps={{ 
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Yearly Price ($)"
                name="price.yearly"
                type="number"
                value={formData.price.yearly}
                onChange={handleInputChange}
                error={!!formErrors['price.yearly']}
                helperText={formErrors['price.yearly']}
                InputProps={{ 
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'info.light', 
                color: 'info.contrastText', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <InfoIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Stripe Product and Price IDs will be automatically created when you save this plan.
                  {selectedPlan && ' Updating prices will create new Stripe Price IDs and archive the old ones.'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Trial Period (Days)"
                name="trialPeriodDays"
                type="number"
                value={formData.trialPeriodDays}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Billing Cycles:
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.billingCycles.includes('monthly')}
                        onChange={() => handleBillingCycleChange('monthly')}
                        color="primary"
                      />
                    }
                    label="Monthly"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.billingCycles.includes('yearly')}
                        onChange={() => handleBillingCycleChange('yearly')}
                        color="primary"
                      />
                    }
                    label="Yearly"
                  />
                </FormGroup>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Plan Features</Typography>
              {formErrors.features && (
                <Typography color="error" variant="caption">
                  {formErrors.features}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', mt: 2, mb: 1 }}>
                <TextField
                  fullWidth
                  label="Add Feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button 
                  variant="contained"
                  onClick={addFeature}
                  startIcon={<AddCircleOutline />}
                  sx={{ ml: 1 }}
                >
                  Add
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                <List dense>
                  {formData.features.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No features added yet" />
                    </ListItem>
                  ) : (
                    formData.features.map((feature, index) => (
                      <ListItem key={index}>
                        <CheckIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                        <ListItemText primary={feature} />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => removeFeature(index)}
                            size="small"
                            color="error"
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Plan Status</Typography>
              <FormGroup row sx={{ mt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleSwitchChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPopular}
                      onChange={handleSwitchChange}
                      name="isPopular"
                      color="primary"
                    />
                  }
                  label="Popular"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleSwitchChange}
                      name="isFeatured"
                      color="primary"
                    />
                  }
                  label="Featured"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSavePlan} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Plan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the "{selectedPlan?.name}" subscription plan?
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            Warning: This action cannot be undone. Users with active subscriptions to this plan may be affected.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <Dialog
        open={openHelpDialog}
        onClose={() => setOpenHelpDialog(false)}
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <HelpIcon sx={{ mr: 1 }} color="primary" />
            How Subscription Plans Work
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography variant="h6" gutterBottom color="primary">
              Automatic Stripe Integration
            </Typography>
            <Typography paragraph>
              When you create or update a subscription plan, the system automatically:
            </Typography>
            <List dense>
              <ListItem>
                <CheckIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                <ListItemText primary="Creates a Stripe Product with the plan name and description" />
              </ListItem>
              <ListItem>
                <CheckIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                <ListItemText primary="Creates a Monthly Price in Stripe with the specified monthly amount" />
              </ListItem>
              <ListItem>
                <CheckIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                <ListItemText primary="Creates a Yearly Price in Stripe with the specified yearly amount" />
              </ListItem>
              <ListItem>
                <CheckIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                <ListItemText primary="Stores the Stripe IDs so they can be used for customer subscriptions" />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              Updating Plans
            </Typography>
            <Typography paragraph>
              When you update a subscription plan:
            </Typography>
            <List dense>
              <ListItem>
                <InfoIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                <ListItemText primary="The Stripe Product details are updated (name, description)" />
              </ListItem>
              <ListItem>
                <InfoIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                <ListItemText primary="If you change the price, new Stripe Price IDs are created (Stripe doesn't allow modifying existing prices)" />
              </ListItem>
              <ListItem>
                <InfoIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                <ListItemText primary="Old prices are archived in Stripe but remain associated with existing subscriptions" />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              Deleting Plans
            </Typography>
            <Typography paragraph>
              When you delete a subscription plan:
            </Typography>
            <List dense>
              <ListItem>
                <InfoIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                <ListItemText primary="You cannot delete plans that have active subscriptions" />
              </ListItem>
              <ListItem>
                <InfoIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                <ListItemText primary="The Stripe Product and Prices are archived (not deleted) in Stripe" />
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHelpDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPlans; 