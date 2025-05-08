import Container from '../../components/Container/ContainerComponent.jsx';
import {
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Paper,
  Avatar,
  Alert,
} from '@mui/material';
import { FaUser, FaLock } from 'react-icons/fa';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../../services/autenticacaoService';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginService({ login, senha });
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      console.error(err); // ou envie para um logger
      setError('Erro ao fazer login: ' + (err.response?.data?.message || 'tente novamente mais tarde'));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #4facfe, #00f2fe)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'white',
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
        }}
        component="form"
        onSubmit={handleLogin}
      >
        <Box textAlign="center" mb={3}>
          <Avatar sx={{ m: '0 auto', bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" mt={1}>
            Acesso ao Sistema
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="login">Login</InputLabel>
          <Input
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FaUser />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="senha">Senha</InputLabel>
          <Input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FaLock />
              </InputAdornment>
            }
          />
        </FormControl>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
