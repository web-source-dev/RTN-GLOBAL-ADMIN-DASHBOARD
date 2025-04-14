import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  useTheme,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { Article, PhotoCamera, Close, AccessibilityNew, Info } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Import Quill globally to access Delta constructor
const Quill = ReactQuill.Quill;
const Delta = Quill.import('delta');

// Custom image handler to prompt for alt text
const imageHandler = function() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (/^image\//.test(file.type)) {
      // Create a prompt for alt text
      const altText = prompt('Please enter alt text for this image (for accessibility and SEO):');
      
      // Save to server or convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const range = this.quill.getSelection(true);
        
        // Insert the image with alt text into the editor
        if (altText && altText.trim() !== '') {
          // Use Delta operations to insert the image with alt text attribute
          // This ensures the alt text is stored in the Quill content model
          const delta = new Delta()
            .retain(range.index)
            .insert({
              image: reader.result
            }, {
              alt: altText.trim()
            });
          
          this.quill.updateContents(delta, 'user');
          
          // Double check that the alt text is set in the HTML as well
          setTimeout(() => {
            const imageNode = this.quill.root.querySelector(`img[src="${reader.result}"]`);
            if (imageNode && (!imageNode.getAttribute('alt') || imageNode.getAttribute('alt') === '')) {
              imageNode.setAttribute('alt', altText.trim());
            }
          }, 10);
        } else {
          // Insert without alt text if none provided
          this.quill.insertEmbed(range.index, 'image', reader.result);
        }
        
        this.quill.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    }
  };
};

// Function to ensure all images have their alt text attributes properly set
const ensureImagesHaveAltText = (quillEditor) => {
  if (!quillEditor) return;
  
  // Get all images in the editor
  const images = quillEditor.root.querySelectorAll('img');
  
  // Check if we need to update the content's Delta
  let needsDeltaUpdate = false;
  const ops = [];
  
  // Check each image
  images.forEach(img => {
    const src = img.getAttribute('src');
    const altText = img.getAttribute('alt');
    
    // If the alt attribute is missing or empty but the src exists
    if (src && (!altText || altText === '')) {
      // Ask user for alt text for this specific image
      const newAltText = prompt('Please enter alt text for this image (for accessibility and SEO):', '');
      
      if (newAltText && newAltText.trim() !== '') {
        // Set the alt text on the DOM element
        img.setAttribute('alt', newAltText.trim());
        needsDeltaUpdate = true;
      }
    }
  });
  
  // If we made changes to any images, force a content update to preserve changes
  if (needsDeltaUpdate) {
    // This will trigger the onChange handler and update the content state
    quillEditor.setContents(quillEditor.getContents());
  }
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

  const removeImage = () => {
    setImage(null);
    setPreview('');
    setImageAlt('');
  };

  // Calculate word count and read time on content change
  React.useEffect(() => {
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

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'script',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'size',
    'font',
    'color',
    'background',
    'link',
    'image',
    'video',
  ];

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
      
      <Box 
        sx={{
          '.ql-toolbar': {
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderColor: theme.palette.divider,
          },
          '.ql-container': {
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            borderColor: theme.palette.divider,
            minHeight: '350px',
            fontSize: '1rem',
          },
          '.ql-editor': {
            minHeight: '350px',
          },
          mb: 4
        }}
      >
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Write your blog content here..."
        />
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
                src={preview}
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
    </Box>
  );
};

export default ContentTab; 