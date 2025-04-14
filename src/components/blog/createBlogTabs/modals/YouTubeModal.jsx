import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  Divider,
  Alert,
  FormControl,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Close, YouTube } from '@mui/icons-material';

const YouTubeModal = ({ open, onClose, onInsert }) => {
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [width, setWidth] = useState('640');
  const [height, setHeight] = useState('480');
  
  const handleSubmit = () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    
    // Very basic validation - in a real app, use a more robust check
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    setError('');
    
    onInsert({
      src: url.trim(),
      width: parseInt(width),
      height: parseInt(height),
      controls: showControls
    });
    
    // Reset form
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setUrl('');
    setError('');
    setShowControls(true);
    setWidth('640');
    setHeight('480');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // Handle numeric input validation
  const handleNumericInput = (e, setter) => {
    const value = e.target.value;
    // Allow only numbers
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <YouTube color="error" />
          <Typography variant="h6" fontWeight={600}>Insert YouTube Video</Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: '8px' }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        <TextField
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=..."
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          margin="normal"
          autoFocus
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            }
          }}
          helperText="Paste the full YouTube URL here"
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
          Video Settings
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Width"
            value={width}
            onChange={(e) => handleNumericInput(e, setWidth)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '50%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
            inputProps={{ inputMode: 'numeric' }}
          />
          
          <TextField
            label="Height"
            value={height}
            onChange={(e) => handleNumericInput(e, setHeight)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '50%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
            inputProps={{ inputMode: 'numeric' }}
          />
        </Box>
        
        <FormControlLabel
          control={
            <Switch
              checked={showControls}
              onChange={(e) => setShowControls(e.target.checked)}
              color="primary"
            />
          }
          label="Show video controls"
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!url.trim()}
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
          }}
        >
          Insert Video
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YouTubeModal; 