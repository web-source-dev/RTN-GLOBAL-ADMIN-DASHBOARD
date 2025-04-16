import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, useTheme, IconButton, Tooltip } from '@mui/material';
import { CodeOutlined, EditOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';

/**
 * HTML Editor component with syntax highlighting for editing raw HTML
 * This component acts as the HTML mode for the blog content editor
 */
const HtmlEditorMode = ({ 
  content, 
  onContentChange, 
  readOnly = false,
  showLineNumbers = true 
}) => {
  const theme = useTheme();
  const [htmlContent, setHtmlContent] = useState(content || '');
  const [isEditing, setIsEditing] = useState(true); // Default to edit mode
  const editorRef = useRef(null);

  // Update local state when content prop changes
  useEffect(() => {
    setHtmlContent(content || '');
  }, [content]);

  // Handle content changes in the editor
  const handleContentChange = (code) => {
    setHtmlContent(code);
    onContentChange(code);
  };

  // Toggle between view and edit mode
  const toggleEditMode = () => {
    if (readOnly) return;
    setIsEditing(!isEditing);
  };

  return (
    <Box>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 1,
          p: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
      >
        <CodeOutlined fontSize="small" />
        <Typography variant="subtitle2">HTML Editor Mode</Typography>
        
        {!readOnly && (
          <Tooltip title={isEditing ? "Switch to preview mode" : "Switch to edit mode"}>
            <IconButton 
              size="small" 
              onClick={toggleEditMode}
              sx={{ ml: 'auto' }}
              color={isEditing ? "default" : "primary"}
            >
              {isEditing ? <VisibilityOutlined fontSize="small" /> : <EditOutlined fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
        
        <Typography 
          variant="caption" 
          sx={{ 
            ml: readOnly ? 'auto' : 1, 
            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            fontStyle: 'italic'
          }}
        >
          {isEditing ? 'Edit HTML' : 'HTML Preview'}
        </Typography>
      </Box>

      {/* Editor/Viewer */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          position: 'relative',
          minHeight: '350px',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.01)',
          borderRadius: '4px',
          overflow: 'hidden',
          cursor: readOnly ? 'default' : 'text',
          '& pre': {
            margin: 0,
            minHeight: '350px',
          },
        }}
      >
        {isEditing && !readOnly ? (
          // Edit mode - show code editor with syntax highlighting
          <Box
            ref={editorRef}
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '350px',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : '#f5f5f5',
              overflow: 'auto',
              '& .prism-code': {
                fontFamily: 'monospace',
                fontSize: '14px',
                outline: 'none',
              },
              '& .token.tag': {
                color: theme.palette.mode === 'dark' ? '#e06c75' : '#22863a',
              },
              '& .token.attr-name': {
                color: theme.palette.mode === 'dark' ? '#d19a66' : '#6f42c1',
              },
              '& .token.attr-value': {
                color: theme.palette.mode === 'dark' ? '#98c379' : '#032f62',
              },
              '& .token.comment': {
                color: theme.palette.mode === 'dark' ? '#7f848e' : '#6a737d',
              },
              '& .token.string': {
                color: theme.palette.mode === 'dark' ? '#98c379' : '#032f62',
              },
            }}
          >
            <Editor
              value={htmlContent}
              onValueChange={handleContentChange}
              highlight={code => highlight(code, languages.html, 'html')}
              padding={16}
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                minHeight: '350px',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : '#f5f5f5',
                color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#333',
              }}
              textareaId="html-code-editor"
              className="editor-textarea"
            />
          </Box>
        ) : !isEditing ? (
          // View mode - show rendered HTML preview
          <Box 
            sx={{
              height: '100%',
              minHeight: '350px',
              padding: '16px',
              backgroundColor: 'white', // Always white background for preview
              overflow: 'auto',
              '& *': { maxWidth: '100%' } // Prevent content overflow
            }}
          >
            <Box 
              dangerouslySetInnerHTML={{ __html: htmlContent || '<div style="color: #999; font-style: italic; padding: 20px;">No HTML content to preview</div>' }} 
              sx={{ height: '100%' }}
            />
          </Box>
        ) : (
          // Read-only mode - show syntax highlighted code
          <SyntaxHighlighter
            language="html"
            style={theme.palette.mode === 'dark' ? tomorrow : prism}
            showLineNumbers={showLineNumbers}
            wrapLines={true}
            customStyle={{
              padding: '16px',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : '#f5f5f5',
              fontSize: '14px',
              minHeight: '350px'
            }}
          >
            {htmlContent || '<!-- HTML content will appear here -->'}
          </SyntaxHighlighter>
        )}
      </Paper>

      {/* Helper text */}
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          mt: 1, 
          color: theme.palette.text.secondary,
          fontStyle: 'italic'
        }}
      >
        {readOnly 
          ? 'View-only mode. Cannot edit HTML directly.' 
          : isEditing 
            ? 'Edit HTML code with syntax highlighting. Click the eye icon to preview the rendered result.' 
            : 'Preview mode. Click the edit icon to return to code editing.'}
      </Typography>
    </Box>
  );
};

export default HtmlEditorMode; 