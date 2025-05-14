import React, { useState, useEffect } from 'react';
import { Container, Button, Typography } from '@mui/material';
import EmprestimoTable from '../../components/Tables/EmprestimoTable';
import EmprestimoModal from '../../components/Modals/EmprestimoModal';
import CustomSnackbar from '../../components/Snackbar/Snackbar';
import { createEmprestimo, getEmprestimos } from '../../services/EmprestimoService';

const EmprestimoPage = () => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Função para buscar todos os empréstimos
  const fetchEmprestimos = async () => {
    try {
      const data = await getEmprestimos();
      setEmprestimos(data);
    } catch {
      setSnackbarMessage('Erro ao carregar os empréstimos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Executa o fetch ao carregar a página
  useEffect(() => {
    fetchEmprestimos();
  }, []);

  // Função para abrir o modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Função para criar um novo empréstimo
  const handleCreateEmprestimo = async (emprestimoData) => {
    try {
      await createEmprestimo(emprestimoData);
      setSnackbarMessage('Empréstimo criado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchEmprestimos(); // Atualiza a lista de empréstimos
      handleCloseModal(); // Fecha o modal
    } catch {
      setSnackbarMessage('Erro ao criar o empréstimo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gerenciar Empréstimos
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginBottom: '20px' }}>
        Criar Novo Empréstimo
      </Button>

      <EmprestimoTable emprestimos={emprestimos} />

      {/* Modal de criação de empréstimo */}
      <EmprestimoModal open={openModal} onClose={handleCloseModal} onCreate={handleCreateEmprestimo} />

      {/* Snackbar para mensagens de sucesso/erro */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default EmprestimoPage;
