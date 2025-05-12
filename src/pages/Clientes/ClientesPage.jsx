import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, TextField, Pagination, Snackbar, Alert } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hooks e Componentes personalizados
import useAuth from '../../hooks/useAuth.jsx';
import { useClientesLogic } from '../../hooks/UseClientesLogic.jsx';
import ClientesList from '../../pages/Clientes/ClientesList.jsx';
import ClienteModal from '../../components/Modals/ClienteModal.jsx';
import GerarRelatorio from '../../components/Relatorios/ClientesRelatorio.jsx';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader';
import Footer from '../../components/Footer/Footer';

const ClientesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState({
    field: 'nome',
    order: 'asc',
  });

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

  // Função de ordenação
  const sortedCustomers = useMemo(() => {
    if (!filteredCustomers) return [];

    return [...filteredCustomers].sort((a, b) => {
      const valueA = String(a[sortConfig.field] || '').toLowerCase();
      const valueB = String(b[sortConfig.field] || '').toLowerCase();

      if (sortConfig.order === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }, [filteredCustomers, sortConfig]);

  // Lógica de paginação com ordenação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular total de páginas
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

  // Paginar clientes ordenados
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCustomers.slice(startIndex, endIndex);
  }, [sortedCustomers, currentPage]);

  // Manipular mudança de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Manipular mudança de ordenação
  const handleSortChange = (field) => {
    // Se o campo for o mesmo, alterna a ordem
    setSortConfig((prevConfig) => {
      if (prevConfig.field === field) {
        return {
          field,
          order: prevConfig.order === 'asc' ? 'desc' : 'asc',
        };
      }
      // Se for um campo diferente, define para ascendente
      return {
        field,
        order: 'asc',
      };
    });

    // Resetar para primeira página
    setCurrentPage(1);
  };

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
              <>
                <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
                  Adicionar Cliente
                </Button>

                <GerarRelatorio clientes={filteredCustomers} loading={isLoading} />
              </>
            )}
          </Box>

          <ClientesList
            paginatedCustomers={paginatedCustomers}
            isLoading={isLoading}
            user={user}
            onEditCustomer={handleOpenModal}
            onDeleteCustomer={handleDeleteCustomer}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
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
