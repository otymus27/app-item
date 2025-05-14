import { useEffect, useState } from 'react';
import { getAllEmprestimos } from '../../services/EmprestimoService';
import { useSnackbar } from '../../hooks/Emprestimos/useSnackbar';

export const useEmprestimosList = () => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);
  const [openDetalhes, setOpenDetalhes] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllEmprestimos();
        setEmprestimos(response); // ou response.data se estiver usando Axios direto
      } catch {
        showSnackbar('Erro ao buscar empréstimos', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDetalhes = (emprestimo) => {
    setEmprestimoSelecionado(emprestimo);
    setOpenDetalhes(true);
  };

  const handleCloseDetalhes = () => {
    setOpenDetalhes(false);
    setEmprestimoSelecionado(null);
  };

  const handleFinalizarEmprestimo = (id) => {
    // implemente depois
  };

  return {
    emprestimos,
    loading,
    emprestimoSelecionado,
    openDetalhes,
    handleOpenDetalhes,
    handleCloseDetalhes,
    handleFinalizarEmprestimo,
  };
};
