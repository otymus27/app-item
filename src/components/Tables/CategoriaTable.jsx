import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Pagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const CategoriaTable = ({
  categorias,
  onEditCategoria,
  onDeleteCategoria,
  currentPage,
  totalPages,
  onPageChange,
  isAdmin,
}) => {
  return (
    <>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categorias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                Nenhuma categoria encontrada.
              </TableCell>
            </TableRow>
          ) : (
            categorias.map((categoria) => (
              <TableRow key={categoria.id} hover>
                <TableCell>{categoria.id}</TableCell>
                <TableCell>{categoria.nome}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => onEditCategoria(categoria)}>
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton size="small" color="error" onClick={() => onDeleteCategoria(categoria.id)}>
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
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

export default CategoriaTable;
