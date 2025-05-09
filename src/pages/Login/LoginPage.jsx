import React, { useState } from 'react';
import { Button, Typography, Box, FormControl, InputLabel, Input, InputAdornment, Avatar, Alert } from '@mui/material';
import { FaUser, FaLock } from 'react-icons/fa';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validação dos campos
    if (!login.trim()) {
      setError('Por favor, insira o seu nome de utilizador.');
      setLoading(false);
      return;
    }
    if (!senha.trim()) {
      setError('Por favor, insira a sua senha.');
      setLoading(false);
      return;
    }
    if (senha.length < 3) {
      setError('A senha deve ter pelo menos 3 caracteres.');
      setLoading(false);
      return;
    }

    try {
      // Simula uma chamada à API de login
      const response = await fetch('http://localhost:8080/login', {
        // Use o endpoint da sua API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: login, senha: senha }), // Adapte os nomes dos campos se necessário
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao fazer login: Tente novamente mais tarde.';
        const errorData = await response.json(); // Tenta obter detalhes do erro da resposta
        if (errorData && errorData.message) {
          errorMessage = errorData.message; // Usa a mensagem de erro da API, se disponível
        } else if (response.status === 401) {
          errorMessage = 'Credenciais Inválidas. Verifique seu nome de usuário e senha';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Armazena o token JWT
      navigate('/home');
    } catch (err) {
      // Captura erros da API e define mensagens de erro específicas
      console.error(err);
      setError(err.message); // Usa a mensagem de erro definida no bloco catch
    } finally {
      setLoading(false);
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
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FaUser />
              </InputAdornment>
            }
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
            startAdornment={
              <InputAdornment position="start">
                <FaLock />
              </InputAdornment>
            }
            placeholder="Digite sua senha"
          />
        </FormControl>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
