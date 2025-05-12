import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ClientesList = ({ paginatedCustomers, isLoading, user, onEditCustomer, onDeleteCustomer }) => {
  // Condição de carregamento
  if (isLoading && (!paginatedCustomers || paginatedCustomers.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Condição de lista vazia
  if (!isLoading && (!paginatedCustomers || paginatedCustomers.length === 0)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Nenhum cliente encontrado.
        </Typography>
      </Box>
    );
  }

  return (
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
        {paginatedCustomers.map((customer) => (
          <TableRow key={`customer-${customer.id}`} hover>
            <TableCell>{customer.id}</TableCell>
            <TableCell>{customer.nome}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.telefone}</TableCell>
            <TableCell align="right">
              <IconButton size="small" color="primary" onClick={() => onEditCustomer(customer)}>
                <Edit />
              </IconButton>
              {user.role === 'ADMIN' && (
                <IconButton size="small" color="error" onClick={() => onDeleteCustomer(customer.id)}>
                  <Delete />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientesList;
