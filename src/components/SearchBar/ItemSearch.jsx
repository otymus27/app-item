// src/components/ItemSearch.jsx
import React from 'react';
import { Box, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

const ItemSearch = ({ searchTerm, handleSearchChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Search sx={{ mr: 1 }} />
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar itens..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </Box>
  );
};

export default ItemSearch;
