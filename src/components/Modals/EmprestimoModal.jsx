// src/components/Emprestimos/EmprestimoModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Autocomplete, TextField, CircularProgress, Alert } from '@mui/material';
import { getClientes } from '../../services/ClienteService';
import { getItems } from '../../services/ItemService';
import Snackbar from '../../components/Snackbar/Snackbar';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const EmprestimoModal = ({ open, onClose, onCreate }) => {
  const [clientes, setClientes] = useState([]);
  const [itens, setItens] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [loading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open) {
      carregarDados();
      limparFormulario(); // limpa formulário sempre que abrir modal
    }
  }, [open]);

  const mostrarMensagem = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const carregarDados = async () => {
    try {
      const [clientesResponse, itensResponse] = await Promise.all([getClientes(), getItems()]);
      setClientes(clientesResponse);
      setItens(itensResponse);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const limparFormulario = () => {
    setClienteSelecionado(null);
    setItensSelecionados([]);
  };

  const handleSalvar = async () => {
    if (!clienteSelecionado || itensSelecionados.length === 0) {
      mostrarMensagem('Selecione um cliente e pelo menos um item.', 'warning');
      return;
    }

    const data = {
      clienteId: clienteSelecionado.id,
      itemIds: itensSelecionados.map((item) => item.id),
    };

    onCreate(data);
  };

  return (
    <>
      <ErrorBoundary>
        <Modal open={open} onClose={onClose}>
          <Box sx={style}>
            <Typography variant="h6" gutterBottom>
              Novo Empréstimo
            </Typography>

            <Autocomplete
              options={clientes || []} // Garantir que não seja undefined
              getOptionLabel={(option) => option.nome || ''}
              value={clienteSelecionado || null} // Garantir que 'clienteSelecionado' não seja undefined
              onChange={(event, newValue) => setClienteSelecionado(newValue)}
              renderInput={(params) => <TextField {...params} label="Selecionar Cliente" fullWidth margin="normal" />}
            />

            <Autocomplete
              multiple
              options={itens}
              getOptionLabel={(option) => option.nome}
              value={itensSelecionados}
              onChange={(event, newValue) => setItensSelecionados(newValue)}
              renderInput={(params) => <TextField {...params} label="Selecionar Itens" fullWidth margin="normal" />}
            />

            <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={onClose} variant="outlined" disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSalvar} variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Salvar Empréstimo'}
              </Button>
            </Box>
          </Box>
        </Modal>

        <Snackbar
          open={snackbar?.open || false} // Usa um valor default caso snackbar esteja undefined
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity || 'info'} // Asegura um valor default
            sx={{ width: '100%' }}
          >
            {snackbar.message || 'Mensagem padrão'}
          </Alert>
        </Snackbar>
      </ErrorBoundary>
    </>
  );
};

export default EmprestimoModal;
