import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

const ItemList = ({ paginatedItems, isLoading, user, onEditItem, onDeleteItem, sortConfig, onSortChange }) => {
  // Função para renderizar ícone de ordenação
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

  // Lista vazia
  if (!paginatedItems || paginatedItems.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
        Nenhum item encontrado.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Cabeçalho do ID */}
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
            {/* Cabeçalho do Nome */}
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
            {/* Cabeçalho da Descrição */}
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('descricao')}
            >
              Descrição {renderSortIcon('descricao')}
            </TableCell>
            {/* Cabeçalho do QR Code */}
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('qrcode')}
            >
              QR Code {renderSortIcon('qrcode')}
            </TableCell>
            {/* Cabeçalho de Disponível */}
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('disponivel')}
            >
              Disponível {renderSortIcon('disponivel')}
            </TableCell>
            {/* Cabeçalho de Categorias */}
            <TableCell
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
              onClick={() => handleSortClick('categorias')}
            >
              Categorias {renderSortIcon('categorias')}
            </TableCell>
            {/* Ações (visível apenas para ADMIN) */}
            {user.role === 'ADMIN' && <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>{item.qrCode}</TableCell>
              <TableCell>{item.disponivel ? 'Sim' : 'Não'}</TableCell>
              <TableCell>
                {Array.isArray(item.categorias) ? item.categorias.map((cat) => cat.nome).join(', ') : 'N/A'}
              </TableCell>
              {user.role === 'ADMIN' && (
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary" size="small" onClick={() => onEditItem(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => onDeleteItem(item.id)}>
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

export default ItemList;
