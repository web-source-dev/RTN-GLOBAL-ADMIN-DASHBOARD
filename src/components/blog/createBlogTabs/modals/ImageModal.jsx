import React, { useState, useRef, useEffect } from 'react';
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
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { Close, Image, CloudUpload, AccessibilityNew, Link as LinkIcon } from '@mui/icons-material';

const ImageModal = ({ open, onClose, onInsert, initialFile }) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [altText, setAltText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  
  // Handle initial file when provided (from drag and drop)
  useEffect(() => {
    if (initialFile && open) {
      setSelectedFile(initialFile);
      setPreview(URL.createObjectURL(initialFile));
      setIsUrlMode(false); // Ensure we're in file upload mode
      setError(''); // Clear any previous errors
      
      // Focus on the alt text field after a short delay
      setTimeout(() => {
        document.querySelector('[name="alt-text"]')?.focus();
      }, 300);
    }
  }, [initialFile, open]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setError('');
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };
  
  const handleSubmit = () => {
    if (!altText.trim()) {
      setError('Alt text is required for accessibility and SEO');
      return;
    }
    
    setError('');
    
    if (isUrlMode && imageUrl) {
      onInsert({
        src: imageUrl.trim(),
        alt: altText.trim()
      });
    } else if (selectedFile && preview) {
      const reader = new FileReader();
      reader.onload = () => {
        onInsert({
          src: reader.result,
          alt: altText.trim()
        });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Please select an image or enter an image URL');
      return;
    }
    
    // Reset form
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setPreview('');
    setAltText('');
    setImageUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const toggleMode = () => {
    setIsUrlMode(!isUrlMode);
    resetForm();
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
          <Image color="primary" />
          <Typography variant="h6" fontWeight={600}>Insert Image</Typography>
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
        
        <Alert 
          severity="info" 
          sx={{ mb: 3, borderRadius: '8px' }}
        >
          After inserting, you can resize images by dragging the corners.
        </Alert>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color={!isUrlMode ? "primary" : "inherit"}
            onClick={() => setIsUrlMode(false)}
            sx={{ 
              borderRadius: '10px 0 0 10px',
              textTransform: 'none',
              fontWeight: !isUrlMode ? 600 : 400,
              borderRight: 0
            }}
          >
            Upload Image
          </Button>
          <Button
            variant="outlined"
            color={isUrlMode ? "primary" : "inherit"}
            onClick={() => setIsUrlMode(true)}
            sx={{ 
              borderRadius: '0 10px 10px 0',
              textTransform: 'none',
              fontWeight: isUrlMode ? 600 : 400,
              borderLeft: !isUrlMode ? 1 : undefined
            }}
          >
            Image URL
          </Button>
        </Box>
        
        {!isUrlMode ? (
          <>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <Box 
              sx={{ 
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: '10px',
                p: 3,
                textAlign: 'center',
                mb: 3,
                cursor: 'pointer',
                bgcolor: theme.palette.background.default,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(144, 202, 249, 0.08)' 
                    : 'rgba(33, 150, 243, 0.08)'
                }
              }}
              onClick={triggerFileInput}
            >
              {preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    borderRadius: '8px',
                  }} 
                />
              ) : (
                <>
                  <CloudUpload 
                    fontSize="large" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: 60,
                      mb: 1
                    }} 
                  />
                  <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                    Click to upload an image
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Maximum file size: 5MB
                  </Typography>
                </>
              )}
            </Box>
          </>
        ) : (
          <TextField
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
            InputProps={{
              startAdornment: (
                <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
              ),
            }}
          />
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <AccessibilityNew 
            fontSize="small" 
            sx={{ mt: 2, mr: 1, color: theme.palette.primary.main }} 
          />
          <TextField
            label="Alt Text"
            name="alt-text"
            placeholder="Describe the image for accessibility and SEO"
            fullWidth
            required
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            multiline
            rows={2}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
            helperText="Describe the image content for screen readers and SEO (required)"
          />
        </Box>
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
          disabled={(!selectedFile && !imageUrl) || !altText.trim()}
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
          }}
        >
          Insert Image
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageModal; 