import React, { useState, useEffect } from 'react';
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
  Alert,
} from '@mui/material';
import { Edit, Delete, Home, Search, ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../services/ClienteService.js';

const ClientesPage = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Estado dos modais
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };
    fetchData();
  }, []);

  // Controle do modal
  const handleOpen = (customer = null) => {
    setSelectedCustomer(customer);
    setFormData(customer || { nome: '', email: '', telefone: '' });
    setOpen(true); // Garante que o modal abre corretamente
  };

  const handleClose = () => {
    setSelectedCustomer(null);
    setFormData({ nome: '', email: '', telefone: '' });
    setOpen(false);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredCustomers(
      customers.filter((c) => c.nome.toLowerCase().includes(value) || c.email.toLowerCase().includes(value)),
    );
  };

  // Salvar cliente
  // Salvar cliente
  const handleSave = async () => {
    if (!user || user.role !== 'ADMIN') {
      alert('Apenas administradores podem salvar clientes.');
      return;
    }

    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
      } else {
        await addCustomer(formData);
        setCurrentPage(0); // Reseta para recarregar os novos dados
      }

      setCustomers([]); // Limpa lista para forçar atualização correta
      setCurrentPage(0); // Reseta a paginação para carregar desde o início
      handleClose();
    } catch {
      alert('Erro ao salvar cliente.');
    }
  };
  // Controle de Paginação
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const handleNextPage = () => {
    if (indexOfLastCustomer < filteredCustomers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Função corrigida para navegação
  const handleGoHome = () => {
    console.log('Navegando para /home'); // Depuração
    navigate('/home'); // Agora funcionando corretamente
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Erro ao carregar dados do usuário. Tente novamente.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomHeader />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Gerenciamento de Clientes
          </Typography>

          {/* Campo de Pesquisa */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Search sx={{ mr: 1 }} />
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Box>

          {/* Botões de navegação da página */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Button variant="contained" startIcon={<ArrowBack />} onClick={handlePrevPage} disabled={currentPage === 1}>
              Anterior
            </Button>
            <Typography>Página {currentPage}</Typography>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleNextPage}
              disabled={indexOfLastCustomer >= filteredCustomers.length}
            >
              Próximo
            </Button>
          </Box>

          {/* Botão de cadastrar cliente corrigido */}
          {user.role === 'ADMIN' && (
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleOpen()}>
              Adicionar Cliente
            </Button>
          )}

          {/* Botão de voltar para a Home corrigido */}
          <Button variant="outlined" startIcon={<Home />} sx={{ ml: 2, mt: 2 }} onClick={handleGoHome}>
            Voltar para Página Inicial
          </Button>

          {/* Tabela de Clientes */}
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.nome}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.telefone}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(customer)}>
                      <Edit />
                    </IconButton>
                    {user.role === 'ADMIN' && (
                      <IconButton onClick={() => deleteCustomer(customer.id)}>
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Modal de Cadastro/Edição de Clientes */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{selectedCustomer ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="dense"
                name="nome"
                label="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
              <TextField
                fullWidth
                margin="dense"
                name="email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                fullWidth
                margin="dense"
                name="telefone"
                label="Telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              {user.role === 'ADMIN' && (
                <Button variant="contained" onClick={handleSave}>
                  Salvar
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default ClientesPage;
