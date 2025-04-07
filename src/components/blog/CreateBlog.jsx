import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  IconButton,
  CircularProgress,
  useTheme,
  Divider,
  Fade,
  Chip,
  FormControlLabel,
  Switch,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { PhotoCamera, Close, ArrowBack, Article, Description, LocalOffer, Category } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../../BackendAPi/ApiProvider';

// Predefined categories
const CATEGORIES = [
  'Web Development',
  'Digital Marketing',
  'SEO',
  'Content Strategy',
  'Design',
  'Technology',
  'Business',
  'News',
  'Tutorials',
  'Case Studies',
  'Uncategorized'
];

const CreateBlog = () => {
  const theme = useTheme();
  const { id } = useParams(); // Get blog ID if editing
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([...CATEGORIES]);

  useEffect(() => {
    // Fetch existing categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await API.get('/api/blogs/categories');
        const fetchedCategories = response.data;
        
        // Combine with predefined categories, remove duplicates
        const combined = [...new Set([...CATEGORIES, ...fetchedCategories])];
        setAllCategories(combined);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fall back to predefined categories
      }
    };

    fetchCategories();

    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Generate slug from title
  useEffect(() => {
    if (title && !id && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, id, slug]);

  const fetchBlog = async () => {
    setInitialLoading(true);
    try {
      const response = await API.get(`/api/blogs/${id}`);
      const data = response.data;
      setTitle(data.title);
      setSlug(data.slug || '');
      setDescription(data.description);
      setContent(data.content);
      setCategory(data.category || 'Uncategorized');
      setTags(data.tags || []);
      setIsFeatured(data.isFeatured || false);
      if (data.image) {
        setPreview(`${process.env.REACT_APP_API_URL}${data.image}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('tags', JSON.stringify(tags));
      formData.append('isFeatured', isFeatured);
      
      if (image) {
        formData.append('image', image);
      }
  
      let response;
      
      if (id) {
        response = await API.patch(`/api/blogs/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await API.post('/api/blogs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
  
      navigate('/admin/blog/manage');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'], // Add image, video, and link options
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'align',
    'color',
    'background',
  ];
  
  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/blog/manage')}
          sx={{
            mb: 3,
            fontWeight: 500,
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: 'transparent',
              transform: 'translateX(-4px)',
              transition: 'all 0.3s ease-in-out'
            },
          }}
        >
          Back to Blogs
        </Button>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 5 },
            borderRadius: '16px',
            background: theme.palette.background.paper,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              }}
            >
              <Article sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                }}
              >
                {id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: theme.palette.text.secondary,
                  mt: 0.5,
                }}
              >
                {id ? 'Update your existing post with new content' : 'Share your thoughts and insights with the world'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4,
                borderRadius: '8px',
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
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
                  <Description fontSize="small" />
                  Blog Details
                </Typography>
                
                {/* Featured Post Switch */}
                <Box 
                  sx={{ 
                    mb: 3, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    borderRadius: '10px',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: isFeatured ? 
                      theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(33, 150, 243, 0.05)' 
                      : 'transparent'
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">Featured Post</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Featured posts appear prominently on the homepage
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </Box>
                
                <TextField
                  label="Blog Title"
                  variant="outlined"
                  fullWidth
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: '1px',
                      },
                    },
                    '& .MuiInputLabel-outlined': {
                      '&.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                
                {/* Slug field */}
                <TextField
                  label="URL Slug"
                  variant="outlined"
                  fullWidth
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}
                  helperText="Custom URL path for the blog post (auto-generated from title if left empty)"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />

                <TextField
                  label="Short Description"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: '1px',
                      },
                    },
                    '& .MuiInputLabel-outlined': {
                      '&.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                
                {/* Category Select */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{
                      borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.divider,
                      },
                    }}
                    startAdornment={<Category sx={{ mr: 1, color: 'action.active' }} />}
                  >
                    {allCategories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                    <MenuItem value="custom">
                      <em>Add Custom Category</em>
                    </MenuItem>
                  </Select>
                </FormControl>
                
                {/* Custom Category Input */}
                {category === 'custom' && (
                  <TextField
                    label="Custom Category"
                    variant="outlined"
                    fullWidth
                    value={customCategories}
                    onChange={(e) => {
                      setCustomCategories(e.target.value);
                      setCategory(e.target.value);
                    }}
                    sx={{ mb: 3, borderRadius: '10px' }}
                  />
                )}
                
                {/* Tags Input */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <LocalOffer fontSize="small" />
                    Tags
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <TextField
                      variant="outlined"
                      placeholder="Add a tag"
                      size="small"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddTag}
                      sx={{
                        borderRadius: '10px',
                        px: 2,
                        py: 1,
                        minWidth: '80px',
                        textTransform: 'none',
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  
                  {tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: '8px' }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>

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
                    }
                  }}
                >
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                  />
                </Box>
              </Box>

              <Box>
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
                  <Box sx={{ mt: 3, position: 'relative', display: 'inline-block' }}>
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
                        alt="Preview"
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
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/blog/manage')}
                  sx={{
                    borderRadius: '10px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      borderColor: theme.palette.text.secondary,
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    borderRadius: '10px',
                    px: 4,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" thickness={4} />
                  ) : (
                    id ? 'Update Post' : 'Publish Post'
                  )}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Fade>
  );
};

export default CreateBlog;
