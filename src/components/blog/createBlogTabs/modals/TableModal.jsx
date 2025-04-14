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
  Switch,
  Grid,
  Slider,
  Tooltip
} from '@mui/material';
import { Close, TableChart, Add, Remove, DragHandle } from '@mui/icons-material';

const TABLE_MAX_SIZE = 10; // Maximum rows/columns

const TableModal = ({ open, onClose, onInsert }) => {
  const theme = useTheme();
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);
  const [withBorders, setWithBorders] = useState(true);
  const [isResizable, setIsResizable] = useState(true);
  const [error, setError] = useState('');
  
  // Table preview cells
  const generatePreviewCells = () => {
    const cells = [];
    for (let i = 0; i < Math.min(rows, 6); i++) {
      for (let j = 0; j < Math.min(columns, 6); j++) {
        cells.push(
          <Box
            key={`${i}-${j}`}
            sx={{
              border: withBorders ? `1px solid ${theme.palette.divider}` : 'none',
              backgroundColor: withHeaderRow && i === 0 
                ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.05)'
                : 'transparent',
              width: '24px',
              height: '24px',
              fontWeight: withHeaderRow && i === 0 ? 600 : 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '10px',
              color: theme.palette.text.secondary
            }}
          >
            {i === 0 && j === 0 && rows > 6 && columns > 6 ? '...' : ''}
          </Box>
        );
      }
    }
    return cells;
  };
  
  const handleSubmit = () => {
    if (rows < 1 || columns < 1) {
      setError('Table must have at least 1 row and 1 column');
      return;
    }
    
    onInsert({
      rows,
      cols: columns,
      withHeaderRow,
      withBorders,
      isResizable
    });
    
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setRows(3);
    setColumns(3);
    setWithHeaderRow(true);
    setWithBorders(true);
    setIsResizable(true);
    setError('');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
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
          <TableChart color="primary" />
          <Typography variant="h6" fontWeight={600}>Insert Table</Typography>
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
        
        <Grid container spacing={3}>
          {/* Left side - Row and Column counters */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Table Dimensions
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Rows:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => setRows(Math.max(1, rows - 1))}
                    disabled={rows <= 1}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  
                  <Typography sx={{ width: '30px', textAlign: 'center' }}>
                    {rows}
                  </Typography>
                  
                  <IconButton 
                    size="small" 
                    onClick={() => setRows(Math.min(TABLE_MAX_SIZE, rows + 1))}
                    disabled={rows >= TABLE_MAX_SIZE}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              
              <Slider
                value={rows}
                min={1}
                max={TABLE_MAX_SIZE}
                onChange={(_, newValue) => setRows(newValue)}
                valueLabelDisplay="off"
                size="small"
              />
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Columns:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => setColumns(Math.max(1, columns - 1))}
                    disabled={columns <= 1}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  
                  <Typography sx={{ width: '30px', textAlign: 'center' }}>
                    {columns}
                  </Typography>
                  
                  <IconButton 
                    size="small" 
                    onClick={() => setColumns(Math.min(TABLE_MAX_SIZE, columns + 1))}
                    disabled={columns >= TABLE_MAX_SIZE}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              
              <Slider
                value={columns}
                min={1}
                max={TABLE_MAX_SIZE}
                onChange={(_, newValue) => setColumns(newValue)}
                valueLabelDisplay="off"
                size="small"
              />
            </Box>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
              Table Options
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={withHeaderRow}
                  onChange={(e) => setWithHeaderRow(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label="Include header row"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={withBorders}
                  onChange={(e) => setWithBorders(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label="Show borders"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={isResizable}
                  onChange={(e) => setIsResizable(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 0.5 }}>Resizable columns</Typography>
                  <Tooltip title="Allow column width to be adjusted in the editor">
                    <IconButton size="small">
                      <DragHandle fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
          </Grid>
          
          {/* Right side - Table preview */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Preview
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                p: 2,
                bgcolor: theme.palette.background.default,
                minHeight: '200px',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                {rows > 6 || columns > 6 
                  ? `Table: ${rows}×${columns} (showing preview)` 
                  : `Table: ${rows}×${columns}`}
              </Typography>
              
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(columns, 6)}, 24px)`,
                  gap: 1,
                }}
              >
                {generatePreviewCells()}
              </Box>
              
              {(rows > 6 || columns > 6) && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                  Full table will appear in the editor
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
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
          Insert Table
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableModal; 