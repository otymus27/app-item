import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, TextField, Pagination, Snackbar, Alert } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hooks e Componentes personalizados
import useAuth from '../../hooks/useAuth.jsx';
import { useUsuariosLogic } from '../../hooks/Usuarios/UseUsuariosLogic.jsx';
import UsuariosList from '../../pages/Usuarios/UsuariosList.jsx';
import UsuarioModal from '../../components/Modals/UsuarioModal.jsx';
import GerarRelatorioUsuarios from '../../components/Relatorios/UsuariosRelatorio.jsx';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader';
import Footer from '../../components/Footer/Footer';

const UsuariosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState({
    field: 'login',
    order: 'asc',
  });

  // Lógica de gerenciamento dos usuários
  const {
    filteredUsuarios,
    searchTerm,
    isLoading,
    openModal,
    selectedUsuario,
    formData,
    notification,
    handleSearchChange,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteUsuario,
    handleCloseNotification,
    setFormData,
  } = useUsuariosLogic(user);

  // Lógica de ordenação
  const sortedUsuarios = useMemo(() => {
    if (!filteredUsuarios) return [];
    return [...filteredUsuarios].sort((a, b) => {
      const valueA = String(a[sortConfig.field] || '').toLowerCase();
      const valueB = String(b[sortConfig.field] || '').toLowerCase();
      return sortConfig.order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }, [filteredUsuarios, sortConfig]);

  // Lógica de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedUsuarios.length / itemsPerPage);
  const paginatedUsuarios = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedUsuarios.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUsuarios, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Lógica de alteração de ordenação
  const handleSortChange = (field) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.field === field) {
        return { field, order: prevConfig.order === 'asc' ? 'desc' : 'asc' };
      }
      return { field, order: 'asc' };
    });
    setCurrentPage(1);
  };

  // Navegação para a página inicial
  const handleGoHome = () => navigate('/home');

  // Manipulação de mudança no formulário do modal
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Se não houver usuário autenticado, exibe uma mensagem de erro
  if (!user) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
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
            Gerenciamento de Usuários
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar usuários por login ou role..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {user.role === 'ADMIN' && (
              <>
                <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
                  Adicionar Usuário
                </Button>
                <GerarRelatorioUsuarios usuarios={filteredUsuarios} loading={isLoading} />
              </>
            )}
          </Box>

          <UsuariosList
            paginatedUsuarios={paginatedUsuarios}
            isLoading={isLoading}
            user={user}
            onEditUsuario={handleOpenModal}
            onDeleteUsuario={handleDeleteUsuario}
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

      {/* Modal de Cadastro/Edição de Usuários */}
      <UsuarioModal
        open={openModal}
        onClose={handleCloseModal}
        selectedUsuario={selectedUsuario}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleSave}
        isLoading={isLoading}
        user={user}
      />

      {/* Snackbar de Notificação */}
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

export default UsuariosPage;
