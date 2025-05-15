// EmprestimosPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { Home, Assessment } from '@mui/icons-material';
import EmprestimoModal from '../../components/Modals/EmprestimoModal.jsx';
import EmprestimoTable from '../../components/Tables/EmprestimoTable';

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary.jsx';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const EmprestimosPage = () => {
  const [modalAberto, setModalAberto] = useState(false);
  const [atualizarTabela, setAtualizarTabela] = useState(false);

  const handleOpenModal = () => setModalAberto(true);
  const handleCloseModal = () => setModalAberto(false);

  const navigate = useNavigate();

  const handleEmprestimoCriado = () => {
    setAtualizarTabela((prev) => !prev); // Força re-render do EmprestimoTable
    handleCloseModal();
  };

  // Navegação para a Home
  const handleGoHome = () => navigate('/home');
  // Navegação para a Relatorios de emprestimos
  const handleGoRelatorio = () => navigate('/emprestimos/relatorio');

  return (
    <ErrorBoundary>
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
            <Button variant="outlined" startIcon={<Home />} onClick={handleGoHome}>
              Início
            </Button>

            <Button variant="outlined" startIcon={<Assessment />} onClick={handleGoRelatorio}>
              Relatório de Empréstimos
            </Button>

            <Typography variant="h4" gutterBottom>
              Gerenciamento de Empréstimos
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
              Novo Empréstimo
            </Button>
            <EmprestimoTable atualizar={atualizarTabela} />
            <EmprestimoModal open={modalAberto} onClose={handleCloseModal} onCreate={handleEmprestimoCriado} />
          </Box>
          <Footer />
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default EmprestimosPage;
