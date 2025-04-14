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
  InputLabel,
  Tabs,
  Tab,
  Badge,
  Drawer,
  Tooltip
} from '@mui/material';
import { PhotoCamera, Close, ArrowBack, Article, Description, LocalOffer, Category, Search, Share, Settings, CheckCircle, Warning, Analytics, ChevronLeft, ChevronRight } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../../BackendAPi/ApiProvider';

// Import tab components
import BasicDetailsTab from './createBlogTabs/BasicDetailsTab';
import ContentTab from './createBlogTabs/ContentTab';
import SeoTab from './createBlogTabs/SeoTab';
import SocialMediaTab from './createBlogTabs/SocialMediaTab';
import SettingsTab from './createBlogTabs/SettingsTab';
import SeoScoreDisplay from './createBlogTabs/SeoScoreDisplay';

// Import SEO validator
import { calculateSeoScore } from './utils/SeoValidator';

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

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`blog-tabpanel-${index}`}
      aria-labelledby={`blog-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Create a floating SEO analysis component
const FloatingSeoAnalysis = ({ seoAnalysis, visible, toggleVisibility }) => {
  const theme = useTheme();
  
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={visible}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '360px', md: '380px' },
          height: 'calc(100% - 100px)',
          top: '90px',
          borderRadius: { xs: '0', sm: '16px 0 0 16px' },
          border: `1px solid ${theme.palette.divider}`,
          borderRight: 'none',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.05)',
          zIndex: 1100,
          overflowY: 'auto',
          padding: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="subtitle1" 
          fontWeight={600} 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Analytics fontSize="small" />
          SEO Analysis
        </Typography>
        <IconButton 
          onClick={toggleVisibility} 
          size="small"
          sx={{ 
            bgcolor: theme.palette.primary.main, 
            color: 'white', 
            '&:hover': { bgcolor: theme.palette.primary.dark } 
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
      
      <SeoScoreDisplay seoAnalysis={seoAnalysis} />
    </Drawer>
  );
};

// Add collapsible toggle button for the SEO panel
const SeoAnalysisToggle = ({ visible, toggleVisibility }) => {
  const theme = useTheme();
  
  return (
    <Tooltip title={visible ? "Hide SEO Analysis" : "Show SEO Analysis"} placement="left">
      <IconButton
        onClick={toggleVisibility}
        sx={{
          position: 'fixed',
          right: visible ? { xs: '380px', sm: '380px' } : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: theme.palette.primary.main,
          color: 'white',
          zIndex: 1099,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          borderRadius: visible ? '8px 0 0 8px' : '8px 0 0 8px',
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
          },
          transition: 'right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        }}
      >
        {visible ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
    </Tooltip>
  );
};

const CreateBlog = () => {
  const theme = useTheme();
  const { id } = useParams(); // Get blog ID if editing
  const navigate = useNavigate();
  
  // Tab state
  const [currentTab, setCurrentTab] = useState(0);
  
  // SEO Analysis panel visibility state
  const [seoAnalysisPanelVisible, setSeoAnalysisPanelVisible] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState(null);

  // Toggle SEO Analysis panel visibility
  const toggleSeoAnalysisPanel = () => {
    setSeoAnalysisPanelVisible(!seoAnalysisPanelVisible);
  };
  
  // Basic Details state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([...CATEGORIES]);
  
  // Content state
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  
  // SEO state
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState([]);
  const [newSeoKeyword, setNewSeoKeyword] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [noIndex, setNoIndex] = useState(false);
  const [seoScore, setSeoScore] = useState(0);
  
  // Social Media state
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState(null);
  const [ogImagePreview, setOgImagePreview] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState(null);
  const [twitterImagePreview, setTwitterImagePreview] = useState('');
  
  // Settings state
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('draft');
  const [language, setLanguage] = useState('en');
  const [scheduledFor, setScheduledFor] = useState(null);
  const [revisions, setRevisions] = useState([]);
  
  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [seoTabBadge, setSeoTabBadge] = useState(0);
    // Add state to track if fields were manually edited
    const [seoTitleManuallySet, setSeoTitleManuallySet] = useState(false);
    const [ogTitleManuallySet, setOgTitleManuallySet] = useState(false);
    const [twitterTitleManuallySet, setTwitterTitleManuallySet] = useState(false);
    const [seoDescriptionManuallySet, setSeoDescriptionManuallySet] = useState(false);
    const [ogDescriptionManuallySet, setOgDescriptionManuallySet] = useState(false);
    const [twitterDescriptionManuallySet, setTwitterDescriptionManuallySet] = useState(false);
    const [ogImageManuallySet, setOgImageManuallySet] = useState(false);
    const [twitterImageManuallySet, setTwitterImageManuallySet] = useState(false);
    const [canonicalUrlManuallySet, setCanonicalUrlManuallySet] = useState(false);
  // Auto-populate related fields
  useEffect(() => {
    // Only auto-populate if the fields haven't been manually set yet
    if (title) {
      // If SEO title hasn't been manually edited yet, update it
      if (!seoTitleManuallySet) {
        setSeoTitle(title);
      }
      
      // If OG title hasn't been manually edited yet, update it
      if (!ogTitleManuallySet) {
        setOgTitle(title);
      }
      
      // If Twitter title hasn't been manually edited yet, update it
      if (!twitterTitleManuallySet) {
        setTwitterTitle(title);
      }
      
      // Generate slug if not already set or not in edit mode
      if (!id && (!slug || slug === '')) {
        const generatedSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .replace(/--+/g, '-'); // Fix multiple consecutive hyphens
        setSlug(generatedSlug);
      }
    }
  }, [title, id, slug, seoTitleManuallySet, ogTitleManuallySet, twitterTitleManuallySet]);

  // Auto-populate descriptions
  useEffect(() => {
    if (description) {
      // If SEO description hasn't been manually edited yet, update it
      if (!seoDescriptionManuallySet) {
        setSeoDescription(description);
      }
      
      // If OG description hasn't been manually edited yet, update it  
      if (!ogDescriptionManuallySet) {
        setOgDescription(description);
      }
      
      // If Twitter description hasn't been manually edited yet, update it
      if (!twitterDescriptionManuallySet) {
        setTwitterDescription(description);
      }
    }
  }, [description, seoDescriptionManuallySet, ogDescriptionManuallySet, twitterDescriptionManuallySet]);

  // Auto-populate images
  useEffect(() => {
    if (image && preview && !ogImageManuallySet) {
      setOgImage(image);
      setOgImagePreview(preview);
    }
    
    if (image && preview && !twitterImageManuallySet) {
      setTwitterImage(image);
      setTwitterImagePreview(preview);
    }
  }, [image, preview, ogImageManuallySet, twitterImageManuallySet]);

  // Auto-set canonical URL based on slug
  useEffect(() => {
    if (slug && !canonicalUrlManuallySet) {
      setCanonicalUrl(`https://rtnglobal.site/blog/${slug}`);
    }
  }, [slug, canonicalUrlManuallySet]);

  // Helper function to format image URLs consistently
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // If image path already starts with http(s), it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Otherwise, prepend the API URL to the relative path
    return `${process.env.REACT_APP_API_URL}${imagePath}`;
  };

  // Wrapper functions for setters to mark fields as manually set
  const handleSeoTitleChange = (value) => {
    setSeoTitleManuallySet(true);
    setSeoTitle(value);
  };

  const handleOgTitleChange = (value) => {
    setOgTitleManuallySet(true);
    setOgTitle(value);
  };

  const handleTwitterTitleChange = (value) => {
    setTwitterTitleManuallySet(true);
    setTwitterTitle(value);
  };

  const handleSeoDescriptionChange = (value) => {
    setSeoDescriptionManuallySet(true);
    setSeoDescription(value);
  };

  const handleOgDescriptionChange = (value) => {
    setOgDescriptionManuallySet(true);
    setOgDescription(value);
  };

  const handleTwitterDescriptionChange = (value) => {
    setTwitterDescriptionManuallySet(true);
    setTwitterDescription(value);
  };

  const handleOgImageChange = (file, preview) => {
    setOgImageManuallySet(true);
    setOgImage(file);
    setOgImagePreview(preview);
  };

  const handleTwitterImageChange = (file, preview) => {
    setTwitterImageManuallySet(true);
    setTwitterImage(file);
    setTwitterImagePreview(preview);
  };

  const handleCanonicalUrlChange = (value) => {
    setCanonicalUrlManuallySet(true);
    setCanonicalUrl(value);
  };

  // Calculate SEO score and analysis on relevant data change
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
      ogImage: ogImagePreview,
      twitterTitle,
      twitterDescription,
      twitterImage: twitterImagePreview
    };
    
    const analysis = calculateSeoScore(blogData);
    setSeoScore(analysis.score);
    setSeoAnalysis(analysis);
    
    // Set badge content based on score
    if (analysis.score < 50) {
      setSeoTabBadge(1); // Needs attention
    } else {
      setSeoTabBadge(0); // Good
    }
  }, [
    title, description, content, slug, tags, 
    seoTitle, seoDescription, seoKeywords, canonicalUrl, noIndex,
    ogTitle, ogDescription, ogImagePreview, twitterTitle, twitterDescription, twitterImagePreview
  ]);

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

  const fetchBlog = async () => {
    setInitialLoading(true);
    try {
      const response = await API.get(`/api/blogs/admin/${id}`);
      const data = response.data;
      
      // Basic details
      setTitle(data.title);
      setSlug(data.slug || '');
      setDescription(data.description);
      setCategory(data.category || 'Uncategorized');
      setTags(data.tags || []);
      setIsFeatured(data.isFeatured || false);
      
      // Content
      setContent(data.content);
      if (data.image) {
        setPreview(formatImageUrl(data.image));
      }
      setImageAlt(data.imageAlt || '');
      setWordCount(data.wordCount || 0);
      setEstimatedReadTime(data.estimatedReadTime || 0);
      
      // SEO
      setSeoTitle(data.seoTitle || '');
      setSeoDescription(data.seoDescription || '');
      setSeoKeywords(data.seoKeywords || []);
      setCanonicalUrl(data.canonicalUrl || '');
      setNoIndex(data.noIndex || false);
      
      // Social Media
      setOgTitle(data.ogTitle || '');
      setOgDescription(data.ogDescription || '');
      if (data.ogImage) {
        setOgImagePreview(formatImageUrl(data.ogImage));
      }
      setTwitterTitle(data.twitterTitle || '');
      setTwitterDescription(data.twitterDescription || '');
      if (data.twitterImage) {
        setTwitterImagePreview(formatImageUrl(data.twitterImage));
      }
      
      // Settings
      setIsActive(data.isActive || false);
      setStatus(data.status || 'draft');
      setLanguage(data.language || 'en');
      setScheduledFor(data.scheduledFor ? new Date(data.scheduledFor) : null);
      setRevisions(data.revisions || []);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Function to upload social media images separately
  const uploadSocialMediaImage = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await API.post('/api/blogs/upload/social-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.url;
    } catch (err) {
      console.error('Error uploading social media image:', err);
      throw new Error('Failed to upload social media image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // First, upload social media images if they exist
      let ogImageUrl = null;
      let twitterImageUrl = null;
      
      if (ogImage) {
        ogImageUrl = await uploadSocialMediaImage(ogImage);
      }
      
      if (twitterImage) {
        twitterImageUrl = await uploadSocialMediaImage(twitterImage);
      }
      
      const formData = new FormData();
      
      // Basic Details
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('tags', JSON.stringify(tags));
      formData.append('isFeatured', isFeatured);
      
      // Content
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      if (imageAlt) {
        formData.append('imageAlt', imageAlt);
      }
      formData.append('wordCount', wordCount);
      formData.append('estimatedReadTime', estimatedReadTime);
      
      // SEO
      formData.append('seoTitle', seoTitle || title); // Use title as fallback
      formData.append('seoDescription', seoDescription || description); // Use description as fallback
      formData.append('seoKeywords', JSON.stringify(seoKeywords.length ? seoKeywords : tags)); // Use tags as fallback
      formData.append('canonicalUrl', canonicalUrl);
      formData.append('noIndex', noIndex);
      
      // Social Media
      formData.append('ogTitle', ogTitle || seoTitle || title); // Use SEO title or main title as fallback
      formData.append('ogDescription', ogDescription || seoDescription || description); // Use SEO description or main description as fallback
      if (ogImageUrl) {
        formData.append('ogImage', ogImageUrl);
      } else if (ogImagePreview && ogImagePreview.startsWith('http')) {
        // If we already have a URL from previously uploaded image
        formData.append('ogImage', ogImagePreview);
      }
      
      formData.append('twitterTitle', twitterTitle || ogTitle || seoTitle || title); // Chain of fallbacks
      formData.append('twitterDescription', twitterDescription || ogDescription || seoDescription || description); // Chain of fallbacks
      if (twitterImageUrl) {
        formData.append('twitterImage', twitterImageUrl);
      } else if (twitterImagePreview && twitterImagePreview.startsWith('http')) {
        // If we already have a URL from previously uploaded image
        formData.append('twitterImage', twitterImagePreview);
      }
      
      // Settings
      formData.append('isActive', isActive);
      formData.append('status', status);
      formData.append('language', language);
      if (scheduledFor) {
        formData.append('scheduledFor', scheduledFor.toISOString());
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
          onClick={() => navigate('/blog/manage')}
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
            position: 'relative', // Add this for positioning context
          }}
        >
          {/* Show SEO Analysis toggle button only when not on SEO tab */}
          {currentTab !== 2 && (
            <SeoAnalysisToggle 
              visible={seoAnalysisPanelVisible} 
              toggleVisibility={toggleSeoAnalysisPanel} 
            />
          )}
          
          {/* Show floating SEO Analysis panel only when not on SEO tab */}
          {currentTab !== 2 && (
            <FloatingSeoAnalysis 
              seoAnalysis={seoAnalysis} 
              visible={seoAnalysisPanelVisible}
              toggleVisibility={toggleSeoAnalysisPanel}
            />
          )}
          
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
            <Box sx={{ flex: 1 }}>
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
            
            {/* SEO Score Chip */}
            <Chip
              label={`SEO: ${seoScore}%`}
              color={seoScore >= 70 ? 'success' : seoScore >= 50 ? 'warning' : 'error'}
              sx={{ 
                fontWeight: 600,
                height: 32,
                borderRadius: '8px'
              }}
              icon={seoScore >= 70 ? <CheckCircle fontSize="small" /> : <Warning fontSize="small" />}
            />
          </Box>

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
            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                  sx={{ 
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    minHeight: 48,
                  },
                  '& .Mui-selected': {
                    fontWeight: 600,
                  }
                }}
              >
                <Tab 
                  label="Basic Details" 
                  icon={<Description fontSize="small" />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Content" 
                  icon={<Article fontSize="small" />} 
                  iconPosition="start"
                />
                <Tab 
                  label="SEO" 
                  icon={<Search fontSize="small" />} 
                  iconPosition="start"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: -8,
                      top: 8,
                    }
                  }}
                  {...(seoTabBadge > 0 && {
                    component: Badge,
                    badgeContent: seoTabBadge,
                    color: "warning"
                  })}
                />
                <Tab 
                  label="Social Media" 
                  icon={<Share fontSize="small" />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Settings" 
                  icon={<Settings fontSize="small" />} 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={currentTab} index={0}>
              <BasicDetailsTab
                title={title}
                setTitle={setTitle}
                slug={slug}
                setSlug={setSlug}
                description={description}
                setDescription={setDescription}
                category={category}
                setCategory={setCategory}
                tags={tags}
                setTags={setTags}
                tagInput={tagInput}
                setTagInput={setTagInput}
                isFeatured={isFeatured}
                setIsFeatured={setIsFeatured}
                customCategories={customCategories}
                setCustomCategories={setCustomCategories}
                allCategories={allCategories}
              />
            </TabPanel>
            
            <TabPanel value={currentTab} index={1}>
              <ContentTab
                content={content}
                setContent={setContent}
                image={image}
                setImage={setImage}
                preview={preview}
                setPreview={setPreview}
                imageAlt={imageAlt}
                setImageAlt={setImageAlt}
                wordCount={wordCount}
                setWordCount={setWordCount}
                estimatedReadTime={estimatedReadTime}
                setEstimatedReadTime={setEstimatedReadTime}
              />
            </TabPanel>
            
            <TabPanel value={currentTab} index={2}>
              <SeoTab
                title={title}
                description={description}
                content={content}
                slug={slug}
                tags={tags}
                seoTitle={seoTitle}
                setSeoTitle={handleSeoTitleChange}
                seoDescription={seoDescription}
                setSeoDescription={handleSeoDescriptionChange}
                seoKeywords={seoKeywords}
                setSeoKeywords={setSeoKeywords}
                setNewSeoKeyword={setNewSeoKeyword}
                newSeoKeyword={newSeoKeyword}
                canonicalUrl={canonicalUrl}
                setCanonicalUrl={handleCanonicalUrlChange}
                noIndex={noIndex}
                ogTitle={ogTitle}
                ogDescription={ogDescription}
                ogImage={ogImage}
                ogImagePreview={ogImagePreview}
                twitterTitle={twitterTitle}
                twitterDescription={twitterDescription}
                twitterImage={twitterImage}
                twitterImagePreview={twitterImagePreview}
                setNoIndex={setNoIndex}
                seoAnalysis={seoAnalysis}
              />
            </TabPanel>
            
            <TabPanel value={currentTab} index={3}>
              <SocialMediaTab
                title={title}
                description={description}
                image={image}
                preview={preview}
                ogTitle={ogTitle}
                setOgTitle={handleOgTitleChange}
                ogDescription={ogDescription}
                setOgDescription={handleOgDescriptionChange}
                ogImage={ogImage}
                setOgImage={(file) => handleOgImageChange(file, null)}
                ogImagePreview={ogImagePreview}
                setOgImagePreview={(preview) => handleOgImageChange(ogImage, preview)}
                twitterTitle={twitterTitle}
                setTwitterTitle={handleTwitterTitleChange}
                twitterDescription={twitterDescription}
                setTwitterDescription={handleTwitterDescriptionChange}
                twitterImage={twitterImage}
                setTwitterImage={(file) => handleTwitterImageChange(file, null)}
                twitterImagePreview={twitterImagePreview}
                setTwitterImagePreview={(preview) => handleTwitterImageChange(twitterImage, preview)}
              />
            </TabPanel>
            
            <TabPanel value={currentTab} index={4}>
              <SettingsTab
                isActive={isActive}
                setIsActive={setIsActive}
                status={status}
                setStatus={setStatus}
                language={language}
                setLanguage={setLanguage}
                scheduledFor={scheduledFor}
                setScheduledFor={setScheduledFor}
                revisions={revisions}
                wordCount={wordCount}
                estimatedReadTime={estimatedReadTime}
              />
            </TabPanel>

            <Divider sx={{ my: 4 }} />

            {/* Navigation and Submit Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Box>
                {currentTab > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentTab(currentTab - 1)}
                    sx={{
                      borderRadius: '10px',
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 500,
                        borderColor: theme.palette.divider,
                      color: theme.palette.text.secondary,
                      mr: 2,
                      '&:hover': {
                        borderColor: theme.palette.text.secondary,
                        backgroundColor: 'transparent',
                      }
                    }}
                  >
                    Previous
                  </Button>
                )}
                
                {currentTab < 4 && (
                    <Button
                      variant="contained"
                    onClick={() => setCurrentTab(currentTab + 1)}
                      sx={{
                        borderRadius: '10px',
                        px: 3,
                        py: 1.2,
                        textTransform: 'none',
                        fontWeight: 500,
                      }}
                    >
                    Next
                    </Button>
                )}
              </Box>

              <Box>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/blog/manage')}
                  sx={{
                    borderRadius: '10px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                    mr: 2,
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
            </Box>
          </form>
        </Paper>
      </Container>
    </Fade>
  );
};

export default CreateBlog;