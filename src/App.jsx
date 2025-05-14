import './global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import ClientesPage from './pages/Clientes/ClientesPage';
import UsuariosPage from './pages/Usuarios/UsuariosPage';
import CategoriasPage from './pages/Categorias/CategoriasPage';
import ItemPage from './pages/Item/ItemPage';
import EmprestimosPage from './pages/Emprestimos/EmprestimosPage.jsx';
import { SnackbarProvider } from './hooks/Emprestimos/useSnackbar.jsx'; // Importação do SnackbarProvider

function App() {
  return (
    <SnackbarProvider>
      {' '}
      {/* Envolvendo toda a aplicação com o SnackbarProvider */}
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cliente"
              element={
                <PrivateRoute>
                  <ClientesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <PrivateRoute>
                  <UsuariosPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/categoria"
              element={
                <PrivateRoute>
                  <CategoriasPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/item"
              element={
                <PrivateRoute>
                  <ItemPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/emprestimo"
              element={
                <PrivateRoute>
                  <EmprestimosPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
