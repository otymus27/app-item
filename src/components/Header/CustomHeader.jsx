import { Avatar, Box, Button, Typography } from '@mui/material';
import React from 'react';

const CustomHeader = ({ user, onLogout }) => {
  console.log('CustomHeader user:', user); // Log de depuração
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'primary.main' }}>
      <Typography variant="h6" sx={{ color: 'white' }}>
        Sistema de Empréstimos
      </Typography>
      {user && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar>
            {(user.nome || user.name || user.login || 'U').substring(0, 2).toUpperCase()}
          </Avatar>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {user.nome || user.name || user.login || 'Usuário'}
          </Typography>
          <Button variant="contained" color="secondary" onClick={onLogout}>
            Sair
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CustomHeader;
