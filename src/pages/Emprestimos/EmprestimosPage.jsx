// src/pages/EmprestimoPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader';
import Footer from '../../components/Footer/Footer';

// Serviços para operação de itens e empréstimos
import { getItems } from '../../services/ItemService.js';
import { createEmprestimo } from '../../services/EmprestimoService.js';

const EmprestimoPage = () => {
  const navigate = useNavigate();

  // Estado para o id do cliente que fará o empréstimo
  const [clienteId, setClienteId] = useState('');

  // Estados para gerenciar os itens disponíveis para empréstimo
  const [todosItens, setTodosItens] = useState([]);
  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [carregandoItens, setCarregandoItens] = useState(false);

  // Estado para os itens selecionados para o empréstimo
  const [itensSelecionados, setItensSelecionados] = useState([]);

  // Estado para gerenciar o loading do empréstimo e notificações
  const [emprestimoLoading, setEmprestimoLoading] = useState(false);
  const [notificacao, setNotificacao] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Carrega todos os itens e filtra apenas os disponíveis (disponivel === true)
  useEffect(() => {
    const buscarItens = async () => {
      setCarregandoItens(true);
      try {
        const data = await getItems();
        setTodosItens(data);
        // Filtra os itens disponíveis
        const disponiveis = data.filter((item) => item.disponivel === true);
        setItensDisponiveis(disponiveis);
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
      } finally {
        setCarregandoItens(false);
      }
    };

    buscarItens();
  }, []);

  // Função que trata a criação do empréstimo
  const handleCriarEmprestimo = async () => {
    if (!clienteId.trim()) {
      setNotificacao({
        open: true,
        message: 'O ID do Cliente é obrigatório.',
        severity: 'error',
      });
      return;
    }
    if (itensSelecionados.length === 0) {
      setNotificacao({
        open: true,
        message: 'Selecione pelo menos um item disponível.',
        severity: 'error',
      });
      return;
    }

    // A data do empréstimo é gerada automaticamente (data atual).
    const dataEmprestimo = new Date();
    // O status é definido automaticamente, por exemplo, "Emprestado"
    const status = 'Emprestado';

    // Prepara o payload contendo:
    // - clienteId
    // - itens: array com os IDs dos itens selecionados
    // - dataEmprestimo e status
    const payload = {
      clienteId: clienteId.trim(),
      itens: itensSelecionados.map((item) => item.id),
      dataEmprestimo,
      status,
    };

    setEmprestimoLoading(true);
    try {
      await createEmprestimo(payload);
      setNotificacao({
        open: true,
        message: 'Empréstimo realizado com sucesso!',
        severity: 'success',
      });
      // Limpa os campos após o sucesso
      setClienteId('');
      setItensSelecionados([]);
    } catch (error) {
      console.error('Erro ao criar empréstimo:', error);
      setNotificacao({
        open: true,
        message: 'Erro ao realizar empréstimo.',
        severity: 'error',
      });
    } finally {
      setEmprestimoLoading(false);
    }
  };

  const handleFecharNotificacao = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotificacao((prev) => ({ ...prev, open: false }));
  };

  const handleIrParaHome = () => navigate('/home');

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflowY: 'hidden' }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <CustomHeader />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Button variant="outlined" startIcon={<Home />} onClick={handleIrParaHome}>
            Início
          </Button>
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Empréstimo de Itens
          </Typography>

          {/* Campo para informar o ID do Cliente */}
          <TextField
            fullWidth
            label="ID do Cliente"
            variant="outlined"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            margin="normal"
          />

          {/* Autocomplete para seleção de itens disponíveis */}
          {carregandoItens ? (
            <CircularProgress sx={{ my: 2 }} />
          ) : (
            <Autocomplete
              multiple
              options={itensDisponiveis}
              getOptionLabel={(option) => option.nome}
              value={itensSelecionados}
              onChange={(event, newValue) => setItensSelecionados(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Itens Disponíveis"
                  placeholder="Selecione os itens"
                  margin="normal"
                  fullWidth
                />
              )}
            />
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleCriarEmprestimo}
            sx={{ mt: 2 }}
            disabled={emprestimoLoading}
          >
            {emprestimoLoading ? <CircularProgress size={24} /> : 'Emprestar Itens'}
          </Button>
        </Box>
        <Footer />
      </Box>

      <Snackbar
        open={notificacao.open}
        autoHideDuration={6000}
        onClose={handleFecharNotificacao}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleFecharNotificacao} severity={notificacao.severity} sx={{ width: '100%' }}>
          {notificacao.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmprestimoPage;
