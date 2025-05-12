import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Pagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UsuarioTable = ({ usuarios, onEdit, onDelete, currentPage, totalPages, onPageChange, isAdmin }) => {
  return (
    <>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Login</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usuario) => (
              <TableRow key={usuario.id} hover>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.login}</TableCell>
                <TableCell>
                  {usuario.roles && usuario.roles.length > 0
                    ? usuario.roles.map((role) => role.nome).join(', ')
                    : 'N/A'}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => onEdit(usuario)}>
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton size="small" color="error" onClick={() => onDelete(usuario.id)}>
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

export default UsuarioTable;
