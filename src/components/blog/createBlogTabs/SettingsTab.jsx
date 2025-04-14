import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Grid,
  Paper,
  useTheme,
  RadioGroup,
  Radio,
  FormLabel,
  InputAdornment,
} from '@mui/material';
import { 
  Settings, 
  Schedule, 
  Language, 
  History,
  CalendarMonth,
  AccessTime
} from '@mui/icons-material';

const SettingsTab = ({
  isActive,
  setIsActive,
  status,
  setStatus,
  language,
  setLanguage,
  scheduledFor,
  setScheduledFor,
  revisions,
  wordCount,
  estimatedReadTime,
}) => {
  const theme = useTheme();
  
  // Format date for the datetime-local input
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };
  
  // Handle schedule date change
  const handleScheduleChange = (e) => {
    setScheduledFor(e.target.value ? new Date(e.target.value) : null);
  };
  
  return (
    <Box>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Settings fontSize="small" />
        Advanced Settings
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 3 }}>
              Publishing Settings
            </Typography>
            
            {/* Status Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ mb: 1, color: theme.palette.text.primary }}>Status</FormLabel>
              <RadioGroup
                row
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <FormControlLabel 
                  value="draft" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Draft
                      <Chip 
                        label="WIP" 
                        size="small" 
                        sx={{ 
                          ml: 1, 
                          bgcolor: theme.palette.grey[500],
                          color: 'white',
                          height: 20,
                          fontSize: '0.625rem'
                        }} 
                      />
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="published" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Published
                      <Chip 
                        label="LIVE" 
                        size="small" 
                        sx={{ 
                          ml: 1, 
                          bgcolor: theme.palette.success.main,
                          color: 'white',
                          height: 20,
                          fontSize: '0.625rem'
                        }} 
                      />
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="archived" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Archived
                      <Chip 
                        label="HIDDEN" 
                        size="small" 
                        sx={{ 
                          ml: 1, 
                          bgcolor: theme.palette.grey[700],
                          color: 'white',
                          height: 20,
                          fontSize: '0.625rem'
                        }} 
                      />
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>
            
            {/* Active/Inactive Switch */}
            <Box 
              sx={{ 
                mb: 3, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderRadius: '10px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isActive ? 
                  theme.palette.mode === 'dark' ? 'rgba(46, 125, 50, 0.08)' : 'rgba(46, 125, 50, 0.05)' 
                  : 'transparent'
              }}
            >
              <Box>
                <Typography variant="subtitle2">Active Status</Typography>
                <Typography variant="body2" color="text.secondary">
                  {isActive ? 'Post is visible to visitors' : 'Post is hidden from visitors'}
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="success"
                  />
                }
                label=""
              />
            </Box>
            
            {/* Scheduling */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <Schedule fontSize="small" />
                Schedule Publication
              </Typography>
              
              <TextField
                label="Publish Date & Time"
                type="datetime-local"
                value={formatDateForInput(scheduledFor)}
                onChange={handleScheduleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                If set, the post will automatically change to published status at the specified time.
              </Typography>
            </Box>
            
            {/* Language Selector */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="language-label">Language</InputLabel>
              <Select
                labelId="language-label"
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
                sx={{
                  borderRadius: '10px',
                }}
                startAdornment={<Language sx={{ mr: 1, ml: -0.5, color: 'action.active' }} />}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="ar">Arabic</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <History fontSize="small" />
              Content Statistics & History
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 3, 
                mb: 3,
                p: 2,
                borderRadius: '10px',
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)'
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>Word Count</span>
                </Typography>
                <Typography variant="h5" fontWeight={500}>{wordCount}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime fontSize="inherit" />
                  <span>Read Time</span>
                </Typography>
                <Typography variant="h5" fontWeight={500}>
                  {estimatedReadTime} {estimatedReadTime === 1 ? 'min' : 'mins'}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2 }}>
              Revision History
            </Typography>
            
            {revisions && revisions.length > 0 ? (
              <Box>
                {revisions.map((revision, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      borderRadius: '10px',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">
                        {new Date(revision.updatedAt).toLocaleString()}
                      </Typography>
                      <Chip 
                        label={`Rev ${index + 1}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Updated by: {
                        revision?.updatedBy?.firstName
                          ? `${revision.updatedBy.firstName} ${revision.updatedBy.lastName || ''}`
                          : revision?.updatedBy?.name 
                            ? revision.updatedBy.name
                            : 'Unknown user'
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {revision.changes}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No revision history available yet. Revision tracking starts after the first save.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsTab; 