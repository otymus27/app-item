// EmprestimosPage.jsx
import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import EmprestimoModal from '../../components/Modals/EmprestimoModal.jsx';
import EmprestimoTable from '../../components/Tables/EmprestimoTable';

const EmprestimosPage = () => {
  const [modalAberto, setModalAberto] = useState(false);
  const [atualizarTabela, setAtualizarTabela] = useState(false);

  const handleOpenModal = () => setModalAberto(true);
  const handleCloseModal = () => setModalAberto(false);

  const handleEmprestimoCriado = () => {
    setAtualizarTabela((prev) => !prev); // Força re-render do EmprestimoTable
    handleCloseModal();
  };

  return (
    <Box p={2}>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Novo Empréstimo
      </Button>
      <EmprestimoTable atualizar={atualizarTabela} />
      <EmprestimoModal open={modalAberto} onClose={handleCloseModal} onCreate={handleEmprestimoCriado} />
    </Box>
  );
};

export default EmprestimosPage;
