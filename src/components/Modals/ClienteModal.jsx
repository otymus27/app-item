import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';

const ClienteModal = ({
  open,
  handleClose,
  formData,
  setFormData,
  selectedCustomer,
  handleSave,
  isLoading,
    userRole
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
      <DialogActions sx={{ pb: 2, pr: 2 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        {userRole === 'ADMIN' && (
          <Button variant="contained" onClick={handleSave} disabled={isLoading}>
            {isLoading && selectedCustomer === null ? <CircularProgress size={24} /> : 'Salvar'}
            {isLoading && selectedCustomer !== null ? <CircularProgress size={24} /> : ''}
            {isLoading && open ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
            {selectedCustomer ? 'Salvar Alterações' : 'Criar Cliente'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ClienteModal;