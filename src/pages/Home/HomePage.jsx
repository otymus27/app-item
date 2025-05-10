import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress, Alert, Toolbar } from '@mui/material';
import Container from '../../components/Container/Container.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import useAuth from '../../hooks/useAuth.jsx';
import Dashboard from '../../components/Dashboard/Dashboard.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';


const HomePage = () => {
  const { isLoggedIn, user, loading, error, logout } = useAuth();
  const navigate = useNavigate();

  

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      // Evita navegar se já estiver na página de login
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Garante que só renderiza se estiver logado e o usuário estiver disponível
  if (!isLoggedIn || !user) {
    return (
      <Alert severity="warning">
        Dados do usuário não disponíveis. Tente fazer login novamente.
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomHeader user={user} onLogout={logout} />
        <Toolbar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bem-vindo, {user.login}
          </Typography>
          <Typography variant="body1">
            Esta é a página inicial protegida.
          </Typography>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default HomePage;
