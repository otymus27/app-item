import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';

const ClienteModal = ({ open, onClose, selectedCustomer, formData, onFormChange, onSave, isLoading, user }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          onChange={(e) => onFormChange('nome', e.target.value)}
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
          onChange={(e) => onFormChange('email', e.target.value)}
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
          onChange={(e) => onFormChange('telefone', e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        {user.role === 'ADMIN' && (
          <Button variant="contained" onClick={onSave} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ClienteModal;
