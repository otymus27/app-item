// src/components/ItemTable.jsx
import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Pagination, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ItemTable = ({
  items,
  onEditItem,
  onDeleteItem,
  currentPage,
  totalPages,
  onPageChange,
  sortConfig,
  onSortChange,
}) => {
  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.order === 'asc' ? '↑' : '↓';
  };

  const handleSortClick = (field) => {
    onSortChange(field);
  };

  return (
    <>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSortClick('id')} sx={{ cursor: 'pointer' }}>
              ID {renderSortIcon('id')}
            </TableCell>
            <TableCell onClick={() => handleSortClick('nome')} sx={{ cursor: 'pointer' }}>
              Nome {renderSortIcon('nome')}
            </TableCell>
            <TableCell onClick={() => handleSortClick('descricao')} sx={{ cursor: 'pointer' }}>
              Descrição {renderSortIcon('descricao')}
            </TableCell>
            <TableCell onClick={() => handleSortClick('qrCode')} sx={{ cursor: 'pointer' }}>
              QR Code {renderSortIcon('qrCode')}
            </TableCell>
            <TableCell onClick={() => handleSortClick('disponivel')} sx={{ cursor: 'pointer' }}>
              Disponível {renderSortIcon('disponivel')}
            </TableCell>
            <TableCell> Categorias </TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Nenhum item encontrado.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.qrCode}</TableCell>
                <TableCell>{item.disponivel ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  {item.categorias && item.categorias.length > 0
                    ? item.categorias.map((cat) => cat.nome).join(', ')
                    : 'Nenhuma'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton color="primary" onClick={() => onEditItem(item)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton color="error" onClick={() => onDeleteItem(item.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
};

export default ItemTable;
