import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  Divider,
  useTheme,
  InputAdornment,
} from '@mui/material';
import { Search, Link, KeyboardArrowRight, TipsAndUpdates } from '@mui/icons-material';
import SeoScoreDisplay from './SeoScoreDisplay';
import { calculateSeoScore } from '../utils/SeoValidator';

const SeoTab = ({
  title,
  description,
  content,
  slug,
  tags,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoKeywords,
  setSeoKeywords,
  canonicalUrl,
  setCanonicalUrl,
  noIndex,
  setNoIndex,
  newSeoKeyword,
  setNewSeoKeyword,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) => {
  const theme = useTheme();
  const [seoAnalysis, setSeoAnalysis] = useState(null);

  // Run SEO analysis whenever relevant fields change
  useEffect(() => {
    const blogData = {
      title,
      description,
      content,
      slug,
      tags,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      noIndex,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
    };

    const analysis = calculateSeoScore(blogData);
    setSeoAnalysis(analysis);
  }, [
    title, 
    description, 
    content, 
    slug, 
    tags, 
    seoTitle, 
    seoDescription, 
    seoKeywords, 
    canonicalUrl, 
    noIndex,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
  ]);

  const handleAddKeyword = () => {
    if (newSeoKeyword && !seoKeywords.includes(newSeoKeyword)) {
      setSeoKeywords([...seoKeywords, newSeoKeyword]);
      setNewSeoKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setSeoKeywords(seoKeywords.filter(k => k !== keyword));
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
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
            <Search fontSize="small" />
            SEO Settings
          </Typography>

          <TextField
            label="SEO Title"
            placeholder={title || "Enter SEO title"}
            variant="outlined"
            fullWidth
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color={seoTitle?.length > 60 ? "error" : "text.secondary"}>
                    {seoTitle?.length || 0}/60
                  </Typography>
                </InputAdornment>
              ),
            }}
            helperText="Optimal length: 50-60 characters. If left empty, the blog title will be used."
          />

          <TextField
            label="SEO Description"
            placeholder={description || "Enter SEO description"}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color={seoDescription?.length > 160 ? "error" : "text.secondary"}>
                    {seoDescription?.length || 0}/160
                  </Typography>
                </InputAdornment>
              ),
            }}
            helperText="Optimal length: 120-160 characters. If left empty, the blog description will be used."
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>SEO Keywords</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Add SEO keyword"
                size="small"
                value={newSeoKeyword}
                onChange={(e) => setNewSeoKeyword(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddKeyword}
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
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Keywords help search engines understand your content. If left empty, tags will be used.
            </Typography>
            
            {seoKeywords.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {seoKeywords.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    onDelete={() => handleRemoveKeyword(keyword)}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: '8px' }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <TextField
            label="Canonical URL"
            placeholder="https://example.com/blog/post-url"
            variant="outlined"
            fullWidth
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Link fontSize="small" />
                </InputAdornment>
              ),
            }}
            helperText="Use this field to specify the preferred URL for this content (helps with duplicate content issues)"
          />

          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: '10px',
              border: `1px solid ${noIndex ? theme.palette.error.light : theme.palette.divider}`,
              backgroundColor: noIndex ? 
                theme.palette.mode === 'dark' ? 'rgba(239, 83, 80, 0.08)' : 'rgba(239, 83, 80, 0.05)' 
                : 'transparent'
            }}
          >
            <Box>
              <Typography variant="subtitle2">No Index</Typography>
              <Typography variant="body2" color="text.secondary">
                If enabled, this post will not appear in search engines
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={noIndex}
                  onChange={(e) => setNoIndex(e.target.checked)}
                  color={noIndex ? "error" : "primary"}
                />
              }
              label=""
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box 
            sx={{ 
              p: 2, 
              borderRadius: '10px',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(0, 150, 136, 0.08)' 
                : 'rgba(0, 150, 136, 0.05)',
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TipsAndUpdates sx={{ color: theme.palette.success.main, mr: 1 }} />
              <Typography variant="subtitle2" fontWeight={600}>
                SEO Tips
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Use your primary keyword in the title, description, and content
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Keep title length between 50-60 characters for optimal display in search results
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Create a compelling meta description that encourages clicks (120-160 characters)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Use a clean, descriptive URL slug with your primary keyword
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
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
            <KeyboardArrowRight fontSize="small" />
            SEO Analysis
          </Typography>

          {/* SEO Score and Analysis */}
          <SeoScoreDisplay seoAnalysis={seoAnalysis} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SeoTab; 