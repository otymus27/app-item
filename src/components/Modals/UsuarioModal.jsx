import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const UsuarioModal = ({ open, onClose, selectedUsuario, formData, onFormChange, onSave, isLoading, user }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedUsuario ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="login"
          label="Login"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.login}
          onChange={(e) => onFormChange('login', e.target.value)}
          required
        />
        <TextField
          margin="dense"
          name="senha"
          label="Senha"
          type="password"
          fullWidth
          variant="outlined"
          value={formData.senha}
          onChange={(e) => onFormChange('senha', e.target.value)}
          required={!selectedUsuario} // Se for novo usuário, senha é obrigatória.
          helperText={selectedUsuario ? 'Preencha para alterar a senha' : ''}
        />
        <FormControl fullWidth margin="dense" variant="outlined" required>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={formData.role}
            onChange={(e) => onFormChange('role', e.target.value)}
            label="Role"
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="BASIC">BASIC</MenuItem>
            <MenuItem value="GERENTE">GERENTE</MenuItem>
            {/* Caso haja mais papéis pré-definidos, adicione-os aqui */}
          </Select>
        </FormControl>
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

export default UsuarioModal;
