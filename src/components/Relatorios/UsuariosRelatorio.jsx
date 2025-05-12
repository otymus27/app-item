import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  Box,
} from '@mui/material';
import {
  Description as PdfIcon,
  TableChart as XlsIcon,
  GridOn as CsvIcon,
  Settings as ConfigIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Definição de colunas disponíveis para usuários
const allColumns = [
  { key: 'login', label: 'Login' },
  { key: 'role', label: 'Role' },
];

const GerarRelatorioUsuarios = ({ usuarios, loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);

  // Inicializa dinamicamente todas as colunas como selecionadas
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.reduce((acc, column) => ({ ...acc, [column.key]: true }), {}),
  );
  const [reportFormat, setReportFormat] = useState('completo');

  // Função para abrir o menu de opções
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Função para fechar o menu de opções
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Abrir diálogo de configuração
  const handleOpenConfig = () => {
    setOpenConfigDialog(true);
    handleCloseMenu();
  };

  // Fechar diálogo de configuração
  const handleCloseConfig = () => {
    setOpenConfigDialog(false);
  };

  // Manipular seleção de colunas
  const handleColumnToggle = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Filtrar, ordenar e mapear usuários com base nas colunas selecionadas
  const prepararDadosRelatorio = () => {
    // Filtrar usuários com base no formato do relatório.
    // Se reportFormat for "ativos" ou "inativos", aplica filtro no campo "status" (caso exista)
    let dadosFiltered = usuarios;
    if (reportFormat === 'ativos') {
      dadosFiltered = usuarios.filter((usuario) => usuario?.status?.toLowerCase() === 'ativo');
    } else if (reportFormat === 'inativos') {
      dadosFiltered = usuarios.filter((usuario) => usuario?.status?.toLowerCase() === 'inativo');
    }

    // Ordenar os usuários pelo login (campo "login")
    dadosFiltered.sort((a, b) => (a.login || '').localeCompare(b.login || ''));

    // Mapear apenas as colunas selecionadas
    return dadosFiltered.map((usuario) => {
      const dadosRelatorio = {};
      allColumns.forEach((col) => {
        if (selectedColumns[col.key]) {
          if (col.key === 'role') {
            // Supondo que "roles" seja um array de objetos, cada um com atributo "nome"
            dadosRelatorio[col.label] =
              usuario.roles && usuario.roles.length > 0 ? usuario.roles.map((role) => role.nome).join(', ') : 'N/A';
          } else {
            dadosRelatorio[col.label] = usuario[col.key] || 'N/A';
          }
        }
      });
      return dadosRelatorio;
    });
  };

  // Gerar relatório em PDF
  const gerarRelatorioPDF = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há usuários para gerar o relatório.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório de Usuários', 14, 22);

    doc.setFontSize(10);
    doc.text(`Formato: ${reportFormat}`, 14, 30);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 36);

    const columns = Object.keys(dadosRelatorio[0]);
    doc.autoTable({
      startY: 44,
      columns: columns.map((col) => ({ header: col, dataKey: col })),
      body: dadosRelatorio,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
    });

    doc.save('relatorio_usuarios.pdf');
    handleCloseMenu();
  };

  // Gerar relatório em XLS (Excel)
  const gerarRelatorioXLS = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há usuários para gerar o relatório.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dadosRelatorio);
    const workbook = XLSX.utils.book_new();

    workbook.Props = {
      Title: 'Relatório de Usuários',
      Subject: `Relatório gerado em ${new Date().toLocaleDateString()}`,
      Author: 'Sistema de Gestão',
      CreatedDate: new Date(),
    };

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários');
    XLSX.writeFile(workbook, 'relatorio_usuarios.xlsx');
    handleCloseMenu();
  };

  // Gerar relatório em CSV
  const gerarRelatorioCSV = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há usuários para gerar o relatório.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dadosRelatorio);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'relatorio_usuarios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleCloseMenu();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenMenu}
        disabled={loading || !usuarios || usuarios.length === 0}
        endIcon={<ConfigIcon />}
      >
        Gerar Relatório
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleOpenConfig}>
          <ListItemIcon>
            <ConfigIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Configurar Relatório" />
        </MenuItem>

        <MenuItem onClick={gerarRelatorioPDF}>
          <ListItemIcon>
            <PdfIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Gerar PDF" />
        </MenuItem>

        <MenuItem onClick={gerarRelatorioXLS}>
          <ListItemIcon>
            <XlsIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Gerar Excel" />
        </MenuItem>

        <MenuItem onClick={gerarRelatorioCSV}>
          <ListItemIcon>
            <CsvIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Gerar CSV" />
        </MenuItem>
      </Menu>

      {/* Diálogo de Configuração do Relatório */}
      <Dialog open={openConfigDialog} onClose={handleCloseConfig} maxWidth="md" fullWidth>
        <DialogTitle>Configurações do Relatório</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Seleção de Formato */}
            <FormControl fullWidth>
              <InputLabel>Formato do Relatório</InputLabel>
              <Select
                value={reportFormat}
                label="Formato do Relatório"
                onChange={(e) => setReportFormat(e.target.value)}
              >
                <MenuItem value="completo">Todos os Usuários</MenuItem>
                <MenuItem value="ativos">Apenas Usuários Ativos</MenuItem>
                <MenuItem value="inativos">Apenas Usuários Inativos</MenuItem>
              </Select>
            </FormControl>

            {/* Seleção de Colunas */}
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Selecione as Colunas</FormLabel>
              <FormGroup>
                {allColumns.map((column) => (
                  <FormControlLabel
                    key={column.key}
                    control={
                      <Checkbox checked={selectedColumns[column.key]} onChange={() => handleColumnToggle(column.key)} />
                    }
                    label={column.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfig} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCloseConfig} color="primary" variant="contained">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GerarRelatorioUsuarios;
