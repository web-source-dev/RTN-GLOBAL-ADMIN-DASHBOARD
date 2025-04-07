import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Timeline as ExperienceIcon,
  AttachMoney as SalaryIcon,
  DateRange as DateIcon,
  AssignmentTurnedIn as ResponsibilityIcon,
  Assignment as RequirementIcon,
  CardGiftcard as BenefitIcon,
} from '@mui/icons-material';

const JobDetails = ({ job }) => {
  if (!job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const statusColors = {
    'Draft': 'default',
    'Published': 'success',
    'Closed': 'error',
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {job.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<WorkIcon />} 
              label={job.type} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              icon={<LocationIcon />} 
              label={job.location} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              icon={<ExperienceIcon />} 
              label={job.experienceLevel} 
              size="small" 
              variant="outlined" 
            />
          </Box>
        </Box>
        <Box>
          <Chip 
            label={job.status} 
            color={statusColors[job.status]} 
            sx={{ ml: 1 }}
          />
          {job.featured && <Chip label="Featured" color="primary" sx={{ ml: 1 }} />}
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Department
          </Typography>
          <Typography variant="body1">{job.department}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Applications
          </Typography>
          <Typography variant="body1">{job.applicationCount || 0}</Typography>
        </Grid>
        {job.salary && job.salary.min && job.salary.max && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Salary Range
            </Typography>
            <Typography variant="body1">
              {`${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`}
              {job.salary.displaySalary ? ' (Public)' : ' (Private)'}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Created
          </Typography>
          <Typography variant="body1">{formatDate(job.createdAt)}</Typography>
        </Grid>
        {job.publishedAt && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Published
            </Typography>
            <Typography variant="body1">{formatDate(job.publishedAt)}</Typography>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Job Description
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
        {job.description}
      </Typography>

      {job.responsibilities && job.responsibilities.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Responsibilities
          </Typography>
          <List dense>
            {job.responsibilities.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <ResponsibilityIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {job.requirements && job.requirements.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Requirements
          </Typography>
          <List dense>
            {job.requirements.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <RequirementIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {job.benefits && job.benefits.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Benefits
          </Typography>
          <List dense>
            {job.benefits.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <BenefitIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" color="text.secondary">
        Job URL
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
        {`${window.location.origin}/careers/jobs/${job.slug}`}
      </Typography>
    </Box>
  );
};

export default JobDetails; 