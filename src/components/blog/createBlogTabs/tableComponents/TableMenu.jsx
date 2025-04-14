import React from 'react';
import {
  Paper,
  IconButton,
  Tooltip,
  Box,
  useTheme,
  Typography,
  Grid,
} from '@mui/material';
import {
  AddBox,
  IndeterminateCheckBox,
  DeleteOutline,
  VerticalAlignTop,
  VerticalAlignBottom,
  ChevronLeft,
  ChevronRight,
  TableRows,
  ViewColumn,
  MergeType,
  CallSplit,
} from '@mui/icons-material';

const TableMenu = ({ editor }) => {
  const theme = useTheme();

  if (!editor || !editor.isActive('table')) {
    return null;
  }

  const handleAddColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const handleAddColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const handleDeleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const handleAddRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const handleAddRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const handleDeleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const handleDeleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const handleMergeCells = () => {
    editor.chain().focus().mergeCells().run();
  };

  const handleSplitCell = () => {
    editor.chain().focus().splitCell().run();
  };

  const handleToggleHeaderColumn = () => {
    editor.chain().focus().toggleHeaderColumn().run();
  };

  const handleToggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run();
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 1,
        borderRadius: '8px',
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 2px 12px rgba(0,0,0,0.15)`,
        border: `1px solid ${theme.palette.divider}`,
        minWidth: '200px',
      }}
    >
      <Grid container spacing={1}>
        {/* Row Operations - First Line */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ 
              width: '50px', 
              color: theme.palette.text.secondary, 
              fontWeight: 500 
            }}>
              Row:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Add row above">
                <IconButton size="small" onClick={handleAddRowBefore}>
                  <VerticalAlignBottom fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add row below">
                <IconButton size="small" onClick={handleAddRowAfter}>
                  <VerticalAlignTop fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete row">
                <IconButton 
                  size="small" 
                  onClick={handleDeleteRow}
                  sx={{ 
                    color: theme.palette.error.main,
                    '&:hover': { bgcolor: theme.palette.error.light + '20' }
                  }}
                >
                  <IndeterminateCheckBox fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle header row">
                <IconButton size="small" onClick={handleToggleHeaderRow}>
                  <TableRows fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>

        {/* Column Operations - Second Line */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ 
              width: '50px', 
              color: theme.palette.text.secondary, 
              fontWeight: 500 
            }}>
              Column:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Add column before">
                <IconButton size="small" onClick={handleAddColumnBefore}>
                  <ChevronLeft fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add column after">
                <IconButton size="small" onClick={handleAddColumnAfter}>
                  <ChevronRight fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete column">
                <IconButton 
                  size="small" 
                  onClick={handleDeleteColumn}
                  sx={{ 
                    color: theme.palette.error.main,
                    '&:hover': { bgcolor: theme.palette.error.light + '20' }
                  }}
                >
                  <IndeterminateCheckBox fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle header column">
                <IconButton size="small" onClick={handleToggleHeaderColumn}>
                  <ViewColumn fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>

        {/* Common Operations - Third Line */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, pt: 0.5, borderTop: `1px solid ${theme.palette.divider}` }}>
           
            <Tooltip title="Delete table">
              <IconButton size="small" onClick={handleDeleteTable} color="error">
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TableMenu; 