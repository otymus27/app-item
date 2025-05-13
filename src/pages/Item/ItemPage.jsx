// src/pages/ItemPage.jsx
import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Componentes de layout
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader';
import Footer from '../../components/Footer/Footer';

// Componentes e Módulos de Item
import ItemModal from '../../components/Modals/ItemModal';
import ItemSearch from '../../components/SearchBar/ItemSearch';
import ItemTable from '../../components/Tables/ItemTable';
import ItemRelatorios from '../../components/Relatorios/ItemRelatorio';

// Hooks
import { useItemLogic } from '../../hooks/Item/useItemLogic';
import { useItemPagination } from '../../hooks/Item/useItemPagination';

const ItemPage = () => {
  const navigate = useNavigate();

  // Lógica central para itens (incluindo categorias, notificações, operações de CRUD)
  const {
    filteredItems,
    categories,
    loadingItems,
    notification,
    setNotification,
    searchTerm,
    handleSearchChange,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
  } = useItemLogic();

  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState({ field: 'nome', order: 'asc' });

  // Função auxiliar para extrair um valor usado para ordenação
  const getFieldValue = (item, field) => {
    let value = item[field];
    // Se for o campo categorias, converte para uma string (junta os nomes)
    if (field === 'categorias' && Array.isArray(value)) {
      // Se for array de objetos, pega o nome; caso contrário, junta valores
      if (value.length > 0 && typeof value[0] === 'object') {
        return value.map((cat) => cat.nome).join(', ');
      }
      return value.join(', ');
    }
    // Se for booleano, converte para 1 (true) e 0 (false)
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value || '';
  };

  // Ordena os itens filtrados com base na configuração vigente
  const sortedItems = useMemo(() => {
    const itemsCopy = [...filteredItems];
    if (sortConfig.field) {
      itemsCopy.sort((a, b) => {
        const aValue = getFieldValue(a, sortConfig.field);
        const bValue = getFieldValue(b, sortConfig.field);
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const result = aValue.localeCompare(bValue);
          return sortConfig.order === 'asc' ? result : -result;
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.order === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }
    return itemsCopy;
  }, [filteredItems, sortConfig]);

  // Paginação
  const { currentPage, totalPages, paginatedItems, handlePageChange } = useItemPagination(sortedItems, 10);

  // Estado e função para o modal unificado (criação e edição)
  const [modalOpen, setModalOpen] = useState(false);
  // Para edição, selectedItem será o objeto do item; para criação ela será nula.
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Abre o modal para edição (passando o item)
  const openEditModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Abre o modal para cadastro (nenhum item é passado)
  const openCreateModal = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  // Callback de salvar (detecta se é edição ou criação com base na existência de um id)
  const handleSaveModal = async (itemData) => {
    setModalLoading(true);
    if (itemData.id) {
      // Modo edição
      await handleUpdateItem(itemData);
    } else {
      // Modo cadastro
      await handleAddItem(itemData);
    }
    setModalLoading(false);
    closeModal();
  };

  // Função para atualizar a ordenação ao clicar no cabeçalho da tabela.
  const handleSortChange = (field) => {
    let order = 'asc';
    if (sortConfig.field === field && sortConfig.order === 'asc') {
      order = 'desc';
    }
    setSortConfig({ field, order });
  };

  // Navegação para a Home
  const handleGoHome = () => navigate('/home');

  // Fechar notificação
  const handleCloseNotification = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

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
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Itens
          </Typography>
          <ItemSearch searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <ItemRelatorios items={filteredItems} loading={loadingItems} />
            <Button variant="contained" color="primary" onClick={openCreateModal}>
              Novo Item
            </Button>
          </Box>
          <ItemTable
            items={paginatedItems}
            onEditItem={openEditModal}
            onDeleteItem={handleDeleteItem}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
        </Box>
        <Footer />
      </Box>

      {/* Modal unificado para criação/edição */}
      <ItemModal
        open={modalOpen}
        onClose={closeModal}
        itemData={selectedItem}
        categories={categories}
        onSave={handleSaveModal}
        loading={modalLoading}
      />

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

export default ItemPage;
