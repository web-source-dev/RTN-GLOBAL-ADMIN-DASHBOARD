import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Stack,
  useTheme,
} from '@mui/material';
import { Description, Category, LocalOffer } from '@mui/icons-material';

const BasicDetailsTab = ({
  title,
  setTitle,
  slug,
  setSlug,
  description,
  setDescription,
  category,
  setCategory,
  tags,
  setTags,
  tagInput,
  setTagInput,
  isFeatured,
  setIsFeatured,
  customCategories,
  setCustomCategories,
  allCategories,
}) => {
  const theme = useTheme();

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

  return (
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
    </Stack>
  );
};

export default BasicDetailsTab; 