// src/components/shared/FeedbackSnackbar.jsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const FeedbackSnackbar = ({ open, onClose, message, severity = 'success' }) => {
  const validSeverities = ['success', 'info', 'warning', 'error'];
  const safeSeverity = validSeverities.includes(severity) ? severity : 'info';

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={safeSeverity} sx={{ width: '100%' }}>
        {message || 'Erro desconhecido'}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
