import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  IconButton,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  Stack,
  Tooltip,
  Badge,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../BackendAPi/ApiProvider';

const LiveChat = ({ sessionId: propSessionId, isAdmin, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionStatus, setSessionStatus] = useState('waiting');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const pollInterval = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (propSessionId) {
      setSessionId(propSessionId);
      fetchSession(propSessionId);
    } else {
      startChatSession();
    }
  }, [propSessionId]);

  const startPolling = useCallback((sid) => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }

    pollInterval.current = setInterval(() => {
      fetchSession(sid);
    }, 3000);
  }, []);

  const startChatSession = async () => {
    try {
      setLoading(true);
      const response = await API.post('/api/chat/session');

      if (response.data) {
        setSessionId(response.data._id);
        setMessages(response.data.messages || []);
        setSessionStatus(response.data.status);
        
        // Only start polling if the session has messages
        if (response.data.status !== 'initialized') {
          startPolling(response.data._id);
        }
      }
    } catch (error) {
      console.error('Chat session error:', error);
      setError('Failed to start chat session');
    } finally {
      setLoading(false);
    }
  };

  const fetchSession = async (id) => {
    try {
      setLoading(true);
      const response = await API.get(`/api/chat/session/${id}`);
      
      setMessages(response.data.messages || []);
      setSessionStatus(response.data.status);
      
      if (response.data.status !== 'closed') {
        startPolling(id);
      }
    } catch (error) {
      console.error('Fetch session error:', error);
      setError('Failed to load chat session');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if ((!newMessage.trim() && !file) || loading || sessionStatus === 'closed') return;

    setLoading(true);
    setError('');

    try {
      let formData = new FormData();
      formData.append('content', newMessage.trim());
      if (file) {
        formData.append('attachment', file);
      }

      const response = await API.post(`/api/chat/message/${sessionId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        setMessages(response.data.messages || []);
        setSessionStatus(response.data.status);
        setNewMessage('');
        setFile(null);
        scrollToBottom();

        // Start polling after first message
        if (response.data.status !== 'initialized' && !pollInterval.current) {
          startPolling(sessionId);
        }
      }
    } catch (error) {
      console.error('Send message error:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
      setFile(selectedFile);
    } else {
      setError('File size should be less than 5MB');
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: isAdmin ? '85vh' : '85vh',
        width : isAdmin ? '100%' : '50vw',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        margin:'auto',
        marginTop:isAdmin ? '' : '50px',
        '@media (max-width: 600px)': {
          width: '90vw',
        }
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          color={sessionStatus === 'active' ? 'success' : 'warning'}
        >
          <Avatar 
            sx={{ 
              bgcolor: sessionStatus === 'active' ? 'success.main' : 'warning.main',
              width: 40,
              height: 40,
            }}
          >
            {isAdmin ? 'A' : 'S'}
          </Avatar>
        </Badge>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">
            {isAdmin ? 'Customer Support' : 'Live Chat Support'}
          </Typography>
          <Typography variant="caption">
            {sessionStatus === 'initialized' ? 'Start chatting...' :
             sessionStatus === 'waiting' ? 'Waiting for agent...' :
             sessionStatus === 'active' ? 'Chat active' : 'Chat ended'}
          </Typography>
        </Box>
        {onClose && (
          <IconButton color="inherit" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: 'grey.50',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: message.sender?._id === user?.id ? 'row-reverse' : 'row',
              gap: 1,
              maxWidth: '80%',
              alignSelf: message.sender?._id === user?.id ? 'flex-end' : 'flex-start',
            }}
          >
            <Avatar
              src={message.sender?.avatar}
              sx={{
                width: 32,
                height: 32,
                bgcolor: message.sender?.role === 'admin' ? 'primary.main' : 'secondary.main',
              }}
            >
              {message.sender?.firstName?.[0] || '?'}
            </Avatar>
            <Box>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  bgcolor: message.sender?._id === user?.id ? 'primary.main' : 'background.paper',
                  color: message.sender?._id === user?.id ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 8,
                    [message.sender?._id === user?.id ? 'right' : 'left']: -8,
                    borderStyle: 'solid',
                    borderWidth: '8px 8px 0 0',
                    borderColor: `${message.sender?._id === user?.id ? 'primary.main' : 'background.paper'} transparent transparent transparent`,
                    transform: message.sender?._id === user?.id ? 'rotate(45deg)' : 'rotate(-135deg)',
                  },
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="body1">
                    {message.content}
                  </Typography>
                  {message.attachment && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AttachFileIcon />}
                      href={`${process.env.REACT_APP_API_URL}/${message.attachment.path}`}
                      target="_blank"
                      sx={{
                        color: message.sender?._id === user?.id ? 'inherit' : 'primary',
                        borderColor: 'currentColor',
                      }}
                    >
                      {message.attachment.filename}
                    </Button>
                  )}
                </Stack>
              </Paper>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 0.5, opacity: 0.7 }}
              >
                <Typography variant="caption" color="text.secondary">
                  {message.sender?.firstName} {message.sender?.lastName}
                </Typography>
                {message.sender?.role === 'admin' && (
                  <Chip
                    label="Agent"
                    size="small"
                    color="primary"
                    sx={{ height: 16 }}
                  />
                )}
                <Typography variant="caption" color="text.secondary">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Stack>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        {error && (
          <Typography color="error" variant="caption" display="block" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSendMessage}>
          <Stack direction="row" spacing={1}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
            />
            <Tooltip title="Attach file">
              <IconButton
                color="primary"
                onClick={() => fileInputRef.current.click()}
                disabled={loading || sessionStatus === 'closed'}
              >
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            <TextField
              fullWidth
              placeholder={
                sessionStatus === 'closed' ? 'Chat ended' :
                sessionStatus === 'initialized' ? 'Start chatting...' :
                'Type your message...'
              }
              variant="outlined"
              size="small"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading || sessionStatus === 'closed'}
              InputProps={{
                sx: { borderRadius: 3 }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || (!newMessage.trim() && !file) || sessionStatus === 'closed'}
              sx={{ 
                borderRadius: 3,
                minWidth: 100,
                height: 40,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  Send
                  <SendIcon sx={{ ml: 1 }} />
                </>
              )}
            </Button>
          </Stack>
          {file && (
            <Chip
              label={file.name}
              onDelete={() => setFile(null)}
              deleteIcon={<CloseIcon />}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Box>

      {/* Status Messages */}
      {sessionStatus === 'initialized' && !isAdmin && (
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'info.light', 
            color: 'info.contrastText',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2">
            Start chatting by sending your first message
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default LiveChat;