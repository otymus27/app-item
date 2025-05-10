import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

// Você pode futuramente passar os dados por props
const dashboardData = [
  { title: 'Categorias', value: 12 },
  { title: 'Itens', value: 45 },
  { title: 'Usuários', value: 8 },
  { title: 'Empréstimos', value: 23 },
  { title: 'Clientes', value: 16 },
];

const Dashboard = () => {
  return (
    <Grid container spacing={3} mt={2}>
      {dashboardData.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.title}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="h4" color="primary">{item.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;
