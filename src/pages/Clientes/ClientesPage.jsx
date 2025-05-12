import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress, // For loading
  Snackbar,         // For notifications
  Alert,
  Pagination,       // MUI Pagination component
} from '@mui/material';
import { Edit, Delete, Home, Search } from '@mui/icons-material'; // Removed ArrowBack, ArrowForward for Pagination component
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer as deleteCustomerService } from '../../services/ClienteService.js'; // Renamed to avoid conflict
import useDebounce from '../../hooks/useDebounce.js'; // Import the debounce hook

const ITEMS_PER_PAGE = 5;

const ClientesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data and UI State
  const [allCustomers, setAllCustomers] = useState([]); // Stores all customers from API
  const [filteredCustomers, setFilteredCustomers] = useState([]); // Customers after search filter
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1); // 1-indexed

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });

  // Notification State
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCustomers();
      setAllCustomers(data);
      // Filtering will be handled by debouncedSearchTerm effect
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setNotification({ open: true, message: 'Erro ao carregar clientes.', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect for filtering based on debounced search term or allCustomers change
  useEffect(() => {
    let currentData = [...allCustomers];
    if (debouncedSearchTerm) {
      currentData = allCustomers.filter(
        (c) =>
          c.nome.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    setFilteredCustomers(currentData);
    setCurrentPage(1); // Reset to first page on search
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // CRUD Operations
  const handleSave = async () => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({ open: true, message: 'Apenas administradores podem salvar clientes.', severity: 'warning' });
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
      setNotification({ open: true, message: responseMessage, severity: 'success' });
      await fetchData(); // Re-fetch data
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setNotification({ open: true, message: `Erro ao salvar cliente: ${error.message || ''}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({ open: true, message: 'Apenas administradores podem excluir clientes.', severity: 'warning' });
      return;
    }
    // Optional: Add a confirmation dialog here
    // if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    setIsLoading(true);
    try {
      await deleteCustomerService(customerId); // Use the imported service function
      setNotification({ open: true, message: 'Cliente excluído com sucesso!', severity: 'success' });
      await fetchData(); // Re-fetch data
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      setNotification({ open: true, message: `Erro ao excluir cliente: ${error.message || ''}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination Logic
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Navigation
  const handleGoHome = () => navigate('/home');

  // Close notification
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

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

          {isLoading && !paginatedCustomers.length ? ( // Show main loader if loading and no data yet
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCustomers.length === 0 && !isLoading && (
                     <TableRow>
                        <TableCell colSpan={5} align="center">
                           Nenhum cliente encontrado.
                        </TableCell>
                     </TableRow>
                  )}
                  {paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.nome}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.telefone}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleOpenModal(customer)}>
                          <Edit />
                        </IconButton>
                        {user.role === 'ADMIN' && (
                          <IconButton size="small" color="error" onClick={() => handleDeleteCustomer(customer.id)}>
                            <Delete />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
            </>
          )}
        </Box>
        <Footer />
      </Box>

      {/* Modal de Cadastro/Edição */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCustomer ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nome"
            label="Nome Completo"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Endereço de Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            name="telefone"
            label="Número de Telefone"
            type="tel"
            fullWidth
            variant="outlined"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{pb: 2, pr: 2}}>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          {user.role === 'ADMIN' && (
            <Button variant="contained" onClick={handleSave} disabled={isLoading}>
              {isLoading && selectedCustomer === null && !openModal ? <CircularProgress size={24} /> : 'Salvar'}
              {isLoading && selectedCustomer !== null && !openModal ? <CircularProgress size={24} /> : ''}
              {isLoading && openModal ? <CircularProgress size={24} sx={{mr:1}} /> : null}
              {selectedCustomer ? '' : ''}
            </Button>
          )}
        </DialogActions>
      </Dialog>

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