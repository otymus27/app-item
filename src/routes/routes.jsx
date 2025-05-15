import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage.jsx'; // Página pública
// import LoginPage from '../../pages/LoginPage/LoginPage'; // Página pública (exemplo)
// import Dashboard from '../pages/Dashboard/Dashboard'; // Página privada (exemplo)
import PrivateRoute from './PrivateRoute.jsx';
import ClientesPage from '../pages/Clientes/ClientesPage.jsx';
import UsuariosPage from '../pages/Usuarios/UsuariosPage.jsx';
import CategoriasPage from './pages/Categorias/CategoriasPage';
import EmprestimosPage from '../pages/Emprestimos/EmprestimosPage.jsx';
import EmprestimosRelatorio from '../components/Relatorios/EmprestimosRelatorio.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<PrivateRoute>{/* <Dashboard /> */}</PrivateRoute>} />
        <Route
          path="/cliente"
          element={
            <PrivateRoute>
              <ClientesPage></ClientesPage>
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <UsuariosPage></UsuariosPage>
            </PrivateRoute>
          }
        />

        <Route
          path="/categoria"
          element={
            <PrivateRoute>
              <CategoriasPage></CategoriasPage>
            </PrivateRoute>
          }
        />

        <Routes
          path="/item"
          element={
            <PrivateRoute>
              <ItemPage></ItemPage>
            </PrivateRoute>
          }
        />

        <Routes
          path="/emprestimo"
          element={
            <PrivateRoute>
              <EmprestimosPage></EmprestimosPage>
            </PrivateRoute>
          }
        />

        <Routes
          path="/emprestimo/relatorio"
          element={
            <PrivateRoute>
              <EmprestimosRelatorio></EmprestimosRelatorio>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
