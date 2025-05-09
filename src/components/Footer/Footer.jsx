import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: 'grey.200',
        padding: 2,
        textAlign: 'center',
        marginTop: '20px',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Nome da Sua Empresa. Todos os direitos reservados.
      </Typography>
      {/* Adicione outras informações do rodapé aqui */}
    </Box>
  );
};

export default Footer;
