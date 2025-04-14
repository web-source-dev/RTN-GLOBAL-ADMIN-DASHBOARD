import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  useTheme,
  Chip,
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Article, 
  PhotoCamera, 
  Close, 
  AccessibilityNew, 
  Info, 
  FormatBold, 
  FormatItalic, 
  FormatUnderlined,
  StrikethroughS,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  VideoLibrary,
  FormatIndentDecrease,
  FormatIndentIncrease,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatColorText,
  FormatColorFill,
  TableChart,
  Save,
  UploadFile,
  FormatLineSpacingTwoTone,
  TocOutlined,
  CheckCircleOutline,
  AccessAlarmsOutlined,
  ErrorOutline,
  WarningAmber,
  InfoOutlined,
  AccessibilityOutlined
} from '@mui/icons-material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Import Tiptap dependencies
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
// Table extensions
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

// Import the custom modal components
import LinkModal from './modals/LinkModal';
import ImageModal from './modals/ImageModal';
import YouTubeModal from './modals/YouTubeModal';
import TableModal from './modals/TableModal';
import TableMenu from './tableComponents/TableMenu';

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

// Color Palette Component
const ColorPalette = ({ colors, onSelectColor, onClose }) => {
  const theme = useTheme();
  
  return (
    <ClickAwayListener onClickAway={onClose}>
      <Box sx={{ 
        p: 1, 
        bgcolor: theme.palette.background.paper,
        borderRadius: '8px',
        boxShadow: theme.shadows[8],
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: '270px', // Adjusted for 10 colors per row
      }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(10, 1fr)', 
          gap: 0.5
        }}>
          {colors.map((color, index) => (
            <Box
              key={index}
              sx={{
                width: '24px',
                height: '24px',
                backgroundColor: color,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease',
                  border: `2px solid ${theme.palette.primary.main}`
                }
              }}
              onClick={() => {
                onSelectColor(color);
                onClose();
              }}
            />
          ))}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

// Custom font size extension
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
    }
  },
})

// Custom menu bar component for Tiptap
const MenuBar = ({ editor }) => {
  const theme = useTheme();
  
  // State for modal dialogs
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  
  // State for color pickers
  const [textColorPickerOpen, setTextColorPickerOpen] = useState(false);
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false);
  
  // Refs for color button anchors
  const textColorButtonRef = useRef(null);
  const highlightButtonRef = useRef(null);

  // Add export/import menu state
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const exportMenuOpen = Boolean(exportMenuAnchor);

  // Define all callbacks outside conditionals
  const handleBold = useCallback(() => {
    if (editor) editor.chain().focus().toggleBold().run()
  }, [editor]);
  
  const handleItalic = useCallback(() => {
    if (editor) editor.chain().focus().toggleItalic().run()
  }, [editor]);
  
  const handleUnderline = useCallback(() => {
    if (editor) editor.chain().focus().toggleUnderline().run()
  }, [editor]);
  
  const handleStrike = useCallback(() => {
    if (editor) editor.chain().focus().toggleStrike().run()
  }, [editor]);
  
  const handleBulletList = useCallback(() => {
    if (editor) editor.chain().focus().toggleBulletList().run()
  }, [editor]);
  
  const handleOrderedList = useCallback(() => {
    if (editor) editor.chain().focus().toggleOrderedList().run()
  }, [editor]);
  
  const handleBlockquote = useCallback(() => {
    if (editor) editor.chain().focus().toggleBlockquote().run()
  }, [editor]);
  
  const handleCodeBlock = useCallback(() => {
    if (editor) editor.chain().focus().toggleCodeBlock().run()
  }, [editor]);
  
  const handleOutdent = useCallback(() => {
    if (editor) editor.chain().focus().outdent().run()
  }, [editor]);
  
  const handleIndent = useCallback(() => {
    if (editor) editor.chain().focus().indent().run()
  }, [editor]);
  
  const handleAlignLeft = useCallback(() => {
    if (editor) editor.chain().focus().setTextAlign('left').run()
  }, [editor]);
  
  const handleAlignCenter = useCallback(() => {
    if (editor) editor.chain().focus().setTextAlign('center').run()
  }, [editor]);
  
  const handleAlignRight = useCallback(() => {
    if (editor) editor.chain().focus().setTextAlign('right').run()
  }, [editor]);
  
  const handleAlignJustify = useCallback(() => {
    if (editor) editor.chain().focus().setTextAlign('justify').run()
  }, [editor]);
  
  const handleUndo = useCallback(() => {
    if (editor) editor.chain().focus().undo().run()
  }, [editor]);
  
  const handleRedo = useCallback(() => {
    if (editor) editor.chain().focus().redo().run()
  }, [editor]);

  // Handle link insertion using modal
  const openLinkModal = useCallback(() => {
    setLinkModalOpen(true);
  }, []);
  
  const handleLinkInsert = useCallback((linkData) => {
    if (!editor || !linkData.href) return;
    
    if (editor.getAttributes('link').href) {
      // If a link is already selected, update it
      editor.chain().focus().extendMarkRange('link').setLink({ 
        href: linkData.href,
        target: linkData.target 
      }).run();
    } else if (linkData.text && editor.state.selection.empty) {
      // If no text is selected but link text was provided
      editor.chain().focus().insertContent({
        type: 'text',
        marks: [{ 
          type: 'link',
          attrs: { 
            href: linkData.href,
            target: linkData.target 
          }
        }],
        text: linkData.text
      }).run();
    } else {
      // Set link on selection or create a new one
      editor.chain().focus().setLink({ 
        href: linkData.href,
        target: linkData.target 
      }).run();
    }
  }, [editor]);

  // Handle image upload using modal
  const openImageModal = useCallback(() => {
    setImageModalOpen(true);
  }, []);
  
  const handleImageInsert = useCallback((imageData) => {
    if (!editor || !imageData.src) return;
    
    editor.chain().focus().setImage({ 
      src: imageData.src,
      alt: imageData.alt 
    }).run();
  }, [editor]);

  // Handle YouTube video insertion using modal
  const openYoutubeModal = useCallback(() => {
    setYoutubeModalOpen(true);
  }, []);
  
  const handleYoutubeInsert = useCallback((videoData) => {
    if (!editor || !videoData.src) return;
    
    editor.chain().focus().setYoutubeVideo({ 
      src: videoData.src,
      width: videoData.width || 640,
      height: videoData.height || 480,
      controls: videoData.controls
    }).run();
  }, [editor]);
  
  // Handle table insertion using modal
  const openTableModal = useCallback(() => {
    setTableModalOpen(true);
  }, []);
  
  const handleTableInsert = useCallback((tableData) => {
    if (!editor) return;
    
    editor.chain().focus().insertTable({ 
      rows: tableData.rows, 
      cols: tableData.cols,
      withHeaderRow: tableData.withHeaderRow
    }).run();
    
    // Apply additional styling based on user preferences
    if (tableData.withBorders) {
      // Add a class to the table element for CSS styling
      // We'll handle this through custom CSS
    }
  }, [editor]);

  // Handle color selection
  const toggleTextColorPicker = useCallback(() => {
    setTextColorPickerOpen(prev => !prev);
    setHighlightPickerOpen(false);
  }, []);
  
  const toggleHighlightPicker = useCallback(() => {
    setHighlightPickerOpen(prev => !prev);
    setTextColorPickerOpen(false);
  }, []);
  
  const handleTextColorSelect = useCallback((color) => {
    if (!editor || !color) return;
    editor.chain().focus().setColor(color).run();
  }, [editor]);
  
  const handleHighlightSelect = useCallback((color) => {
    if (!editor || !color) return;
    editor.chain().focus().toggleHighlight({ color }).run();
  }, [editor]);

  // Handle heading selection
  const handleHeadingChange = useCallback((e) => {
    if (!editor) return;
    const level = parseInt(e.target.value);
    
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }, [editor]);

  // Handle font size
  const handleFontSizeChange = useCallback((e) => {
    if (!editor) return;
    const size = e.target.value;
    
    if (size) {
      editor.chain().focus().setFontSize(size).run();
    }
  }, [editor]);

  // Add export handling
  const handleExportClick = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };
  
  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };
  
  const exportAsHTML = () => {
    if (!editor) return;
    const html = editor.getHTML();
    
    // Create a blob and download link
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-content.html';
    a.click();
    URL.revokeObjectURL(url);
    handleExportClose();
  };
  
  const exportAsMarkdown = () => {
    if (!editor) return;
    // This is a simple implementation - for better HTML to MD conversion,
    // consider using a library like turndown
    const html = editor.getHTML();
    // Convert basic formatting (simple example)
    let markdown = html
      .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => {
        return p1.replace(/<li>(.*?)<\/li>/g, '- $1\n');
      })
      // ... add more replacements as needed
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-content.md';
    a.click();
    URL.revokeObjectURL(url);
    handleExportClose();
  };
  
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file || !editor) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      // For HTML files, we can directly set the content
      if (file.type === 'text/html') {
        editor.commands.setContent(content);
      } else {
        // For plain text, wrap in paragraph tags
        editor.commands.setContent(`<p>${content}</p>`);
      }
    };
    reader.readAsText(file);
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 0.5, 
          mb: 1,
          p: 1,
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Text formatting */}
        <IconButton 
          size="small" 
          onClick={handleBold}
          color={editor.isActive('bold') ? 'primary' : 'default'}
          title="Bold"
        >
          <FormatBold fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleItalic}
          color={editor.isActive('italic') ? 'primary' : 'default'}
          title="Italic"
        >
          <FormatItalic fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleUnderline}
          color={editor.isActive('underline') ? 'primary' : 'default'}
          title="Underline"
        >
          <FormatUnderlined fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleStrike}
          color={editor.isActive('strike') ? 'primary' : 'default'}
          title="Strike"
        >
          <StrikethroughS fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Headings */}
        <Box 
          component="select" 
          onChange={handleHeadingChange}
          sx={{ 
            height: 32, 
            borderRadius: '4px',
            border: `1px solid ${theme.palette.divider}`,
            background: 'transparent',
            px: 1,
            fontFamily: theme.typography.fontFamily,
            '&:focus': { outline: 'none' },
          }}
          defaultValue=""
        >
          <option value="" disabled>Heading</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="0">Normal</option>
        </Box>
        
        <Box 
          component="select" 
          onChange={handleFontSizeChange}
          sx={{ 
            height: 32, 
            borderRadius: '4px',
            border: `1px solid ${theme.palette.divider}`,
            background: 'transparent',
            px: 1,
            ml: 1,
            fontFamily: theme.typography.fontFamily,
            '&:focus': { outline: 'none' },
          }}
          defaultValue=""
        >
          <option value="" disabled>Size</option>
          <option value="10px">Small</option>
          <option value="16px">Normal</option>
          <option value="20px">Large</option>
          <option value="28px">Huge</option>
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Lists */}
        <IconButton 
          size="small" 
          onClick={handleBulletList}
          color={editor.isActive('bulletList') ? 'primary' : 'default'}
          title="Bullet List"
        >
          <FormatListBulleted fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleOrderedList}
          color={editor.isActive('orderedList') ? 'primary' : 'default'}
          title="Numbered List"
        >
          <FormatListNumbered fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Blockquote and Code */}
        <IconButton 
          size="small" 
          onClick={handleBlockquote}
          color={editor.isActive('blockquote') ? 'primary' : 'default'}
          title="Quote"
        >
          <FormatQuote fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleCodeBlock}
          color={editor.isActive('codeBlock') ? 'primary' : 'default'}
          title="Code Block"
        >
          <Code fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Indentation */}
        <IconButton 
          size="small" 
          onClick={handleOutdent}
          title="Decrease Indent"
        >
          <FormatIndentDecrease fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleIndent}
          title="Increase Indent"
        >
          <FormatIndentIncrease fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Alignment */}
        <IconButton 
          size="small" 
          onClick={handleAlignLeft}
          color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
          title="Align Left"
        >
          <FormatAlignLeft fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleAlignCenter}
          color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
          title="Align Center"
        >
          <FormatAlignCenter fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleAlignRight}
          color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
          title="Align Right"
        >
          <FormatAlignRight fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleAlignJustify}
          color={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}
          title="Justify"
        >
          <FormatAlignJustify fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Color */}
        <Box sx={{ position: 'relative' }}>
          <IconButton 
            ref={textColorButtonRef}
            size="small" 
            onClick={toggleTextColorPicker}
            color={editor.isActive('textStyle') ? 'primary' : 'default'}
            title="Text Color"
          >
            <FormatColorText fontSize="small" />
          </IconButton>
          
          <Popper 
            open={textColorPickerOpen} 
            anchorEl={textColorButtonRef.current}
            placement="bottom-start"
            transition
            disablePortal
            style={{ zIndex: 9999 }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} style={{ transformOrigin: 'left top' }}>
                <div>
                  <ColorPalette 
                    colors={TEXT_COLORS} 
                    onSelectColor={handleTextColorSelect}
                    onClose={() => setTextColorPickerOpen(false)}
                  />
                </div>
              </Grow>
            )}
          </Popper>
        </Box>
        
        <Box sx={{ position: 'relative' }}>
          <IconButton 
            ref={highlightButtonRef}
            size="small" 
            onClick={toggleHighlightPicker}
            color={editor.isActive('highlight') ? 'primary' : 'default'}
            title="Highlight Color"
          >
            <FormatColorFill fontSize="small" />
          </IconButton>
          
          <Popper 
            open={highlightPickerOpen} 
            anchorEl={highlightButtonRef.current}
            placement="bottom-start"
            transition
            disablePortal
            style={{ zIndex: 9999 }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} style={{ transformOrigin: 'left top' }}>
                <div>
                  <ColorPalette 
                    colors={HIGHLIGHT_COLORS} 
                    onSelectColor={handleHighlightSelect}
                    onClose={() => setHighlightPickerOpen(false)}
                  />
                </div>
              </Grow>
            )}
          </Popper>
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Link, Image, Video, Table */}
        <IconButton 
          size="small" 
          onClick={openLinkModal}
          color={editor.isActive('link') ? 'primary' : 'default'}
          title="Insert Link"
        >
          <LinkIcon fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={openImageModal}
          title="Insert Image"
        >
          <ImageIcon fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={openYoutubeModal}
          title="Insert YouTube Video"
        >
          <VideoLibrary fontSize="small" />
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={openTableModal}
          color={editor.isActive('table') ? 'primary' : 'default'}
          title="Insert Table"
        >
          <TableChart fontSize="small" />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Undo/Redo */}
        <IconButton 
          size="small" 
          onClick={handleUndo}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <span style={{ fontSize: '14px' }}>↩</span>
        </IconButton>
        
        <IconButton 
          size="small" 
          onClick={handleRedo}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <span style={{ fontSize: '14px' }}>↪</span>
        </IconButton>
        
        {/* Export Button */}
        <IconButton 
          size="small" 
          onClick={handleExportClick}
          title="Export Content"
        >
          <Save fontSize="small" />
        </IconButton>
        
        {/* Import Button */}
        <IconButton
          size="small"
          component="label"
          title="Import Content"
        >
          <UploadFile fontSize="small" />
          <input
            type="file"
            hidden
            accept=".html,.txt,.md"
            onChange={handleImport}
          />
        </IconButton>
        
        {/* Export Menu */}
        <Menu
          anchorEl={exportMenuAnchor}
          open={exportMenuOpen}
          onClose={handleExportClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={exportAsHTML}>Export as HTML</MenuItem>
          <MenuItem onClick={exportAsMarkdown}>Export as Markdown</MenuItem>
        </Menu>

        {/* Add a button to the toolbar or somewhere accessible */}
        <Button
          variant="outlined"
          startIcon={<LinkIcon />}
          onClick={() => {
            if (editor) {
              editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'heading') {
                  // Extract text from the heading
                  let headingText = '';
                  node.content.forEach(child => {
                    if (child.text) {
                      headingText += child.text;
                    }
                  });
                  
                  // Clean and create slug
                  const cleanText = headingText
                    .replace(/✅/g, '')
                    .replace(/•/g, '')
                    .replace(/·/g, '')
                    .trim();
                  
                  const id = slugify(cleanText);
                  
                  // Set ID attribute on the heading
                  editor.commands.updateAttributes('heading', { 
                    id: id,
                    'data-anchor': id
                  }, { from: pos, to: pos + node.nodeSize });
                }
              });
              
            }
          }}
          sx={{ textTransform: 'none', ml: 2 }}
        >
          Add Anchors to Headings
        </Button>
      </Box>
      
      {/* Modals */}
      <LinkModal 
        open={linkModalOpen} 
        onClose={() => setLinkModalOpen(false)}
        onInsert={handleLinkInsert}
      />
      
      <ImageModal 
        open={imageModalOpen} 
        onClose={() => setImageModalOpen(false)}
        onInsert={handleImageInsert}
      />
      
      <YouTubeModal 
        open={youtubeModalOpen} 
        onClose={() => setYoutubeModalOpen(false)}
        onInsert={handleYoutubeInsert}
      />
      
      <TableModal 
        open={tableModalOpen} 
        onClose={() => setTableModalOpen(false)}
        onInsert={handleTableInsert}
      />
    </>
  );
};

// Function to ensure all images have their alt text attributes properly set
const ensureImagesHaveAltText = (editor) => {
  if (!editor) return;
  
  // Get the JSON from the editor
  const json = editor.getJSON();
  
  // Function to recursively check for images in the document
  const checkForImages = (node) => {
    if (node.type === 'image' && (!node.attrs.alt || node.attrs.alt === '')) {
      // We found an image without alt text - trigger the alt text modal
      return true;
    }
    
    if (node.content) {
      for (const childNode of node.content) {
        if (checkForImages(childNode)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Check the document for images without alt text
  return checkForImages(json);
};

// Add this helper function for generating IDs from heading text
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Trim whitespace
};

// Helper function to format image URLs correctly
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's a blob URL (from local file selection) or already has http/https, use as is
  if (imageUrl.startsWith('blob:') || imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Otherwise, it's a relative path from the backend that needs the API URL
  return `${process.env.REACT_APP_API_URL}${imageUrl}`;
};

const ContentTab = ({
  content,
  setContent,
  image,
  setImage,
  preview,
  setPreview,
  wordCount,
  setWordCount,
  estimatedReadTime,
  setEstimatedReadTime,
  imageAlt,
  setImageAlt
}) => {
  const theme = useTheme();
  const [missingAltTextModalOpen, setMissingAltTextModalOpen] = useState(false);
  const [currentImageWithoutAlt, setCurrentImageWithoutAlt] = useState(null);
  const [tableMenuPosition, setTableMenuPosition] = useState({ top: 0, left: 0 });
  const [showTableMenu, setShowTableMenu] = useState(false);
  const editorRef = useRef(null);

  // Add state for ToC
  const [tocDialogOpen, setTocDialogOpen] = useState(false);
  const [tableOfContents, setTableOfContents] = useState([]);

  // Add state for accessibility checker
  const [accessibilityDialogOpen, setAccessibilityDialogOpen] = useState(false);
  const [accessibilityResults, setAccessibilityResults] = useState(null);

  // Add state for autosave
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveSnackbar, setSaveSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const autosaveIntervalRef = useRef(null);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'blog-content-image',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'table'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
      FontSize,
      Highlight.configure({
        multicolor: true,
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        controls: true,
      }),
      // Table extensions
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'blog-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      
      // Check for images without alt text
      if (ensureImagesHaveAltText(editor)) {
        // We found an image without alt text - we would handle this here
        // For now, just log a warning
        console.warn('There are images without alt text in the content');
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update table menu position when a table cell is selected
      if (editor.isActive('table')) {
        try {
          const { view } = editor;
          const { selection } = view.state;
          
          // More robust checks for various selection types
          if (selection) {
            let pos;
            
            // Check if we have NodeSelection (entire node selected)
            if (selection.node) {
              pos = selection.from;
            }
            // Check if we have TextSelection with $anchor
            else if (selection.$anchor) {
              pos = selection.$anchor.pos;
            }
            // Check ranges for CellSelection type
            else if (selection.ranges && selection.ranges.length > 0 && selection.ranges[0].$anchor) {
              pos = selection.ranges[0].$anchor.pos;
            }
            
            // If we found a valid position
            if (pos !== undefined) {
              const domSelection = view.domAtPos(pos);
              if (domSelection && domSelection.node) {
                // Find the table cell element (TD or TH)
                let cellNode = domSelection.node;
                while (cellNode && cellNode.nodeName !== 'TD' && cellNode.nodeName !== 'TH') {
                  cellNode = cellNode.parentNode;
                }
                
                // If we found a cell, position the menu near the cell
                if (cellNode) {
                  const cellRect = cellNode.getBoundingClientRect();
                  const editorRect = editorRef.current?.getBoundingClientRect();
                  
                  if (editorRef.current && cellRect && editorRect) {
                    // Position to the right of the cell, at the same height
                    setTableMenuPosition({
                      top: cellRect.top - editorRect.top + 30,
                      left: cellRect.right - editorRect.left - 170
                    });
                    setShowTableMenu(true);
                    return;
                  }
                } else {
                  // Fall back to table element if cell not found
                  let tableNode = domSelection.node;
                  while (tableNode && tableNode.nodeName !== 'TABLE') {
                    tableNode = tableNode.parentNode;
                  }
                  
                  if (tableNode) {
                    const rect = tableNode.getBoundingClientRect();
                    const editorRect = editorRef.current?.getBoundingClientRect();
                    
                    if (editorRef.current && rect && editorRect) {
                      setTableMenuPosition({
                        top: rect.top - editorRect.top + 30,
                        left: rect.right - editorRect.left - 170
                      });
                      setShowTableMenu(true);
                      return;
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error positioning table menu:", error);
        }
      }
      
      setShowTableMenu(false);
    }
  });

  // Handle featured image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove featured image
  const removeImage = () => {
    setImage(null);
    setPreview('');
    setImageAlt('');
  };

  // Calculate word count and read time from Tiptap content
  useEffect(() => {
    if (editor) {
      // Set initial content
      if (content && editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  // Calculate word count and reading time
  useEffect(() => {
    if (content) {
      // Strip HTML to get plain text
      const plainText = content.replace(/<[^>]*>/g, ' ');
      // Calculate word count
      const words = plainText.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      
      // Calculate estimated read time (average reading speed: 200-250 words per minute)
      const readTimeMinutes = Math.ceil(words.length / 225);
      setEstimatedReadTime(readTimeMinutes);
    } else {
      setWordCount(0);
      setEstimatedReadTime(0);
    }
  }, [content, setWordCount, setEstimatedReadTime]);

  // Function to generate table of contents from editor content
  const generateTableOfContents = useCallback(() => {
    if (!editor) return [];
    
    const json = editor.getJSON();
    const headings = [];
    
    // Function to recursively traverse the document and find headings
    const findHeadings = (nodes) => {
      if (!nodes) return;
      
      nodes.forEach(node => {
        if (node.type === 'heading') {
          // Extract the full text content from the heading node
          let headingText = '';
          const extractText = (contentNodes) => {
            if (!contentNodes) return;
            contentNodes.forEach(n => {
              if (n.text) {
                headingText += n.text;
              }
              if (n.content) {
                extractText(n.content);
              }
            });
          };
          
          extractText(node.content);
          
          // Check if the heading contains a bullet or checkmark symbol
          const hasCheckmark = headingText.includes('✅');
          const hasBullet = headingText.includes('•') || headingText.includes('·');
          
          // Clean up the text by removing special characters
          const cleanText = headingText
            .replace(/✅/g, '')
            .replace(/•/g, '')
            .replace(/·/g, '')
            .trim();
          
          // Create a slug for the heading
          const slug = slugify(cleanText);
          
          headings.push({
            level: node.attrs.level,
            text: cleanText,
            hasCheckmark,
            hasBullet,
            originalText: headingText,
            slug: slug
          });
        }
        
        if (node.content) {
          findHeadings(node.content);
        }
      });
    };
    
    findHeadings(json.content);
    
    // Analyze if we have a numbered section
    let hasNumberedHeadings = false;
    const numberPrefixRegex = /^\d+\.\s+/;
    
    headings.forEach(heading => {
      if (numberPrefixRegex.test(heading.text)) {
        hasNumberedHeadings = true;
        // Extract the number and clean the text
        const match = heading.text.match(numberPrefixRegex);
        if (match) {
          heading.number = match[0].trim();
          heading.text = heading.text.replace(numberPrefixRegex, '');
        }
      }
    });
    
    // Set numbering for levels if needed
    if (hasNumberedHeadings) {
      let counters = [0, 0, 0, 0, 0, 0]; // h1 to h6
      
      headings.forEach(heading => {
        if (!heading.number) {
          // Only auto-number if it's a heading that should have a number
          const level = heading.level;
          counters[level - 1]++;
          // Reset all lower level counters
          for (let i = level; i < counters.length; i++) {
            counters[i] = 0;
          }
          heading.number = `${counters[level - 1]}.`;
        }
      });
    }
    
    return headings;
  }, [editor]);
  const addIdsToHeadings = useCallback(() => {
    if (!editor) return;
    
    // Find all heading nodes and add IDs to them
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        // Extract text from the heading
        let headingText = '';
        node.content.forEach(child => {
          if (child.text) {
            headingText += child.text;
          }
        });
        
        // Clean and create slug
        const cleanText = headingText
          .replace(/✅/g, '')
          .replace(/•/g, '')
          .replace(/·/g, '')
          .trim();
        
        const id = slugify(cleanText);
        
        // Set ID attribute on the heading
        editor.commands.updateAttributes('heading', { 
          id: id,
          'data-anchor': id
        }, { from: pos, to: pos + node.nodeSize });
      }
    });
    
    // Show success message
    setSaveSnackbar({
      open: true,
      message: 'Heading anchors added successfully',
      severity: 'success'
    });
  }, [editor]);
  // Function to insert the ToC into the editor
  const insertTableOfContents = useCallback(() => {
    if (!editor || tableOfContents.length === 0) return;
    
    // First, add IDs to all headings in the document
    addIdsToHeadings();
    
    // Create a plain TOC HTML with no styling whatsoever
    let tocHtml = `
      <div>
        <h2>Table of Contents</h2>
        <ul>
    `;
    
    tableOfContents.forEach((heading, index) => {
      // Add basic list item with link - no styling at all
      const number = heading.number ? `${heading.number} ` : '';
      
      tocHtml += `
        <li>
          <a href="#${heading.slug}">${number}${heading.text}</a>
        </li>
      `;
    });
    
    tocHtml += `
        </ul>
      </div>
    `;
    
    // Insert the TOC at the current cursor position
    editor.commands.insertContent(tocHtml);
    
    // Close the dialog
    setTocDialogOpen(false);
  }, [editor, tableOfContents, addIdsToHeadings]);
  
  // Function to check accessibility
  const checkAccessibility = useCallback(() => {
    if (!editor || !content) return null;
    
    const results = { 
      score: 100,
      issues: [],
      passes: []
    };
    
    // Check images for alt text
    const imgRegex = /<img[^>]*>/g;
    const images = [...content.matchAll(imgRegex)];
    const imagesWithoutAlt = images.filter(img => !img[0].includes('alt=') || img[0].includes('alt=""'));
    
    if (imagesWithoutAlt.length > 0) {
      results.score -= 15;
      results.issues.push({
        severity: 'error',
        message: `${imagesWithoutAlt.length} image(s) missing alt text`,
        recommendation: 'Add descriptive alt text to all images for screen readers'
      });
    } else if (images.length > 0) {
      results.passes.push({
        message: 'All images have alt text'
      });
    }
    
    // Check heading structure
    const headings = [];
    const json = editor.getJSON();
    
    const findHeadings = (nodes) => {
      if (!nodes) return;
      nodes.forEach(node => {
        if (node.type === 'heading') {
          headings.push({
            level: node.attrs.level,
            text: node.content?.[0]?.text || ''
          });
        }
        if (node.content) findHeadings(node.content);
      });
    };
    
    findHeadings(json.content);
    
    // Check if headings are in proper order (no skipping levels)
    if (headings.length > 0) {
      let prevLevel = 0;
      const skippedLevels = [];
      
      headings.forEach(h => {
        if (h.level > prevLevel + 1 && prevLevel !== 0) {
          skippedLevels.push({from: prevLevel, to: h.level});
        }
        prevLevel = h.level;
      });
      
      if (skippedLevels.length > 0) {
        results.score -= 10;
        results.issues.push({
          severity: 'warning',
          message: 'Heading levels are skipped in document structure',
          recommendation: 'Use sequential heading levels (e.g., H2 should follow H1, H3 should follow H2)'
        });
      } else {
        results.passes.push({
          message: 'Heading structure is sequential'
        });
      }
    } else {
      results.score -= 5;
      results.issues.push({
        severity: 'warning',
        message: 'No headings found in content',
        recommendation: 'Use headings (H1-H6) to structure your content and improve readability'
      });
    }
    
    // Check links for descriptive text
    const linkRegex = /<a[^>]*>([^<]*)<\/a>/g;
    const links = [...content.matchAll(linkRegex)];
    const poorLinkText = links.filter(link => {
      const text = link[1].toLowerCase().trim();
      return text === 'click here' || text === 'link' || text === 'here' || text === 'this link' || text.length < 3;
    });
    
    if (poorLinkText.length > 0) {
      results.score -= 10;
      results.issues.push({
        severity: 'warning',
        message: `${poorLinkText.length} link(s) have non-descriptive text`,
        recommendation: 'Use descriptive link text instead of "click here" or "link"'
      });
    } else if (links.length > 0) {
      results.passes.push({
        message: 'All links have descriptive text'
      });
    }
    
    // Check table accessibility (tables should have headers)
    const tableRegex = /<table[^>]*>/g;
    const tables = [...content.matchAll(tableRegex)];
    
    if (tables.length > 0) {
      const tableHeaderRegex = /<th[^>]*>/g;
      const tablesWithHeaders = [...content.matchAll(tableHeaderRegex)];
      
      if (tablesWithHeaders.length === 0) {
        results.score -= 10;
        results.issues.push({
          severity: 'warning',
          message: 'Tables should include header cells (<th>)',
          recommendation: 'Add header cells to tables for better screen reader navigation'
        });
      } else {
        results.passes.push({
          message: 'Tables include header cells'
        });
      }
    }
    
    // Check for excessively long paragraphs (readability)
    const paragraphRegex = /<p[^>]*>([^<]*)<\/p>/g;
    const paragraphs = [...content.matchAll(paragraphRegex)];
    const longParagraphs = paragraphs.filter(p => p[1].split(' ').length > 100);
    
    if (longParagraphs.length > 0) {
      results.score -= 5;
      results.issues.push({
        severity: 'info',
        message: `${longParagraphs.length} paragraph(s) are excessively long`,
        recommendation: 'Consider breaking up paragraphs longer than 100 words for better readability'
      });
    }
    
    return results;
  }, [editor, content]);

  // Function to open accessibility dialog
  const handleCheckAccessibility = useCallback(() => {
    const results = checkAccessibility();
    setAccessibilityResults(results);
    setAccessibilityDialogOpen(true);
  }, [checkAccessibility]);

  // Add this dialog component
  const AccessibilityDialog = () => {
    return (
      <Dialog 
        open={accessibilityDialogOpen} 
        onClose={() => setAccessibilityDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessibilityOutlined />
            <Typography>Accessibility Check</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {accessibilityResults ? (
            <>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Paper
                  sx={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: 
                      accessibilityResults.score >= 90 ? theme.palette.success.light :
                      accessibilityResults.score >= 70 ? theme.palette.warning.light :
                      theme.palette.error.light,
                    color: 
                      accessibilityResults.score >= 90 ? theme.palette.success.contrastText :
                      accessibilityResults.score >= 70 ? theme.palette.warning.contrastText :
                      theme.palette.error.contrastText,
                  }}
                >
                  <Typography variant="h4">{accessibilityResults.score}</Typography>
                </Paper>
                <Box>
                  <Typography variant="h6">
                    {accessibilityResults.score >= 90 
                      ? 'Great accessibility!' 
                      : accessibilityResults.score >= 70 
                      ? 'Good accessibility with some issues'
                      : 'Needs accessibility improvements'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Addressing these issues will make your content more accessible to all users.
                  </Typography>
                </Box>
              </Box>
              
              {accessibilityResults.issues.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom>Issues to Fix</Typography>
                  <Paper variant="outlined" sx={{ mb: 3 }}>
                    {accessibilityResults.issues.map((issue, i) => (
                      <Box 
                        key={i} 
                        sx={{ 
                          p: 2, 
                          borderBottom: i < accessibilityResults.issues.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        {issue.severity === 'error' ? (
                          <ErrorOutline color="error" />
                        ) : issue.severity === 'warning' ? (
                          <WarningAmber color="warning" />
                        ) : (
                          <InfoOutlined color="info" />
                        )}
                        <Box>
                          <Typography variant="subtitle2">{issue.message}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {issue.recommendation}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </>
              )}
              
              {accessibilityResults.passes.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom>Passing Checks</Typography>
                  <Paper variant="outlined">
                    {accessibilityResults.passes.map((pass, i) => (
                      <Box 
                        key={i} 
                        sx={{ 
                          p: 2, 
                          borderBottom: i < accessibilityResults.passes.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                          display: 'flex',
                          gap: 2
                        }}
                      >
                        <CheckCircleOutline color="success" />
                        <Typography variant="body1">{pass.message}</Typography>
                      </Box>
                    ))}
                  </Paper>
                </>
              )}
            </>
          ) : (
            <Typography>No content to analyze</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccessibilityDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Function to save content
  const saveContent = useCallback(() => {
    if (!content) return;
    
    // Save to localStorage as backup
    localStorage.setItem('blog_content_draft', content);
    
    // Set last saved timestamp
    const now = new Date();
    setLastSaved(now);
    
    // Show feedback
    setSaveSnackbar({
      open: true,
      message: `Draft saved at ${now.toLocaleTimeString()}`,
      severity: 'success'
    });
    
    // Here you would typically also save to your backend
    // This depends on your app's architecture
    // For example: saveContentToAPI(content);
  }, [content]);

  // Setup autosave interval
  useEffect(() => {
    if (autosaveEnabled) {
      // Save every 60 seconds
      autosaveIntervalRef.current = setInterval(() => {
        saveContent();
      }, 60000);
    }
    
    // Check for drafts on component mount
    const savedDraft = localStorage.getItem('blog_content_draft');
    if (savedDraft && !content && editor) {
      // Ask user if they want to restore
      const confirmRestore = window.confirm(
        'We found a saved draft. Would you like to restore it?'
      );
      
      if (confirmRestore) {
        editor.commands.setContent(savedDraft);
        setSaveSnackbar({
          open: true,
          message: 'Restored saved draft',
          severity: 'info'
        });
      } else {
        // Clear the saved draft if user declines
        localStorage.removeItem('blog_content_draft');
      }
    }
    
    // Cleanup interval on unmount
    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, [autosaveEnabled, content, editor, saveContent]);

  // Close snackbar handler
  const handleCloseSnackbar = () => {
    setSaveSnackbar(prev => ({ ...prev, open: false }));
  };

  // Toggle autosave
  const toggleAutosave = () => {
    setAutosaveEnabled(prev => !prev);
    setSaveSnackbar({
      open: true,
      message: autosaveEnabled ? 'Autosave disabled' : 'Autosave enabled',
      severity: 'info'
    });
    
    if (autosaveIntervalRef.current) {
      clearInterval(autosaveIntervalRef.current);
      autosaveIntervalRef.current = null;
    }
  };

  // Add this after the editor initialization to make sure links are clickable
  useEffect(() => {
    if (editor) {
      // Get the editor DOM element
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        // Add click event listener
        editorElement.addEventListener('click', (e) => {
          // Check if the clicked element is a link
          if (e.target.tagName === 'A' && e.target.hasAttribute('href')) {
            const href = e.target.getAttribute('href');
            
            // Check if it's an anchor link
            if (href.startsWith('#')) {
              e.preventDefault();
              
              // Get the target element
              const targetId = href.substring(1);
              const targetElement = document.getElementById(targetId);
              
              if (targetElement) {
                // Scroll to the target heading
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        });
      }
    }
  }, [editor]);

  // Add a contextmenu handler to make headings anchors
  useEffect(() => {
    if (editor) {
      // Get the editor DOM element
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        // Add contextmenu event listener for headings
        editorElement.addEventListener('contextmenu', (e) => {
          // Check if right-clicked on a heading element
          const headingElement = e.target.closest('h1, h2, h3, h4, h5, h6');
          if (headingElement) {
            e.preventDefault();
            
            // Get heading text and create a slug
            const headingText = headingElement.textContent;
            const id = slugify(headingText);
            
            // Set the ID attribute on the heading
            headingElement.id = id;
            
            // Optional: Show a small notification
            alert(`Created anchor for "${headingText}"`);
          }
        });
      }
    }
  }, [editor]);

  // Add function to open TOC dialog
  const handleOpenTocDialog = useCallback(() => {
    // Generate TOC before opening dialog
    const toc = generateTableOfContents();
    setTableOfContents(toc);
    setTocDialogOpen(true);
  }, [generateTableOfContents]);

  // Add the TableOfContentsDialog component
  const TableOfContentsDialog = () => {
    return (
      <Dialog
        open={tocDialogOpen}
        onClose={() => setTocDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TocOutlined sx={{ mr: 1 }} />
            <Typography variant="h6">Table of Contents</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {tableOfContents.length > 0 ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Preview of your Table of Contents:
              </Typography>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  maxHeight: '300px', 
                  overflow: 'auto',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa'
                }}
              >
                {/* Simplified table of contents preview - one link per line */}
                <List sx={{ width: '100%', p: 0 }}>
                  {tableOfContents.map((heading, index) => (
                    <ListItem 
                      key={index} 
                      dense
                      disableGutters
                      sx={{ 
                        pl: heading.level * 2, 
                        py: 0.75,
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '2px solid transparent',
                        ml: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)',
                          borderLeft: `2px solid ${theme.palette.primary.main}`,
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {heading.hasCheckmark && (
                          <CheckCircleOutline color="success" fontSize="small" sx={{ mr: 1, flexShrink: 0 }} />
                        )}
                        
                        {heading.hasBullet && (
                          <FormatListBulletedIcon fontSize="small" sx={{ mr: 1, flexShrink: 0 }} />
                        )}
                        
                        {heading.number && (
                          <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }}>
                            {heading.number}
                          </Typography>
                        )}
                        
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            fontWeight: heading.level <= 2 ? 600 : 400,
                            fontSize: heading.level === 1 ? '0.95rem' : '0.875rem',
                            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {heading.text}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {tableOfContents.length} headings found
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch 
                      size="small"
                      checked={tableOfContents.some(h => h.number)}
                      disabled
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FormatListNumberedIcon fontSize="small" />
                      <Typography variant="body2">Numbered headings</Typography>
                    </Box>
                  }
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This will insert a simple, unstyled table of contents with basic list items.
                All headings in your document will automatically receive anchor links.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error" gutterBottom>
                No headings found in your content
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some headings (H1-H6) to your content first, then generate a table of contents.
              </Typography>
              <Button
                startIcon={<FormatListBulletedIcon />}
                sx={{ mt: 2 }}
                onClick={() => setTocDialogOpen(false)}
              >
                Go Back to Editor
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTocDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={insertTableOfContents}
            disabled={tableOfContents.length === 0}
            startIcon={<FormatListNumberedIcon />}
            variant="contained"
          >
            Insert Table of Contents
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 1.5,
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Article fontSize="small" />
        Content
      </Typography>
      
      {/* Word count and read time stats */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 2,
          p: 2,
          borderRadius: '10px',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.03)'
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Word Count</Typography>
          <Typography variant="h6">{wordCount}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Estimated Read Time</Typography>
          <Typography variant="h6">{estimatedReadTime} {estimatedReadTime === 1 ? 'minute' : 'minutes'}</Typography>
        </Box>
      </Box>
      
      {/* Tiptap Editor */}
      <Box 
        ref={editorRef}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '10px',
          mb: 4,
          position: 'relative',
          '& .ProseMirror': {
            minHeight: '350px',
            padding: '16px',
            fontSize: '1rem',
            '&:focus': {
              outline: 'none',
            },
            '& p': {
              marginBottom: '0.75em',
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: '1em',
              marginBottom: '0.5em',
            },
            '& ul, & ol': {
              paddingLeft: '1.5em',
              marginBottom: '0.75em',
            },
            '& blockquote': {
              borderLeft: `4px solid ${theme.palette.divider}`,
              paddingLeft: '1em',
              fontStyle: 'italic',
              margin: '1em 0',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '4px',
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
            },
            '& code': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
              padding: '2px 4px',
              borderRadius: '4px',
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
              padding: '0.75em',
              borderRadius: '4px',
              overflow: 'auto',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
            // Table styles
            '& table': {
              borderCollapse: 'collapse',
              marginBottom: '1em',
              width: '100%',
              tableLayout: 'fixed',
              '& td, & th': {
                border: `1px solid ${theme.palette.divider}`,
                padding: '0.5em',
                position: 'relative',
                verticalAlign: 'top',
              },
              '& th': {
                fontWeight: 'bold',
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)',
              },
              '& p': {
                margin: 0,
              }
            },
            // Table resize handle styles
            '& .tableColumnResizer': {
              position: 'absolute',
              right: '-2px',
              top: 0,
              bottom: 0,
              width: '4px',
              background: 'transparent',
              cursor: 'col-resize',
              '&:hover, &.dragging': {
                background: theme.palette.primary.main,
              },
            },
          },
        }}
      >
        {editor && <MenuBar editor={editor} />}
        <EditorContent editor={editor} />
        
        {/* Table Menu - Positioned above the selected table */}
        {showTableMenu && editor && (
          <Box 
            sx={{ 
              position: 'absolute',
              top: tableMenuPosition.top,
              left: tableMenuPosition.left,
              zIndex: 10
            }}
          >
            <TableMenu editor={editor} />
          </Box>
        )}
      </Box>

      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <PhotoCamera fontSize="small" />
        Featured Image
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <input
          accept="image/*"
          type="file"
          id="image-upload"
          hidden
          onChange={handleImageChange}
        />
        <label htmlFor="image-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<PhotoCamera />}
            sx={{
              backgroundColor: preview ? theme.palette.primary.main : 'transparent',
              color: preview ? '#fff' : theme.palette.primary.main,
              border: preview ? 'none' : `1px solid ${theme.palette.primary.main}`,
              borderRadius: '10px',
              px: 3,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: preview ? theme.shadows[2] : 'none',
              '&:hover': {
                backgroundColor: preview ? theme.palette.primary.dark : 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            {preview ? 'Change Image' : 'Upload Image'}
          </Button>
        </label>
        {!preview && (
          <Typography variant="caption" color="text.secondary">
            Recommended size: 1200 x 630 pixels (Max: 5MB)
          </Typography>
        )}
      </Box>

      {preview && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <Paper
              elevation={3}
              sx={{
                p: 1,
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: theme.palette.background.default,
              }}
            >
              <img
                src={getImageUrl(preview)}
                alt={imageAlt || "Featured blog image"}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  maxHeight: '300px',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </Paper>
            <IconButton
              sx={{
                position: 'absolute',
                top: -12,
                right: -12,
                backgroundColor: theme.palette.error.main,
                color: '#fff',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  backgroundColor: theme.palette.error.dark,
                },
                border: `2px solid ${theme.palette.background.paper}`,
              }}
              size="small"
              onClick={removeImage}
            >
              <Close fontSize="small" />
            </IconButton>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Chip 
                label="Featured Image" 
                size="small" 
                color="primary" 
                sx={{ borderRadius: '8px' }}
              />
            </Box>
          </Box>
          
          {/* Alt Text Input */}
          <TextField
            label="Image Alt Text"
            placeholder="Describe the image for accessibility and SEO"
            value={imageAlt || ''}
            onChange={(e) => setImageAlt(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mt: 2, mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessibilityNew fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2, 
            color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.main
          }}>
            <Info fontSize="small" />
            <Typography variant="caption" color="inherit">
              Good alt text accurately describes the image content for people who can't see it, improving accessibility and SEO.
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Alt text prompt modal for image in content */}
      <ImageModal 
        open={missingAltTextModalOpen} 
        onClose={() => setMissingAltTextModalOpen(false)}
        onInsert={(data) => {
          if (currentImageWithoutAlt && data.alt) {
            // Logic to update the alt text of the image in the editor would go here
            setMissingAltTextModalOpen(false);
            setCurrentImageWithoutAlt(null);
          }
        }}
      />

    
      <TableOfContentsDialog />

      {/* Add the accessibility button somewhere visible in the UI */}
      <Box sx={{ mt: 2, mb: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<TocOutlined />}
          onClick={handleOpenTocDialog}
          sx={{ textTransform: 'none' }}
        >
          Generate Table of Contents
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<AccessAlarmsOutlined />}
          onClick={handleCheckAccessibility}
          sx={{ textTransform: 'none' }}
        >
          Check Accessibility
        </Button>
        <Button
          variant="outlined"
          startIcon={<Save />}
          onClick={saveContent}
          sx={{ textTransform: 'none' }}
        >
          Save Content
        </Button>
      </Box>
      <AccessibilityDialog />

      {/* Autosave Snackbar */}
      <Snackbar 
        open={saveSnackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={saveSnackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {saveSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Define a styled Divider component for the toolbar
const Divider = ({ orientation, flexItem, sx }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: orientation === 'vertical' ? '1px' : '100%',
        height: orientation === 'vertical' ? '24px' : '1px',
        backgroundColor: theme.palette.divider,
        flexShrink: 0,
        ...sx,
      }}
    />
  );
};

export default ContentTab; 