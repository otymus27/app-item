import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const EmprestimoDetalhesModal = ({ open, onClose, emprestimo }) => {
  if (!emprestimo) return null;

  const { id, cliente, itens, dataEmprestimo, dataDevolucao, status } = emprestimo;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Detalhes do Empréstimo</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          <strong>ID:</strong> {id}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Cliente:</strong> {cliente?.nome}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Data do Empréstimo:</strong> {dataEmprestimo}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Data de Devolução:</strong> {dataDevolucao || 'Ainda não devolvido'}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Status:</strong> {status}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Itens Emprestados</Typography>
        <List dense>
          {itens?.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.nome} secondary={`Categoria: ${item.categoria?.nome || 'N/A'}`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmprestimoDetalhesModal;
