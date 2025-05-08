import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage.jsx';
import HomePage from '../pages/Home/HomePage.jsx';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
