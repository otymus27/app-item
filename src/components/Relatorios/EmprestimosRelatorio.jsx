// RelatorioEmprestimosPage.jsx
import { useEffect, useState } from 'react';

import { TextField, MenuItem } from '@mui/material';
import { Button, Box, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { exportToPDF, exportToExcel, exportToCSV } from '../../services/exportService';
import { FiltroEmprestimos } from '../../components/Filtros/FiltroEmprestimos';
import { getEmprestimosFiltrados } from '../../services/EmprestimoService';

import { useNavigate } from 'react-router-dom';

// Componentes de layout
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary.jsx';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomHeader from '../../components/Header/CustomHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';

export default function EmprestimosRelatorio() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [filtros, setFiltros] = useState({
    status: 'TODOS',
    dataInicio: '',
    dataFim: '',
  });

  const navigate = useNavigate();
  const handleGoHome = () => navigate('/home');

  useEffect(() => {
    fetchEmprestimos();
  }, [filtros]);

  const fetchEmprestimos = async () => {
    const data = await getEmprestimosFiltrados(filtros);
    setEmprestimos(data);
  };

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', height: '100vh', overflowY: 'hidden' }}>
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <CustomHeader />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Button variant="outlined" startIcon={<Home />} onClick={handleGoHome}>
              Início
            </Button>

            <Typography variant="h4" gutterBottom>
              Relatório de Empréstimos
            </Typography>

            <Box sx={{ mb: 2 }}>
              <FiltroEmprestimos filtros={filtros} setFiltros={setFiltros} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="contained" color="primary" onClick={() => exportToPDF(emprestimos)}>
                Exportar PDF
              </Button>
              <Button variant="contained" color="success" onClick={() => exportToExcel(emprestimos)}>
                Exportar Excel
              </Button>
              <Button variant="contained" color="warning" onClick={() => exportToCSV(emprestimos)}>
                Exportar CSV
              </Button>
            </Box>

            <Box component="table" sx={{ width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Cliente</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Itens</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Data Empréstimo</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Data Devolução</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {emprestimos.map((e) => (
                  <tr key={e.id}>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{e.clienteNome}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>
                      {e.itens.map((item) => item.nome).join(', ')}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{e.dataEmprestimo}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{e.dataDevolucao || '-'}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
          <Footer />
        </Box>
      </Box>
    </ErrorBoundary>
  );
}
