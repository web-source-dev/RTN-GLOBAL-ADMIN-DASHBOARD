import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Badge,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LiveChat from '../support/LiveChat';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../BackendAPi/ApiProvider';
const ChatDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const pollInterval = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
    startPolling();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, statusFilter]);

  const startPolling = () => {
    stopPolling();
    pollInterval.current = setInterval(fetchSessions, 5000);
  };

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  };

  const getAuthConfig = () => ({
    // No need to manually set headers with token as cookies are automatically sent
  });

  const fetchSessions = async () => {
    try {
      const response = await API.get(`/api/chat/active-sessions`);

      if (response.data) {
        // Update sessions while preserving selected session state
        setSessions(prevSessions => {
          const newSessions = response.data;
          
          // If there's a selected session, find its updated version
          if (selectedSession) {
            const updatedSelectedSession = newSessions.find(s => s._id === selectedSession._id);
            // Only update selected session if it still exists and has different data
            if (updatedSelectedSession && 
                JSON.stringify(updatedSelectedSession) !== JSON.stringify(selectedSession)) {
              setSelectedSession(updatedSelectedSession);
            }
            // If session no longer exists in active sessions, clear selection
            if (!updatedSelectedSession) {
              setSelectedSession(null);
            }
          }
          
          return newSessions;
        });
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to fetch active sessions');
    }
  };

  const filterSessions = () => {
    let filtered = [...sessions];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.user.firstName.toLowerCase().includes(query) ||
        session.user.lastName.toLowerCase().includes(query) ||
        session.user.email.toLowerCase().includes(query)
      );
    }

    setFilteredSessions(filtered);
  };

  const handleSessionSelect = (session) => {
    // Prevent reselecting the same session
    if (selectedSession?._id === session._id) return;
    
    setSelectedSession(session);
  };

  const handleEndSession = async (sessionId, event) => {
    event.stopPropagation();
    try {
      setLoading(true);
      await API.post(`/api/chat/session/${sessionId}/end`);
      
      if (selectedSession?._id === sessionId) {
        setSelectedSession(null);
      }
      
      await fetchSessions();
    } catch (error) {
      console.error('Error ending session:', error);
      setError('Failed to end session');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'active': return 'success';
      case 'initialized': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                Active Sessions
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterListIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="waiting">Waiting</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="initialized">Initialized</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
            
            <List sx={{ flexGrow: 1, overflow: 'auto', px: 2 }}>
              {filteredSessions.map((session) => (
                <Paper
                  key={session._id}
                  elevation={selectedSession?._id === session._id ? 3 : 1}
                  sx={{
                    mb: 1,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <ListItem
                    onClick={() => handleSessionSelect(session)}
                    sx={{
                      borderRadius: 1,
                      bgcolor: selectedSession?._id === session._id ? 'primary.light' : 'background.paper',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {session.user.firstName} {session.user.lastName}
                          </Typography>
                          <Chip
                            size="small"
                            color={getStatusColor(session.status)}
                            label={session.status}
                          />
                        </Box>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="caption" display="block">
                            Started: {formatTimestamp(session.startedAt)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Email: {session.user.email}
                          </Typography>
                        </Stack>
                      }
                    />
                    <Tooltip title="End Session">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => handleEndSession(session._id, e)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                </Paper>
              ))}
              {filteredSessions.length === 0 && (
                <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
                  No sessions found
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          {selectedSession ? (
            <LiveChat
              key={selectedSession._id}
              sessionId={selectedSession._id}
              isAdmin={true}
              onClose={() => setSelectedSession(null)}
            />
          ) : (
            <Paper
              elevation={3}
              sx={{
                height: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a chat session to start responding
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatDashboard; 