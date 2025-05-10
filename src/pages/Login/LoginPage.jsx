import React, { useState } from 'react';
import { Button, Typography, Box, FormControl, InputLabel, Input, InputAdornment, Avatar, Alert } from '@mui/material';
import { FaUser, FaLock } from 'react-icons/fa';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [localError, setLocalError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLocalLoading(true);

    if (!loginInput.trim()) {
      setLocalError('Por favor, insira o seu nome de utilizador.');
      setLocalLoading(false);
      return;
    }
    if (!senha.trim()) {
      setLocalError('Por favor, insira a sua senha.');
      setLocalLoading(false);
      return;
    }

    try {
      await login(loginInput, senha); // ✅ Usa o login do contexto
      navigate('/home');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to right, #4facfe, #00f2fe)', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 400, bgcolor: 'white', p: 4, borderRadius: 4, boxShadow: 3 }} component="form" onSubmit={handleLogin}>
        <Box textAlign="center" mb={3}>
          <Avatar sx={{ m: '0 auto', bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" mt={1}>
            Acesso ao Sistema
          </Typography>
        </Box>

        {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="login">Login</InputLabel>
          <Input
            id="login"
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            startAdornment={<InputAdornment position="start"><FaUser /></InputAdornment>}
            placeholder="Digite seu nome de utilizador"
          />
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="senha">Senha</InputLabel>
          <Input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            startAdornment={<InputAdornment position="start"><FaLock /></InputAdornment>}
            placeholder="Digite sua senha"
          />
        </FormControl>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={localLoading}>
          {localLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
