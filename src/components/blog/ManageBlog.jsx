import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TablePagination,
  Chip,
  useTheme
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API from '../../BackendAPi/ApiProvider';

const ManageBlog = () => {
  const navigate = useNavigate();
  
  const theme = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await API.get('/api/blogs');
      setBlogs(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/blogs/${blogToDelete._id}`);
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: theme.shape.borderRadius,
          background: theme.palette.background.paper
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 3
          }}
        >
          Manage Blogs
        </Typography>
      
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
      
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/blog/create')}
          sx={{ 
            mb: 4,
            borderRadius: '28px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Create New Blog
        </Button>
      
        <TableContainer sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: theme.palette.text.primary
                  }}
                >
                  Title
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: theme.palette.text.primary
                  }}
                >
                  Created Date
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: theme.palette.text.primary
                  }}
                >
                  Status
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: theme.palette.text.primary
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((blog) => (
                  <TableRow 
                    key={blog._id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    <TableCell sx={{ color: theme.palette.text.primary }}>
                      {blog.title}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={blog.isActive ? 'Active' : 'Inactive'}
                        color={blog.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ borderRadius: '16px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => navigate(`/blog/edit/${blog._id}`)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light
                          }
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(blog)}
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.error.light
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={blogs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

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
      </Paper>
    </Container>
  );
};

export default ManageBlog;
