import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from '@mui/material';
import { getEmprestimos, finalizarEmprestimoById, getEmprestimoById } from '../../services/EmprestimoService';
import EmprestimoDetalhesModal from '../../components/Modals/EmprestimoDetalhesEmprestimo.jsx';

const EmprestimoTable = ({ atualizar, clienteSelecionado }) => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);

  const fetchEmprestimos = async () => {
    try {
      const response = await getEmprestimos({ page, size });
      console.log('Resposta da API:', response);

      // Garantir que response.content seja um array antes de acessá-lo
      const emprestimosLista = Array.isArray(response.content) ? response.content : [];

      // Filtragem por cliente, caso tenha sido selecionado
      const emprestimosFiltrados = clienteSelecionado
        ? emprestimosLista.filter((e) => e.clienteId === clienteSelecionado?.id)
        : emprestimosLista;

      setEmprestimos(emprestimosFiltrados);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
    }
  };

  useEffect(() => {
    fetchEmprestimos();
  }, [page, size, atualizar, clienteSelecionado]);

  const handleFinalizar = async (id) => {
    try {
      await finalizarEmprestimoById(id);
      fetchEmprestimos();
    } catch (error) {
      console.error('Erro ao finalizar empréstimo:', error);
    }
  };

  const abrirDetalhes = async (id) => {
    try {
      const detalhes = await getEmprestimoById(id);
      setEmprestimoSelecionado(detalhes);
      setDetalhesAberto(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const fecharDetalhes = () => {
    setDetalhesAberto(false);
    setEmprestimoSelecionado(null);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Data do Empréstimo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emprestimos.length > 0 ? (
              emprestimos.map((emp) => (
                <TableRow key={emp.id} hover style={{ cursor: 'pointer' }} onClick={() => abrirDetalhes(emp.id)}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.clienteNome}</TableCell>
                  <TableCell>{new Intl.DateTimeFormat('pt-BR').format(new Date(emp.dataEmprestimo))}</TableCell>
                  <TableCell>{emp.status}</TableCell>
                  <TableCell align="center">
                    {emp.status === 'EMPRESTADO' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFinalizar(emp.id);
                        }}
                      >
                        Finalizar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum empréstimo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={size}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
        labelRowsPerPage="Empréstimos por página"
      />

      <EmprestimoDetalhesModal open={detalhesAberto} onClose={fecharDetalhes} emprestimo={emprestimoSelecionado} />
    </Paper>
  );
};

export default EmprestimoTable;
