import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Switch,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API from '../../BackendAPi/ApiProvider';

const Blogs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [page, rowsPerPage]);

  const fetchBlogs = async () => {
    try {
      const response = await API.get(`/api/admin/blogs?page=${page + 1}&limit=${rowsPerPage}`);
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (blogId, isActive) => {
    try {
      await API.patch(`/api/admin/blogs/${blogId}/status`, {
        isActive
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog status:', error);
    }
  };

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/admin/blogs/${selectedBlog._id}`);
      fetchBlogs();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Blog Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/blog/create')}
          sx={{ borderRadius: 2 }}
        >
          Create Blog
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Engagement</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {blog.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  {blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : 'Unknown'}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={blog.isActive}
                    onChange={(e) => handleStatusChange(blog._id, e.target.checked)}
                    color="primary"
                  />
                  <Chip
                    label={blog.isActive ? 'Active' : 'Draft'}
                    color={blog.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ViewIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {blog.views}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LikeIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {blog.likes?.length || 0}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CommentIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {blog.comments?.length || 0}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="info"
                    onClick={() => navigate(`/blog/post/${blog._id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton 
                    color="primary"
                    onClick={() => navigate(`/blog/edit/${blog._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(blog)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={100}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this blog post?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Blogs;