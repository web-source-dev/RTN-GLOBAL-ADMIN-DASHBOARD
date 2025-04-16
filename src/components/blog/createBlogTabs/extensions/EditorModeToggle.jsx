import React from 'react';
import { 
  Box, 
  ToggleButtonGroup, 
  ToggleButton, 
  Typography, 
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  TextFields as RichTextIcon, 
  Code as HTMLIcon,
  Info as InfoIcon
} from '@mui/icons-material';

/**
 * Component for toggling between rich text and HTML editing modes
 */
const EditorModeToggle = ({ mode, onChange }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        p: 1,
        borderRadius: '8px',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255,255,255,0.05)' 
          : 'rgba(0,0,0,0.03)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            mr: 2, 
            fontWeight: 500,
            color: theme.palette.text.secondary
          }}
        >
          Editor Mode:
        </Typography>
        
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={onChange}
          aria-label="editor mode"
          size="small"
        >
          <ToggleButton 
            value="richText" 
            aria-label="rich text editor"
            sx={{ 
              px: 2,
              py: 0.75,
              textTransform: 'none',
              borderRadius: '4px',
              mr: 1,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }
            }}
          >
            <RichTextIcon fontSize="small" sx={{ mr: 1 }} />
            Rich Text
          </ToggleButton>
          
          <ToggleButton 
            value="html" 
            aria-label="html editor"
            sx={{ 
              px: 2,
              py: 0.75,
              textTransform: 'none',
              borderRadius: '4px',
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }
            }}
          >
            <HTMLIcon fontSize="small" sx={{ mr: 1 }} />
            HTML
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Tooltip 
        title={
          <Typography variant="body2">
            Switch between visual rich text editing and raw HTML mode. 
            HTML mode allows direct editing of the underlying HTML code.
          </Typography>
        } 
        placement="bottom"
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: theme.palette.info.main,
          cursor: 'help',
          '&:hover': { color: theme.palette.info.dark }
        }}>
          <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption">
            {mode === 'richText' 
              ? 'Using visual editor' 
              : 'Editing raw HTML code'}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default EditorModeToggle; 