// src/pages/EmprestimosPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Snackbar, Alert, Typography, Pagination, CircularProgress } from '@mui/material';
import EmprestimoTable from '../../components/Tables/EmprestimoTable';
import EmprestimoModal from '../../components/Modals/EmprestimoModal';
import { getEmprestimos, createEmprestimo } from '../../services/EmprestimoService';

const EmprestimosPage = () => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [pagina, setPagina] = useState(0); // página atual (0-based)
  const [tamanhoPagina] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchEmprestimos = async () => {
    setLoading(true);
    try {
      const response = await getEmprestimos({ page: pagina, size: tamanhoPagina });

      setEmprestimos(response.content || []);
      setTotalPaginas(response.totalPages || 1);
    } catch {
      setSnackbarMessage('Erro ao carregar os empréstimos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmprestimos();
  }, [pagina, tamanhoPagina]);

  const handleCreateEmprestimo = async (emprestimoData) => {
    try {
      await createEmprestimo(emprestimoData);

      setSnackbarMessage('Empréstimo criado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Volta para a primeira página e atualiza
      setPagina(0);
      await recarregarPrimeiraPagina();
      setOpenModal(false);
      setOpenModal(false);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Erro ao criar o empréstimo.';
      setSnackbarMessage(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const recarregarPrimeiraPagina = async () => {
    const response = await getEmprestimos({ page: 0, size: tamanhoPagina });
    setEmprestimos(response.content || []);
    setTotalPaginas(response.totalPages || 1);
  };

  const handleChangePagina = (event, value) => {
    setPagina(value - 1); // MUI usa 1-based, backend usa 0-based
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Empréstimos
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
        Novo Empréstimo
      </Button>

      <Box mt={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <EmprestimoTable emprestimos={emprestimos} />
        )}
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination count={totalPaginas} page={pagina + 1} onChange={handleChangePagina} color="primary" />
      </Box>

      <EmprestimoModal open={openModal} onClose={() => setOpenModal(false)} onCreate={handleCreateEmprestimo} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmprestimosPage;
