import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  People,
  Person,
  Inventory,
  Category,
  Assignment,
  AssignmentReturn,
  AddCircleOutline,
  Search,
  BarChart,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 260;

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleToggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const menuStructure = [
    {
      key: 'clientes',
      icon: <People />,
      text: 'Clientes',
      children: [
        { text: 'Gerenciar', path: '/cliente', icon: <AddCircleOutline /> },
        { text: 'Consultar', path: '/clientes/consultar', icon: <Search /> },
        { text: 'Relatório', path: '/clientes/relatorio', icon: <BarChart /> },
      ],
    },
    {
      key: 'usuarios',
      icon: <Person />,
      text: 'Usuários',
      children: [
        { text: 'Cadastrar', path: '/usuarios/cadastrar', icon: <AddCircleOutline /> },
        { text: 'Consultar', path: '/usuarios/consultar', icon: <Search /> },
        { text: 'Relatório', path: '/usuarios/relatorio', icon: <BarChart /> },
      ],
    },
    {
      key: 'itens',
      icon: <Inventory />,
      text: 'Itens',
      children: [
        { text: 'Cadastrar', path: '/itens/cadastrar', icon: <AddCircleOutline /> },
        { text: 'Consultar', path: '/itens/consultar', icon: <Search /> },
        { text: 'Relatório', path: '/itens/relatorio', icon: <BarChart /> },
      ],
    },
    {
      key: 'categorias',
      icon: <Category />,
      text: 'Categorias',
      children: [
        { text: 'Cadastrar', path: '/categorias/cadastrar', icon: <AddCircleOutline /> },
        { text: 'Consultar', path: '/categorias/consultar', icon: <Search /> },
        { text: 'Relatório', path: '/categorias/relatorio', icon: <BarChart /> },
      ],
    },
    {
      key: 'emprestimos',
      icon: <Assignment />,
      text: 'Empréstimos',
      children: [
        { text: 'Novo', path: '/emprestimos/novo', icon: <AddCircleOutline /> },
        { text: 'Consultar', path: '/emprestimos/consultar', icon: <Search /> },
        { text: 'Relatório', path: '/emprestimos/relatorio', icon: <BarChart /> },
      ],
    },
    {
      key: 'devolucoes',
      icon: <AssignmentReturn />,
      text: 'Devoluções',
      children: [
        { text: 'Registrar', path: '/devolucoes/registrar', icon: <AddCircleOutline /> },
        { text: 'Consultar', path: '/devolucoes/consultar', icon: <Search /> },
        { text: 'Relatório', path: '/devolucoes/relatorio', icon: <BarChart /> },
      ],
    },
  ];

  const drawerContent = (
    <Box sx={{ width: drawerWidth, backgroundColor: theme.palette.background.paper, height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ m: 'auto' }}>
          Gerenciador
        </Typography>
      </Toolbar>
      <List>
        {menuStructure.map((menu) => (
          <React.Fragment key={menu.key}>
            <ListItemButton onClick={() => handleToggleMenu(menu.key)}>
              <ListItemIcon>{menu.icon}</ListItemIcon>
              <ListItemText primary={menu.text} />
              {openMenus[menu.key] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMenus[menu.key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {menu.children.map((child) => (
                  <ListItemButton key={child.text} sx={{ pl: 4 }} onClick={() => handleNavigate(child.path)}>
                    <ListItemIcon>{child.icon}</ListItemIcon>
                    <ListItemText primary={child.text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton onClick={() => setMobileOpen(true)} sx={{ position: 'fixed', top: 16, left: 16, zIndex: 2000 }}>
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
