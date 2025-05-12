import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';

const CategoriasList = ({
  paginatedCategorias,
  isLoading,
  user,
  onEditCategoria,
  onDeleteCategoria,
  sortConfig,
  onSortChange,
}) => {
  // Função para renderizar o ícone de ordenação
  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.order === 'asc' ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />;
  };

  // Função para manipular clique de ordenação
  const handleSortClick = (field) => {
    onSortChange(field);
  };

  // Renderização de loading
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Exibe mensagem se não houver categorias
  if (!paginatedCategorias || paginatedCategorias.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
        Nenhuma categoria encontrada.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Coluna ID com ordenação */}
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('id')}
            >
              ID {renderSortIcon('id')}
            </TableCell>
            {/* Coluna Nome com ordenação */}
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('nome')}
            >
              Nome {renderSortIcon('nome')}
            </TableCell>
            {user.role === 'ADMIN' && <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCategorias.map((categoria) => (
            <TableRow key={categoria.id} hover>
              <TableCell>{categoria.id}</TableCell>
              <TableCell>{categoria.nome}</TableCell>
              {user.role === 'ADMIN' && (
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => onEditCategoria(categoria)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDeleteCategoria(categoria.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoriasList;
