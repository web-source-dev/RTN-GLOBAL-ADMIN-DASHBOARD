import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useTheme,
  Grid,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Warning,
  Error,
  Info,
  TipsAndUpdates,
  Share,
} from '@mui/icons-material';

const SeoScoreDisplay = ({ seoAnalysis }) => {
  const theme = useTheme();
  
  if (!seoAnalysis) {
    return null;
  }
  
  const { score, socialScore, rating, feedback, recommendations } = seoAnalysis;
  
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 70) return theme.palette.success.light;
    if (score >= 50) return '#FFA726'; // Orange
    if (score >= 30) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  const scoreColor = getScoreColor(score);
  const socialScoreColor = getScoreColor(socialScore || 0);
  
  // Render icon based on feedback type
  const getFeedbackIcon = (text) => {
    if (text.toLowerCase().includes('missing') || text.toLowerCase().includes('too short')) {
      return <Error color="error" />;
    }
    if (text.toLowerCase().includes('warning') || text.toLowerCase().includes('too long')) {
      return <Warning color="warning" />;
    }
    if (text.toLowerCase().includes('good')) {
      return <CheckCircle color="success" />;
    }
    return <Info color="info" />;
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Overall SEO Score */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  SEO Score: {score}%
                </Typography>
                <Chip
                  label={rating}
                  sx={{
                    color: 'white',
                    bgcolor: scoreColor,
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={score}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: scoreColor,
                  },
                }}
              />
            </Box>
          </Grid>
          
          {/* Social Media Score */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Share fontSize="small" />
                  Social: {socialScore || 0}%
                </Typography>
                <Chip
                  label={getSocialRating(socialScore || 0)}
                  sx={{
                    color: 'white',
                    bgcolor: socialScoreColor,
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={socialScore || 0}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: socialScoreColor,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
        
        {/* Top Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <Box 
            sx={{ 
              mb: 3, 
              p: 2, 
              borderRadius: '8px', 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 0, 0.05)' 
                : 'rgba(255, 255, 0, 0.1)' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TipsAndUpdates sx={{ color: theme.palette.warning.light, mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Top Recommendations
              </Typography>
            </Box>
            <List dense disablePadding>
              {recommendations.map((rec, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {/* Detailed Feedback */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Detailed Analysis
        </Typography>
        
        <Accordion 
          defaultExpanded 
          sx={{ 
            mb: 1, 
            '&:before': { display: 'none' },
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)' 
            }}
          >
            <Typography fontWeight={500}>Title Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {feedback.title.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getFeedbackIcon(item)}
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          sx={{ 
            mb: 1, 
            '&:before': { display: 'none' },
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)' 
            }}
          >
            <Typography fontWeight={500}>Description Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {feedback.description.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getFeedbackIcon(item)}
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          sx={{ 
            mb: 1, 
            '&:before': { display: 'none' },
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)' 
            }}
          >
            <Typography fontWeight={500}>Content Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {feedback.content.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getFeedbackIcon(item)}
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          sx={{ 
            mb: 1, 
            '&:before': { display: 'none' },
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)' 
            }}
          >
            <Typography fontWeight={500}>URL Slug Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {feedback.slug.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getFeedbackIcon(item)}
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          sx={{ 
            mb: 1, 
            '&:before': { display: 'none' },
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)' 
            }}
          >
            <Typography fontWeight={500}>SEO Metadata Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {feedback.metaData.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getFeedbackIcon(item)}
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          sx={{ 
            '&:before': { display: 'none' },
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)' 
            }}
          >
            <Typography fontWeight={500}>Social Media Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {feedback.socialData.map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getFeedbackIcon(item)}
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

// Helper function to get social score rating
const getSocialRating = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Average';
  if (score >= 30) return 'Limited';
  return 'Poor';
};

export default SeoScoreDisplay; 