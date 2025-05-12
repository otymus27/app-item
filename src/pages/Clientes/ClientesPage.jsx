import React from 'react';
import { Box, Typography, Button, TextField, Pagination, Snackbar, Alert } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hooks e Componentes personalizados
import useAuth from '../../hooks/useAuth.jsx';
import { useClientesLogic } from '../../hooks/UseClientesLogic.jsx';
import { useClientesPagination } from '../../hooks/useClientesPagination.jsx';
import ClientesList from '../../pages/Clientes/ClientesList.jsx';
import ClienteModal from '../../components/Modals/ClienteModal.jsx';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader';
import Footer from '../../components/Footer/Footer';

const ClientesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lógica de gerenciamento de clientes
  const {
    filteredCustomers,
    searchTerm,
    isLoading,
    openModal,
    selectedCustomer,
    formData,
    notification,

    handleSearchChange,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteCustomer,
    handleCloseNotification,
    setFormData,
  } = useClientesLogic(user);

  // Lógica de paginação
  const { currentPage, paginatedCustomers, totalPages, handlePageChange } = useClientesPagination(filteredCustomers);

  // Navegação para home
  const handleGoHome = () => navigate('/home');

  // Manipulação de mudança de formulário
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Caso não haja usuário autenticado
  if (!user) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">Erro ao carregar dados do usuário. Por favor, faça login novamente.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflowY: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <CustomHeader />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Button variant="outlined" startIcon={<Home />} onClick={handleGoHome}>
            Início
          </Button>

          <Typography variant="h4" gutterBottom>
            Gerenciamento de Clientes
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar clientes por nome ou email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {user.role === 'ADMIN' && (
              <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
                Adicionar Cliente
              </Button>
            )}
          </Box>

          <ClientesList
            paginatedCustomers={paginatedCustomers}
            isLoading={isLoading}
            user={user}
            onEditCustomer={handleOpenModal}
            onDeleteCustomer={handleDeleteCustomer}
          />

          {totalPages > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
        <Footer />
      </Box>

      {/* Modal de Cadastro/Edição */}
      <ClienteModal
        open={openModal}
        onClose={handleCloseModal}
        selectedCustomer={selectedCustomer}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleSave}
        isLoading={isLoading}
        user={user}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientesPage;
