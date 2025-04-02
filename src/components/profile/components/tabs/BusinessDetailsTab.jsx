import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Stack,
  Divider,
  Skeleton,
  useTheme,
  Chip,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { motion } from 'framer-motion';

const BusinessDetailsTab = ({ userData, setUserData, isEditing, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 2,
          height: '100%',
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="text" height={40} width="50%" />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
        </Stack>
      </Card>
    );
  }

  // Initialize businessDetails if it doesn't exist
  const businessDetails = userData.businessDetails || {};
  const businessAddress = businessDetails.businessAddress || {};

  const handleBusinessDetailsChange = (field, value) => {
    setUserData({
      ...userData,
      businessDetails: {
        ...businessDetails,
        [field]: value,
      },
    });
  };

  const handleAddressChange = (field, value) => {
    setUserData({
      ...userData,
      businessDetails: {
        ...businessDetails,
        businessAddress: {
          ...businessAddress,
          [field]: value,
        },
      },
    });
  };

  const formatAddress = () => {
    if (!businessAddress) return '';
    
    return Object.values(businessAddress)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={0}
      sx={{
        borderRadius: 2,
        p: 0,
        overflow: 'hidden',
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.dark})`,
          color: 'white',
        }}
      >
        <Typography variant="h5" fontWeight="medium">
          Business Information
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          {isEditing
            ? 'Edit your business details below'
            : 'View and manage your business information'}
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {isEditing ? (
          // Edit Mode
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Business Name"
                value={businessDetails.businessName || ''}
                onChange={(e) => handleBusinessDetailsChange('businessName', e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Business Type"
                value={businessDetails.businessType || ''}
                onChange={(e) => handleBusinessDetailsChange('businessType', e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Registration Number"
                value={businessDetails.registrationNumber || ''}
                onChange={(e) => handleBusinessDetailsChange('registrationNumber', e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tax Number"
                value={businessDetails.taxNumber || ''}
                onChange={(e) => handleBusinessDetailsChange('taxNumber', e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, mt: 1 }}>
                Business Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Street Address"
                    value={businessAddress.street || ''}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="City"
                    value={businessAddress.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="State/Province"
                    value={businessAddress.state || ''}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="ZIP/Postal Code"
                    value={businessAddress.zipCode || ''}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Country"
                    value={businessAddress.country || ''}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Business Phone"
                value={businessDetails.businessPhone || ''}
                onChange={(e) => handleBusinessDetailsChange('businessPhone', e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Business Email"
                value={businessDetails.businessEmail || ''}
                onChange={(e) => handleBusinessDetailsChange('businessEmail', e.target.value)}
                fullWidth
                variant="outlined"
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Industry"
                value={businessDetails.industry || ''}
                onChange={(e) => handleBusinessDetailsChange('industry', e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Year Established"
                value={businessDetails.yearEstablished || ''}
                onChange={(e) => handleBusinessDetailsChange('yearEstablished', e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
          </Grid>
        ) : (
          // View Mode
          <Stack spacing={3}>
            {businessDetails.businessName ? (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon color="primary" fontSize="large" />
                  <Typography variant="h5" color="primary.main">
                    {businessDetails.businessName}
                  </Typography>
                </Stack>
                {businessDetails.businessType && (
                  <Chip
                    icon={<CategoryIcon />}
                    label={businessDetails.businessType}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 1,
                  textAlign: 'center',
                }}
              >
                <BusinessIcon color="action" fontSize="large" />
                <Typography variant="body2" color="text.secondary">
                  No business information added yet. 
                  Add your business details to showcase your company information.
                </Typography>
              </Box>
            )}

            {(businessDetails.registrationNumber || businessDetails.taxNumber) && (
              <>
                <Divider />
                <Grid container spacing={3}>
                  {businessDetails.registrationNumber && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ReceiptIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Registration Number
                          </Typography>
                          <Typography variant="body1">
                            {businessDetails.registrationNumber}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}

                  {businessDetails.taxNumber && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ReceiptIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Tax Number
                          </Typography>
                          <Typography variant="body1">{businessDetails.taxNumber}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {formatAddress() && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Business Address
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
                    <Typography variant="body1">{formatAddress()}</Typography>
                  </Stack>
                </Box>
              </>
            )}

            {(businessDetails.businessPhone || businessDetails.businessEmail) && (
              <>
                <Divider />
                <Grid container spacing={3}>
                  {businessDetails.businessPhone && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Business Phone
                          </Typography>
                          <Typography variant="body1">{businessDetails.businessPhone}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}

                  {businessDetails.businessEmail && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Business Email
                          </Typography>
                          <Typography variant="body1">{businessDetails.businessEmail}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </>
            )}

            {(businessDetails.industry || businessDetails.yearEstablished) && (
              <>
                <Divider />
                <Grid container spacing={3}>
                  {businessDetails.industry && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CategoryIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Industry
                          </Typography>
                          <Typography variant="body1">{businessDetails.industry}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}

                  {businessDetails.yearEstablished && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarTodayIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Year Established
                          </Typography>
                          <Typography variant="body1">{businessDetails.yearEstablished}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessDetailsTab; 