import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';

const CategoriaModal = ({ open, onClose, selectedCategoria, formData, onFormChange, onSave, isLoading, user }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedCategoria ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="nome"
          label="Nome da Categoria"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.nome}
          onChange={(e) => onFormChange('nome', e.target.value)}
          required
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

export default CategoriaModal;
