import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Pagination,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ClienteTable = ({
  customers,
  onEdit,
  onDelete,
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
            <TableCell>Email</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.nome}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.telefone}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => onEdit(customer)}>
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton size="small" color="error" onClick={() => onDelete(customer.id)}>
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

export default ClienteTable;
