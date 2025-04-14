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
  Switch,
  FormControlLabel
} from '@mui/material';
import { Close, Link as LinkIcon } from '@mui/icons-material';

const LinkModal = ({ open, onClose, onInsert }) => {
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  
  const handleSubmit = () => {
    if (!url.trim()) return;
    
    onInsert({
      href: url.trim(),
      text: text.trim(),
      target: openInNewTab ? '_blank' : null
    });
    
    // Reset form
    setUrl('');
    setText('');
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
          <LinkIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>Insert Link</Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <TextField
          label="URL"
          placeholder="https://example.com"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          margin="normal"
          autoFocus
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            }
          }}
        />
        
        <TextField
          label="Link Text (optional)"
          placeholder="Text to display"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            }
          }}
          helperText="Leave empty to use URL as text"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              color="primary"
            />
          }
          label="Open in new tab"
          sx={{ mt: 2 }}
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button 
          onClick={onClose}
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
          Insert Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkModal; 