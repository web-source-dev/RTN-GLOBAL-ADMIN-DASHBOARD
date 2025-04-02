import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Skeleton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Switch,
  FormControlLabel,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Paper,
  Tooltip,
  Collapse,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import API from '../../../../BackendAPi/ApiProvider';

// Manual Copy Alert Component
const ManualCopyAlert = ({ open, text, onClose }) => {
  if (!open) return null;
  
  return (
    <Collapse in={open}>
      <Alert 
        severity="info" 
        onClose={onClose}
        sx={{ my: 2, '& .MuiAlert-message': { width: '100%' } }}
      >
        <AlertTitle>Please copy manually</AlertTitle>
        <Typography variant="body2" gutterBottom>
          Automatic copying failed. Please copy this text manually:
        </Typography>
        <Paper
          variant="outlined"
          sx={{ 
            p: 1.5, 
            my: 1,
            bgcolor: 'background.paper',
            fontFamily: 'monospace',
            overflowX: 'auto',
            userSelect: 'all'
          }}
        >
          {text}
        </Paper>
        <Typography variant="caption" color="text.secondary">
          Select the text above and press Ctrl+C (Windows/Linux) or ⌘+C (Mac) to copy
        </Typography>
      </Alert>
    </Collapse>
  );
};

const SecurityTab = ({ 
  handlePasswordChange, 
  handleDeleteAccount, 
  passwordData,
  setPasswordData,
  openPasswordDialog,
  setOpenPasswordDialog,
  error,
  success,
  loading 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  
  // 2FA states
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [open2FADialog, setOpen2FADialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [qrCodeURL, setQrCodeURL] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [disablePassword, setDisablePassword] = useState('');
  const [loading2FA, setLoading2FA] = useState(false);
  const [error2FA, setError2FA] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Manual copy states
  const [showManualSecretCopy, setShowManualSecretCopy] = useState(false);
  const [showManualBackupCopy, setShowManualBackupCopy] = useState(false);

  // Fetch 2FA status on component mount
  useEffect(() => {
    fetchTwoFactorStatus();
  }, []);

  const fetchTwoFactorStatus = async () => {
    try {
      const response = await API.get('/api/auth/preferences');
      setIs2FAEnabled(response.data.twoFactorAuth || false);
    } catch (err) {
      console.error('Error fetching 2FA status:', err);
    }
  };

  const handleToggle2FA = async () => {
    if (is2FAEnabled) {
      // If 2FA is enabled, show confirmation dialog to disable
      setOpen2FADialog(true);
      setActiveStep(3); // Go to disable step
    } else {
      // If 2FA is disabled, start setup process
      setOpen2FADialog(true);
      setActiveStep(0);
      await setupTwoFactor();
    }
  };

  const handleClose2FADialog = () => {
    setOpen2FADialog(false);
    setActiveStep(0);
    setVerificationCode('');
    setDisablePassword('');
    setError2FA('');
    setQrCodeURL('');
    setSecret('');
    setBackupCodes([]);
    setShowManualSecretCopy(false);
    setShowManualBackupCopy(false);
  };

  const setupTwoFactor = async () => {
    try {
      setLoading2FA(true);
      setError2FA('');
      
      const response = await API.post('/api/auth/2fa/setup');
      setQrCodeURL(response.data.dataURL);
      setSecret(response.data.secret);
      
      setLoading2FA(false);
    } catch (err) {
      setError2FA(err.response?.data?.message || 'Failed to setup two-factor authentication');
      setLoading2FA(false);
    }
  };

  const verifyTwoFactor = async () => {
    try {
      setLoading2FA(true);
      setError2FA('');
      
      const response = await API.post('/api/auth/2fa/verify', {
        token: verificationCode
      });
      
      // Save the backup codes
      setBackupCodes(response.data.backupCodes);
      setIs2FAEnabled(true);
      setActiveStep(2);
      
      setLoading2FA(false);
    } catch (err) {
      setError2FA(err.response?.data?.message || 'Failed to verify code');
      setLoading2FA(false);
    }
  };

  const disableTwoFactor = async () => {
    try {
      setLoading2FA(true);
      setError2FA('');
      
      await API.post('/api/auth/2fa/disable', {
        password: disablePassword
      });
      
      setIs2FAEnabled(false);
      handleClose2FADialog();
      
      setLoading2FA(false);
    } catch (err) {
      setError2FA(err.response?.data?.message || 'Failed to disable two-factor authentication');
      setLoading2FA(false);
    }
  };

  const handleCopySecret = () => {
    try {
      // Check if secret is defined and not empty
      if (!secret) {
        console.error('No secret to copy');
        return;
      }
      
      // First try using the Clipboard API
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(secret)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => {
            console.error('Could not copy using Clipboard API:', err);
            performFallbackCopy(secret);
          });
      } else {
        // Fallback method
        performFallbackCopy(secret);
      }
    } catch (err) {
      console.error('Failed to copy secret:', err);
      setShowManualSecretCopy(true); // Show manual copy UI
    }
  };
  
  // Separate function for the fallback copy method
  const performFallbackCopy = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Focus and select the text
      textArea.focus();
      textArea.select();
      
      // Execute the copy command
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('Copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Could not copy text:', err);
      
      // Show the appropriate manual copy UI based on what we're copying
      if (text === secret) {
        setShowManualSecretCopy(true);
      } else {
        setShowManualBackupCopy(true);
      }
    }
  };

  const handleCopyBackupCodes = () => {
    try {
      // Check if backupCodes is defined and not empty
      if (!backupCodes || backupCodes.length === 0) {
        console.error('No backup codes to copy');
        return;
      }
      
      // Format backup codes as a string
      const codesText = backupCodes.join('\n');
      
      // First try using the Clipboard API
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(codesText)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => {
            console.error('Could not copy using Clipboard API:', err);
            performFallbackCopy(codesText);
          });
      } else {
        // Fallback method
        performFallbackCopy(codesText);
      }
    } catch (err) {
      console.error('Failed to copy backup codes:', err);
      setShowManualBackupCopy(true); // Show manual copy UI
    }
  };

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 2,
          height: '100%',
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="text" height={40} width="50%" />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={100} />
        </Stack>
      </Card>
    );
  }

  return (
    <>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 0,
          overflow: 'hidden',
          height: '100%',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(120deg, ${theme.palette.primary.dark}, ${theme.palette.error.dark})`,
            color: 'white',
          }}
        >
          <Typography variant="h5" fontWeight="medium">
            Security Settings
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Manage your account security and privacy
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Password Section */}
            <Card
              component={motion.div}
              whileHover={{ scale: 1.01 }}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              <Box sx={{ p: 2 }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <LockIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6">Password</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Change your account password
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Button
                    variant="contained"
                    onClick={() => setOpenPasswordDialog(true)}
                    startIcon={<SecurityIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                      px: 3,
                    }}
                  >
                    Change Password
                  </Button>
                </Stack>
              </Box>
            </Card>

            {/* 2FA Section */}
            <Card
              component={motion.div}
              whileHover={{ scale: 1.01 }}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              <Box sx={{ p: 2 }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        color: 'white',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <SecurityIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6">Two-Factor Authentication</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add an extra layer of security to your account
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={is2FAEnabled}
                        onChange={handleToggle2FA}
                        color="primary"
                      />
                    }
                    label={is2FAEnabled ? "Enabled" : "Disabled"}
                    labelPlacement="start"
                  />
                </Stack>
              </Box>
            </Card>

            {/* Delete Account Section */}
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ px: 2, fontWeight: 'medium' }}
                >
                  Danger Zone
                </Typography>
              </Divider>

              <Card
                variant="outlined"
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  borderColor: theme.palette.error.light,
                  background: theme.palette.mode === 'light' 
                    ? 'rgba(211, 47, 47, 0.04)'
                    : 'rgba(211, 47, 47, 0.08)',
                }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        bgcolor: theme.palette.error.main,
                        color: 'white',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DeleteIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" color="error.main">Delete Account</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Permanently delete your account and all data
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setOpenDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </Stack>
              </Card>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          sx: { 
            borderRadius: 2,
            width: { xs: '100%', sm: '500px' },
            maxWidth: '100%',
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LockIcon color="primary" />
            <Typography variant="h6">Change Password</Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info" icon={<InfoIcon />}>
              <AlertTitle>Password Requirements</AlertTitle>
              <Typography variant="body2">
                Your password must be at least 8 characters long and include:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 0, mt: 1 }}>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
              </Box>
            </Alert>
            
            <TextField
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              fullWidth
              required
              error={passwordData.newPassword && passwordData.newPassword.length < 6}
              helperText={
                passwordData.newPassword && passwordData.newPassword.length < 6
                  ? "Password must be at least 6 characters long"
                  : ""
              }
            />
            
            <TextField
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword}
              helperText={
                passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword
                  ? "Passwords don't match"
                  : ""
              }
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenPasswordDialog(false)}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              passwordData.newPassword !== passwordData.confirmPassword ||
              passwordData.newPassword.length < 6
            }
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Two-Factor Authentication Dialog */}
      <Dialog
        open={open2FADialog}
        onClose={handleClose2FADialog}
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          sx: { 
            borderRadius: 2,
            width: { xs: '100%', sm: '600px' },
            maxWidth: '100%',
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SecurityIcon color="primary" />
            <Typography variant="h6">
              {is2FAEnabled ? 'Disable' : 'Setup'} Two-Factor Authentication
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          {error2FA && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error2FA}
            </Alert>
          )}
          
          {loading2FA ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {activeStep < 3 && (
                <Stepper
                  activeStep={activeStep}
                  orientation={isMobile ? 'vertical' : 'horizontal'}
                  sx={{ mb: 4 }}
                >
                  <Step>
                    <StepLabel>Setup</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Verify</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Backup Codes</StepLabel>
                  </Step>
                </Stepper>
              )}
              
              {activeStep === 0 && (
                <Stack spacing={3}>
                  <Alert severity="info">
                    <AlertTitle>Enhance Your Account Security</AlertTitle>
                    Two-factor authentication adds an extra layer of security to your account by requiring a code from your authenticator app in addition to your password.
                  </Alert>
                  
                  <Typography variant="subtitle1" fontWeight="medium">
                    1. Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    {qrCodeURL ? (
                      <Box 
                        component="img" 
                        src={qrCodeURL}
                        alt="QR Code"
                        sx={{ width: 200, height: 200, border: `1px solid ${theme.palette.divider}`, p: 2, borderRadius: 2 }}
                      />
                    ) : (
                      <Skeleton variant="rectangular" width={200} height={200} />
                    )}
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="medium">
                    2. Or enter this secret code manually in your app:
                  </Typography>
                  
                  <Paper
                    variant="outlined"
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      bgcolor: 'action.hover'
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      fontFamily="monospace" 
                      sx={{ 
                        letterSpacing: 1, 
                        fontWeight: 'medium',
                        userSelect: 'all'
                      }}
                    >
                      {secret}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                      onClick={handleCopySecret}
                      color={copied ? "success" : "primary"}
                    >
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </Paper>
                  
                  {/* Manual copy alert for secret key */}
                  <ManualCopyAlert
                    open={showManualSecretCopy}
                    text={secret}
                    onClose={() => setShowManualSecretCopy(false)}
                  />
                </Stack>
              )}
              
              {activeStep === 1 && (
                <Stack spacing={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Enter the verification code from your authenticator app to verify setup:
                  </Typography>
                  
                  <TextField
                    label="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    fullWidth
                    inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                    placeholder="123456"
                    helperText="Enter the 6-digit code from your authenticator app"
                    autoFocus
                  />
                </Stack>
              )}
              
              {activeStep === 2 && (
                <Stack spacing={3}>
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    <AlertTitle>Two-Factor Authentication Enabled!</AlertTitle>
                    Your account is now more secure. Keep these backup codes in a safe place - you'll need them if you lose access to your authenticator app.
                  </Alert>
                  
                  <Typography variant="subtitle1" fontWeight="medium">
                    Backup Codes (save these somewhere safe)
                  </Typography>
                  
                  <Paper
                    variant="outlined"
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: 'action.hover'
                    }}
                  >
                    <Stack spacing={1}>
                      {backupCodes.map((code, index) => (
                        <Typography 
                          key={index} 
                          variant="body1" 
                          fontFamily="monospace" 
                          sx={{ letterSpacing: 1 }}
                        >
                          {code}
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>
                  
                  <Button
                    startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                    onClick={handleCopyBackupCodes}
                    color={copied ? "success" : "primary"}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    {copied ? "Codes Copied" : "Copy All Codes"}
                  </Button>
                  
                  {/* Manual copy alert for backup codes */}
                  <ManualCopyAlert
                    open={showManualBackupCopy}
                    text={backupCodes.join('\n')}
                    onClose={() => setShowManualBackupCopy(false)}
                  />
                  
                  <Alert severity="warning">
                    Each backup code can only be used once. Keep them secure and private.
                  </Alert>
                </Stack>
              )}
              
              {activeStep === 3 && (
                <Stack spacing={3}>
                  <Alert severity="warning">
                    <AlertTitle>Disable Two-Factor Authentication?</AlertTitle>
                    This will make your account less secure. You'll need to enter your password to confirm.
                  </Alert>
                  
                  <TextField
                    type="password"
                    label="Enter your password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    fullWidth
                    required
                    autoFocus
                  />
                </Stack>
              )}
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose2FADialog}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          
          {activeStep === 0 && (
            <Button
              variant="contained"
              onClick={() => setActiveStep(1)}
              disabled={!secret || loading2FA}
            >
              Continue
            </Button>
          )}
          
          {activeStep === 1 && (
            <Button
              variant="contained"
              onClick={verifyTwoFactor}
              disabled={!verificationCode || verificationCode.length !== 6 || loading2FA}
            >
              Verify
            </Button>
          )}
          
          {activeStep === 2 && (
            <Button
              variant="contained"
              onClick={handleClose2FADialog}
              color="success"
            >
              Finish
            </Button>
          )}
          
          {activeStep === 3 && (
            <Button
              variant="contained"
              onClick={disableTwoFactor}
              color="error"
              disabled={!disablePassword || loading2FA}
            >
              Disable 2FA
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          sx: { 
            borderRadius: 2,
            width: { xs: '100%', sm: '500px' },
            maxWidth: '100%',
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DeleteIcon />
            <Typography variant="h6">Delete Account</Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="warning" icon={<InfoIcon />}>
              <AlertTitle>Warning: This action cannot be undone</AlertTitle>
              Deleting your account will permanently remove all your data, including:
              <Box component="ul" sx={{ pl: 2, mb: 0, mt: 1 }}>
                <li>Profile information</li>
                <li>Business details</li>
                <li>Order history</li>
                <li>Support tickets</li>
              </Box>
            </Alert>
            
            <Typography variant="body1">
              To confirm, please type <strong>DELETE</strong> in the field below:
            </Typography>
            
            <TextField
              value={confirmDeleteText}
              onChange={(e) => setConfirmDeleteText(e.target.value)}
              fullWidth
              placeholder="Type DELETE to confirm"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          
          <Button
            onClick={() => {
              handleDeleteAccount();
              setOpenDeleteDialog(false);
            }}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={confirmDeleteText !== 'DELETE'}
          >
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SecurityTab; 