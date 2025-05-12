import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import { Search, Home } from '@mui/icons-material';

const CategoriaSearch = ({ searchTerm, handleSearchChange, handleGoHome, userRole, onAddCategoria }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
      <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar categorias por nome..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {userRole === 'ADMIN' && (
        <Button variant="contained" color="primary" onClick={onAddCategoria}>
          Adicionar Categoria
        </Button>
      )}
      <Button variant="outlined" startIcon={<Home />} onClick={handleGoHome}>
        Início
      </Button>
    </Box>
  );
};

export default CategoriaSearch;
