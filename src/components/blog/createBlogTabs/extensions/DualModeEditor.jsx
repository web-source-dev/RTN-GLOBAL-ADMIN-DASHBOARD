import React, { useState, useCallback, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import EditorModeToggle from './EditorModeToggle';
import HtmlEditorMode from './HtmlEditorMode';

/**
 * DualModeEditor component that combines rich text and HTML editing
 * Serves as a wrapper for both editors and handles synchronization between them
 */
const DualModeEditor = ({ 
  richTextEditor, 
  content, 
  onContentChange,
  customActions = null
}) => {
  // Editor mode state (richText or html)
  const [editorMode, setEditorMode] = useState('richText');
  
  // Alert for HTML validation errors
  const [htmlError, setHtmlError] = useState({ open: false, message: '' });

  // Handle editor mode toggle
  const handleEditorModeChange = (event, newMode) => {
    if (newMode !== null) {
      // Basic validation when switching from HTML to rich text
      if (editorMode === 'html' && newMode === 'richText') {
        try {
          // Try to parse HTML to check validity
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          
          // Check for parsing errors
          const parserErrors = doc.querySelectorAll('parsererror');
          if (parserErrors.length > 0) {
            setHtmlError({
              open: true,
              message: 'HTML appears to contain errors. Please fix before switching to rich text mode.'
            });
            return; // Prevent mode change if errors found
          }
        } catch (error) {
          setHtmlError({
            open: true,
            message: 'Invalid HTML: ' + error.message
          });
          return; // Prevent mode change if errors found
        }
      }
      
      // Update the editor mode if validation passes
      setEditorMode(newMode);
    }
  };

  // Handle HTML content changes
  const handleHtmlContentChange = useCallback((newHtmlContent) => {
    if (onContentChange) {
      onContentChange(newHtmlContent);
    }
  }, [onContentChange]);

  // Close HTML error snackbar
  const handleCloseHtmlError = () => {
    setHtmlError({ ...htmlError, open: false });
  };

  return (
    <Box>
      {/* Editor mode toggle and custom actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <EditorModeToggle 
          mode={editorMode} 
          onChange={handleEditorModeChange} 
        />
        
        {/* Optional custom actions (buttons, etc.) */}
        {customActions && (
          <Box>
            {customActions}
          </Box>
        )}
      </Box>
      
      {/* Editor components */}
      <Box sx={{ display: editorMode === 'richText' ? 'block' : 'none' }}>
        {richTextEditor}
      </Box>
      
      <Box sx={{ display: editorMode === 'html' ? 'block' : 'none' }}>
        <HtmlEditorMode 
          content={content} 
          onContentChange={handleHtmlContentChange}
        />
      </Box>
      
      {/* HTML validation error snackbar */}
      <Snackbar
        open={htmlError.open}
        autoHideDuration={6000}
        onClose={handleCloseHtmlError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseHtmlError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {htmlError.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DualModeEditor; 