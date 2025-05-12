import { useState, useEffect, useCallback } from 'react';
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer as deleteCustomerService,
} from '../../services/ClienteService.js';
import useDebounce from '../../hooks/useDebounce.js';

export const useClientesLogic = (user, fetchTrigger) => {
  // Data and UI State
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });

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
      const data = await getCustomers();
      // Adicionar IDs se necessário
      const processedData = data.map((customer, index) => ({
        ...customer,
        id: customer.id || `generated-${index}`,
      }));
      setAllCustomers(processedData);
    } catch {
      // Tratamento de erro
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger initial fetch and any additional fetches
  useEffect(() => {
    fetchData();
  }, [fetchData, fetchTrigger]);

  // Filtering effect
  useEffect(() => {
    let currentData = [...allCustomers];
    if (debouncedSearchTerm) {
      currentData = allCustomers.filter(
        (c) =>
          c.nome.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      );
    }
    setFilteredCustomers(currentData);
  }, [debouncedSearchTerm, allCustomers]);

  // Modal Controls
  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);
    setFormData(customer ? { ...customer } : { nome: '', email: '', telefone: '' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCustomer(null);
    setFormData({ nome: '', email: '', telefone: '' });
  };

  // CRUD Operations
  const handleSave = async () => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem salvar clientes.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      let responseMessage = '';
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
        responseMessage = 'Cliente atualizado com sucesso!';
      } else {
        await addCustomer(formData);
        responseMessage = 'Cliente adicionado com sucesso!';
      }

      setNotification({
        open: true,
        message: responseMessage,
        severity: 'success',
      });

      // Limpa o termo de pesquisa após salvar
      setSearchTerm('');

      await fetchData(); // Re-fetch data
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setNotification({
        open: true,
        message: `Erro ao salvar cliente: ${error.message || ''}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem excluir clientes.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteCustomerService(customerId);
      setNotification({
        open: true,
        message: 'Cliente excluído com sucesso!',
        severity: 'success',
      });
      await fetchData(); // Re-fetch data
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      setNotification({
        open: true,
        message: `Erro ao excluir cliente: ${error.message || ''}`,
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
    allCustomers,
    filteredCustomers,
    searchTerm,
    isLoading,
    openModal,
    selectedCustomer,
    formData,
    notification,

    // Methods
    setSearchTerm,
    setFormData,
    fetchData,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteCustomer,
    handleSearchChange,
    handleCloseNotification,
  };
};
