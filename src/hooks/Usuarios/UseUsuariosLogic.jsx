import { useState, useEffect, useCallback } from 'react';
import {
  getUsuarios,
  addUsuario,
  updateUsuario,
  deleteUsuario as deleteUsuarioService,
} from '../../services/UsuarioService.js';
import useDebounce from '../../hooks/useDebounce.js';

export const useUsuariosLogic = (user, fetchTrigger) => {
  // Data and UI State
  const [allUsuarios, setAllUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  // Para o usuário, consideramos os campos "login" e "role"
  const [formData, setFormData] = useState({ login: '', role: '' });

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
      const data = await getUsuarios();
      // Adiciona IDs caso necessário
      const processedData = data.map((usuario, index) => ({
        ...usuario,
        id: usuario.id || `generated-${index}`,
      }));
      setAllUsuarios(processedData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger initial fetch and any additional fetches based on fetchTrigger
  useEffect(() => {
    fetchData();
  }, [fetchData, fetchTrigger]);

  // Filtering effect
  useEffect(() => {
    let currentData = [...allUsuarios];
    if (debouncedSearchTerm) {
      // Filtrar pelo campo "login" ou pelos nomes dos papéis (roles)
      currentData = allUsuarios.filter(
        (u) =>
          u.login.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (u.roles && u.roles.some((role) => role.nome.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))),
      );
    }
    setFilteredUsuarios(currentData);
  }, [debouncedSearchTerm, allUsuarios]);

  // Modal Controls
  const handleOpenModal = (usuario = null) => {
    setSelectedUsuario(usuario);
    // Caso esteja editando, popula o formulário com "login" e com o primeiro "role"
    setFormData(
      usuario
        ? { login: usuario.login, role: usuario.roles && usuario.roles[0]?.nome ? usuario.roles[0].nome : '' }
        : { login: '', role: '' },
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    console.log('Antes de resetar, searchTerm =', searchTerm);
    setOpenModal(false);
    setSelectedUsuario(null);
    setFormData({ login: '', role: '', senha: '' });
    setSearchTerm(''); // Reinicia o campo de pesquisa
    console.log('Após reset, searchTerm =', '');
  };

  // CRUD Operations
  const handleSave = async () => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem salvar usuários.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Copia os dados do formulário
      const dataToSend = { ...formData };

      // Mapeamento: converte o valor de role (string) no ID correto
      // Ajuste os valores conforme os IDs reais da sua tabela "tb_roles"
      const roleMapping = {
        ADMIN: 1,
        BASIC: 2,
        GERENTE: 3,
      };

      if (dataToSend.role) {
        const roleId = roleMapping[dataToSend.role];
        if (!roleId) {
          setNotification({
            open: true,
            message: `Role ${dataToSend.role} desconhecida.`,
            severity: 'error',
          });
          setIsLoading(false);
          return;
        }
        dataToSend.roleIds = [roleId];
        delete dataToSend.role;
      }

      // Se estiver em modo de edição e o campo senha estiver vazio, remove o campo 'senha'
      if (selectedUsuario && !dataToSend.senha) {
        delete dataToSend.senha;
      }

      // Debug: exibe no console o payload a ser enviado
      console.log('Payload a ser enviado:', dataToSend);

      let responseMessage = '';
      if (selectedUsuario) {
        await updateUsuario(selectedUsuario.id, dataToSend);
        responseMessage = 'Usuário atualizado com sucesso!';
      } else {
        await addUsuario(dataToSend);
        responseMessage = 'Usuário adicionado com sucesso!';
      }

      setNotification({
        open: true,
        message: responseMessage,
        severity: 'success',
      });

      // Limpa o termo de pesquisa e recarrega a lista de usuários
      setSearchTerm('');
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setNotification({
        open: true,
        message: `Erro ao salvar usuário: ${error.message || ''}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUsuario = async (usuarioId) => {
    if (!user || user.role !== 'ADMIN') {
      setNotification({
        open: true,
        message: 'Apenas administradores podem excluir usuários.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteUsuarioService(usuarioId);
      setNotification({
        open: true,
        message: 'Usuário excluído com sucesso!',
        severity: 'success',
      });
      await fetchData(); // Re-fetch data
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setNotification({
        open: true,
        message: `Erro ao excluir usuário: ${error.message || ''}`,
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
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  return {
    // State
    allUsuarios,
    filteredUsuarios,
    searchTerm,
    isLoading,
    openModal,
    selectedUsuario,
    formData,
    notification,

    // Methods
    setSearchTerm,
    setFormData,
    fetchData,
    handleOpenModal,
    handleCloseModal,
    handleSave,
    handleDeleteUsuario,
    handleSearchChange,
    handleCloseNotification,
  };
};
