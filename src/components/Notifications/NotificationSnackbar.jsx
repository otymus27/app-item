import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationSnackbar = ({ notification, setNotification }) => {
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleCloseNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;