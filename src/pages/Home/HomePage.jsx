import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './../../components/Header/Header.jsx';
import Footer from './../../components/Footer/Footer.jsx';
import Container from '../../components/Container/Container.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!token) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'grey.100',
        }}
      >
        <Typography variant="h6" color="error">
          Você não está autenticado. Por favor, faça o login.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo à Página Inicial
        </Typography>
        <Typography variant="body1" paragraph>
          Esta é uma página inicial com um layout consistente.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default HomePage;
