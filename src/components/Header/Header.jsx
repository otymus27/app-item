import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Nome do Sistema
        </Typography>
        {/* Adicione outros itens do cabeçalho aqui, como botões de navegação */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
