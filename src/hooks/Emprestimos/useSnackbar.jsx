import { useContext, createContext, useState, useCallback } from 'react';
import SnackbarComponent from '../../components/Snackbar/Snackbar'; // Certifique-se de que o SnackbarComponent está correto.

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'info', 'success', 'error', 'warning'
  });

  // Função para mostrar o snackbar
  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Função para fechar o snackbar
  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

// Hook para usar o contexto em outros componentes
export const useSnackbar = () => useContext(SnackbarContext);
