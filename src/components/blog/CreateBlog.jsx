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
  useTheme
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../../BackendAPi/ApiProvider';

const CreateBlog = () => {
  const theme = useTheme();
  const { id } = useParams(); // Get blog ID if editing
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    setInitialLoading(true);
    try {
      const response = await API.get(`/api/blogs/${id}`);
      const data = response.data;
      setTitle(data.title);
      setDescription(data.description);
      setContent(data.content);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('content', content);
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
  
      navigate('/blog/manage');
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          background: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            mb: 3
          }}
        >
          {id ? 'Edit Blog Post' : 'Create New Blog Post'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <TextField
              label="Blog Title"
              variant="outlined"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
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
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            <Box>
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{ 
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  mb: 2
                }}
              >
                Content
              </Typography>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                style={{ 
                  height: '400px', 
                  marginBottom: '50px',
                  backgroundColor: theme.palette.background.default,
                }}
              />
            </Box>

            <Box>
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                hidden
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  {preview ? 'Change Image' : 'Upload Image'}
                </Button>
              </label>

              {preview && (
                <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ 
                      maxWidth: '300px', 
                      maxHeight: '300px',
                      borderRadius: theme.shape.borderRadius,
                      boxShadow: theme.shadows[2],
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: theme.shadows[2],
                      '&:hover': {
                        backgroundColor: theme.palette.error.light,
                      },
                    }}
                    size="small"
                    onClick={removeImage}
                  >
                    <Close />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  minWidth: 120,
                  height: 45,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  id ? 'Update' : 'Publish'
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/blog/manage')}
                sx={{
                  minWidth: 120,
                  height: 45,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateBlog;
