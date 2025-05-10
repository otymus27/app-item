import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage.jsx'; // Página pública
// import LoginPage from '../../pages/LoginPage/LoginPage'; // Página pública (exemplo)
// import Dashboard from '../pages/Dashboard/Dashboard'; // Página privada (exemplo)
import PrivateRoute from './PrivateRoute.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              {/* <Dashboard /> */}
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
