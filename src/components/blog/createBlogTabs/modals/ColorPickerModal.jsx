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
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { Close, Palette, FormatColorText, FormatColorFill } from '@mui/icons-material';

// Color palettes
const TEXT_COLORS = [
  // Basic colors
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  // Red palette
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
  // Material palette
  '#E53935', '#D81B60', '#8E24AA', '#5E35B1', '#3949AB', '#1E88E5', '#039BE5', '#00ACC1', '#00897B', '#43A047',
  '#7CB342', '#C0CA33', '#FDD835', '#FFB300', '#FB8C00', '#F4511E', '#6D4C41', '#757575', '#546E7A', '#78909C',
];

const HIGHLIGHT_COLORS = [
  '#FFFF00', '#FFFF99', '#FFFFCC', 
  '#FFCCFF', '#FF99FF', '#FF66FF',
  '#CCFFFF', '#99FFFF', '#66FFFF',
  '#CCFFCC', '#99FF99', '#66FF66',
  '#FFFFCC', '#FFFF99', '#FFFF66', 
  '#FFCCCC', '#FF9999', '#FF6666',
  '#FFCCFF', '#FF99FF', '#FF66FF',
  '#CCE5FF', '#99CCFF', '#66B2FF',
  '#D9E5F1', '#B2C9DB', '#8CACC5',
  '#FFFFFF', '#EEEEEE', '#E0E0E0'
];

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`color-tabpanel-${index}`}
      aria-labelledby={`color-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ColorPickerModal = ({ open, onClose, onSelect, type = 'text' }) => {
  const theme = useTheme();
  const [selectedColor, setSelectedColor] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  const colors = type === 'text' ? TEXT_COLORS : HIGHLIGHT_COLORS;
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };
  
  const handleCustomColorChange = (e) => {
    setCustomColor(e.target.value);
    setSelectedColor(e.target.value);
  };
  
  const handleSubmit = () => {
    onSelect(selectedColor || (currentTab === 0 ? colors[0] : customColor));
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setSelectedColor('');
    setCustomColor('');
    setCurrentTab(0);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
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
          {type === 'text' ? 
            <FormatColorText color="primary" /> : 
            <FormatColorFill color="primary" />
          }
          <Typography variant="h6" fontWeight={600}>
            {type === 'text' ? 'Text Color' : 'Highlight Color'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ px: 3, pt: 1, borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Tab 
          label="Palette" 
          sx={{ 
            textTransform: 'none',
            fontWeight: currentTab === 0 ? 600 : 400
          }}
        />
        <Tab 
          label="Custom" 
          sx={{ 
            textTransform: 'none',
            fontWeight: currentTab === 1 ? 600 : 400
          }}
        />
      </Tabs>
      
      <DialogContent sx={{ p: 3 }}>
        <TabPanel value={currentTab} index={0}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(10, 1fr)', 
            gap: 0.75
          }}>
            {colors.map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: '100%',
                  paddingTop: '100%', // Square aspect ratio
                  backgroundColor: color,
                  border: `2px solid ${selectedColor === color ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.palette.primary.light,
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s ease',
                  }
                }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </Box>
        </TabPanel>
        
        <TabPanel value={currentTab} index={1}>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Custom Color"
              placeholder="#HEX or RGBA"
              fullWidth
              value={customColor}
              onChange={handleCustomColorChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                }
              }}
              helperText="Enter a valid hex code (#RRGGBB) or color name"
            />
          </Box>
          
          {customColor && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mt: 3
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview
              </Typography>
              <Box
                sx={{
                  width: '80%',
                  height: '60px',
                  backgroundColor: customColor,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                }}
              />
            </Box>
          )}
        </TabPanel>
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
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
          }}
        >
          Apply Color
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorPickerModal; 