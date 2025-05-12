import { useState, useEffect, useCallback } from 'react';
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory as deleteCategoryService,
} from '../../services/CategoriaService.js';
import useDebounce from '../../hooks/useDebounce.js';

export const useCategoriasLogic = (user, fetchTrigger) => {
  // Data and UI State
  const [allCategorias, setAllCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [formData, setFormData] = useState({ nome: '' });

  // Notification State
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      // Adiciona IDs se necessário
      const processedData = data.map((categoria, index) => ({
        ...categoria,
        id: categoria.id || `generated-${index}`,
      }));
      setAllCategorias(processedData);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // tratamento de erro, se necessário
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger initial fetch and any additional fetches (por exemplo, por alteração em fetchTrigger)
  useEffect(() => {
    fetchData();
  }, [fetchData, fetchTrigger]);

  // Filtering effect: filtra as categorias pelo campo "nome"
  useEffect(() => {
    let currentData = [...allCategorias];
    if (debouncedSearchTerm) {
      currentData = allCategorias.filter((categoria) =>
        categoria.nome.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      );
    }
    setFilteredCategorias(currentData);
  }, [debouncedSearchTerm, allCategorias]);

  // Modal Controls
  const handleOpenModal = (categoria = null) => {
    setSelectedCategoria(categoria);
    setFormData(categoria ? { ...categoria } : { nome: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategoria(null);
    setFormData({ nome: '' });
  };

  // CRUD Operations
  const handleSave = async () => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem salvar categorias.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      let responseMessage = '';
      if (selectedCategoria) {
        await updateCategory(selectedCategoria.id, formData);
        responseMessage = 'Categoria atualizada com sucesso!';
      } else {
        await addCategory(formData);
        responseMessage = 'Categoria adicionada com sucesso!';
      }

      setNotification({
        open: true,
        message: responseMessage,
        severity: 'success',
      });

      // Limpa o termo de pesquisa após salvar
      setSearchTerm('');

      await fetchData(); // Re-fetch dos dados
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      setNotification({
        open: true,
        message: `Erro ao salvar categoria: ${error.message || ''}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem excluir categorias.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteCategoryService(categoryId);
      setNotification({
        open: true,
        message: 'Categoria excluída com sucesso!',
        severity: 'success',
      });
      await fetchData(); // Re-fetch dos dados
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setNotification({
        open: true,
        message: `Erro ao excluir categoria: ${error.message || ''}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search Handling
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Notification Handling
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return {
    // State
    allCategorias,
    filteredCategorias,
    searchTerm,
    isLoading,
    openModal,
    selectedCategoria,
    formData,
    notification,

    // Methods
    setSearchTerm,
    setFormData,
    fetchData,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteCategory,
    handleSearchChange,
    handleCloseNotification,
  };
};
