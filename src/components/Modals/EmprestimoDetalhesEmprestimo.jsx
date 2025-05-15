// EmprestimoDetalhesModal.jsx
import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const EmprestimoDetalhesModal = ({ open, onClose, emprestimo }) => {
  if (!emprestimo) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Detalhes do Empréstimo #{emprestimo.id}
        </Typography>

        <Typography>Cliente: {emprestimo.clienteNome}</Typography>
        <Typography>Data do Empréstimo: {emprestimo.dataEmprestimo}</Typography>
        <Typography>Status: {emprestimo.status}</Typography>

        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Itens:</Typography>
        <List dense>
          {emprestimo.itens.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.nome} />
            </ListItem>
          ))}
        </List>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} variant="outlined">
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmprestimoDetalhesModal;
