// src/components/Modals/ItemModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Chip,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';

const initialState = {
  nome: '',
  descricao: '',
  disponivel: false,
  categorias: [],
};

const ItemModal = ({ open, onClose, itemData, categories, onSave, loading }) => {
  const [item, setItem] = useState(initialState);

  useEffect(() => {
    if (open) {
      if (itemData && itemData.id) {
        // Modo edição: Carrega os dados do item e garante que o campo "categorias" exista
        setItem({ ...itemData, categorias: itemData.categorias || [] });
      } else {
        // Modo cadastro: Inicializa com formulário vazio
        setItem(initialState);
      }
    }
  }, [open, itemData]);

  // Converte as categorias para array de IDs numéricos, independentemente do formato (objeto ou ID)
  const currentCategoryIds =
    Array.isArray(item.categorias) && item.categorias.length > 0
      ? item.categorias.map((c) => (typeof c === 'object' ? Number(c.id) : Number(c)))
      : [];

  const handleChange = (field, value) => {
    setItem((prev) => ({ ...prev, [field]: value }));
  };

  // Ao salvar, prepara o objeto garantindo que o campo "categorias" seja um array de números
  const handleSave = () => {
    const itemToSave = {
      ...item,
      categorias: currentCategoryIds,
    };
    onSave(itemToSave);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{item && item.id ? 'Editar Item' : 'Cadastrar Item'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nome"
          variant="outlined"
          margin="normal"
          value={item.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
        />
        <TextField
          fullWidth
          label="Descrição"
          variant="outlined"
          margin="normal"
          value={item.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(item.disponivel)}
              onChange={(e) => handleChange('disponivel', e.target.checked)}
              color="primary"
            />
          }
          label="Disponível"
        />
        <Autocomplete
          multiple
          options={categories}
          getOptionLabel={(option) => option.nome}
          value={categories.filter((cat) => currentCategoryIds.includes(Number(cat.id)))}
          onChange={(event, newValue) =>
            handleChange(
              'categorias',
              newValue.map((cat) => Number(cat.id)),
            )
          }
          renderTags={(value, getTagProps) =>
            value.map((option, index) => <Chip key={option.id} label={option.nome} {...getTagProps({ index })} />)
          }
          renderInput={(params) => (
            <TextField {...params} label="Categorias" placeholder="Selecione categorias" margin="normal" fullWidth />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : item && item.id ? 'Salvar' : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemModal;
