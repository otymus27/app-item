// components/Snackbar/Snackbar.jsx
import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';

const Snackbar = ({ open, onClose, message, severity = 'success', autoHideDuration = 4000 }) => {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
