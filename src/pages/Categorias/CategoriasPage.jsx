import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, TextField, Pagination, Snackbar, Alert } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Hooks e Componentes personalizados
import useAuth from '../../hooks/useAuth.jsx';
import { useCategoriasLogic } from '../../hooks/Categoria/UseCategoriasLogic.jsx';
import CategoriasList from '../../pages/Categorias/CategoriasList.jsx';
import CategoriaModal from '../../components/Modals/CategoriaModal.jsx';
import GerarRelatorioCategorias from '../../components/Relatorios/CategoriasRelatorio.jsx';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader';
import Footer from '../../components/Footer/Footer';

const CategoriasPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para ordenação (por padrão, ordena pelo campo "nome")
  const [sortConfig, setSortConfig] = useState({
    field: 'nome',
    order: 'asc',
  });

  // Lógica de gerenciamento de categorias
  const {
    filteredCategorias,
    searchTerm,
    isLoading,
    openModal,
    selectedCategoria,
    formData,
    notification,
    handleSearchChange,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteCategory,
    handleCloseNotification,
    setFormData,
  } = useCategoriasLogic(user);

  // Função de ordenação
  const sortedCategorias = useMemo(() => {
    if (!filteredCategorias) return [];
    return [...filteredCategorias].sort((a, b) => {
      const valueA = String(a[sortConfig.field] || '').toLowerCase();
      const valueB = String(b[sortConfig.field] || '').toLowerCase();
      return sortConfig.order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }, [filteredCategorias, sortConfig]);

  // Lógica de paginação com ordenação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedCategorias.length / itemsPerPage);
  const paginatedCategorias = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCategorias.slice(startIndex, endIndex);
  }, [sortedCategorias, currentPage]);

  // Manipular mudança de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Manipular mudança de ordenação
  const handleSortChange = (field) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.field === field) {
        return {
          field,
          order: prevConfig.order === 'asc' ? 'desc' : 'asc',
        };
      }
      return { field, order: 'asc' };
    });
    setCurrentPage(1);
  };

  // Navegação para a Home
  const handleGoHome = () => navigate('/home');

  // Manipulação da mudança de formulário
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Se não houver usuário autenticado, exibir mensagem de erro
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

          <Typography variant="h4" gutterBottom>
            Gerenciamento de Categorias
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar categorias por nome..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {user.role === 'ADMIN' && (
              <>
                <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
                  Adicionar Categoria
                </Button>
                <GerarRelatorioCategorias categorias={filteredCategorias} loading={isLoading} />
              </>
            )}
          </Box>

          <CategoriasList
            paginatedCategorias={paginatedCategorias}
            isLoading={isLoading}
            user={user}
            onEditCategoria={handleOpenModal}
            onDeleteCategoria={handleDeleteCategory}
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
      <CategoriaModal
        open={openModal}
        onClose={handleCloseModal}
        selectedCategoria={selectedCategoria}
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

export default CategoriasPage;
