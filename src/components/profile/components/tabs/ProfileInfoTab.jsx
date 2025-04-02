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
  Chip,
  Skeleton,
  useTheme,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from 'framer-motion';

const ProfileInfoTab = ({ userData, setUserData, isEditing, loading }) => {
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
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
        </Stack>
      </Card>
    );
  }

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
          background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
        }}
      >
        <Typography variant="h5" fontWeight="medium">
          Personal Information
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          {isEditing
            ? 'Edit your personal details below'
            : 'View and manage your personal information'}
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {isEditing ? (
            // Edit Mode
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="First Name"
                  value={userData.firstName || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last Name"
                  value={userData.lastName || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  value={userData.email || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  fullWidth
                  required
                  type="email"
                  variant="outlined"
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone"
                  value={userData.phone || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Professional Title"
                  value={userData.position || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, position: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. Software Engineer, Marketing Manager"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company"
                  value={userData.company || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, company: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  value={userData.location || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, location: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. New York, USA"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Professional Bio"
                  value={userData.bio || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, bio: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Tell us about yourself, your experience, and your expertise"
                />
              </Grid>
            </>
          ) : (
            // View Mode
            <Grid item xs={12}>
              <Stack spacing={3}>
                {userData.position && (
                  <Box>
                    <Chip
                      icon={<WorkIcon />}
                      label={userData.position}
                      size="medium"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                )}

                {userData.bio ? (
                  <Box>
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                      {userData.bio}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No bio provided yet. Add a professional bio to tell others about yourself.
                    </Typography>
                  </Box>
                )}

                <Divider />

                <Grid container spacing={3}>
                  {userData.company && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WorkIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Company
                          </Typography>
                          <Typography variant="body1">{userData.company}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}

                  {userData.location && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="body1">{userData.location}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}

                  {userData.phone && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Phone
                          </Typography>
                          <Typography variant="body1">{userData.phone}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}

                  {userData.email && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1">{userData.email}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}
                </Grid>

                {!userData.company && !userData.location && !userData.phone && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No contact information provided yet. Add your details to help others connect with you.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoTab; 