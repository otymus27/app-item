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

// Definição de colunas disponíveis para Item
// Observe que a chave "qrCode" usa camelCase conforme nosso backend e interface.
const allColumns = [
  { key: 'nome', label: 'Nome' },
  { key: 'descricao', label: 'Descrição' },
  { key: 'qrCode', label: 'QR Code' },
  { key: 'disponivel', label: 'Disponível' },
  { key: 'categorias', label: 'Categorias' },
];

const ItemRelatorio = ({ items, loading }) => {
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

  // Função que prepara os dados do relatório
  // Para o campo "categorias", se o valor for um array de objetos, mapeia para o nome.
  const prepararDadosRelatorio = () => {
    let dadosFiltered = items;
    if (reportFormat === 'ativos') {
      // Considera itens disponíveis como ativos
      dadosFiltered = items.filter((item) => item.disponivel === true);
    } else if (reportFormat === 'inativos') {
      dadosFiltered = items.filter((item) => item.disponivel === false);
    }

    // Ordena os itens pelo nome
    dadosFiltered.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

    // Mapeia somente as colunas selecionadas, utilizando as labels definidas
    return dadosFiltered.map((item) => {
      const dadosRelatorio = {};
      allColumns.forEach((col) => {
        // Se a coluna não estiver selecionada, não adiciona no relatório
        if (!selectedColumns[col.key]) return;

        let valor = item[col.key];

        // Processa campos especiais
        if (col.key === 'disponivel') {
          valor = valor ? 'Sim' : 'Não';
        }
        if (col.key === 'categorias') {
          // Se o campo categorias for um array de objetos, mapeia para o atributo "nome"
          if (Array.isArray(valor)) {
            if (valor.length > 0 && typeof valor[0] === 'object') {
              valor = valor.map((obj) => obj.nome).join(', ');
            } else {
              valor = valor.join(', ');
            }
          } else {
            valor = valor || 'N/A';
          }
        }
        // Se o valor for nulo ou vazio, substitui por 'N/A'
        dadosRelatorio[col.label] = valor || 'N/A';
      });
      return dadosRelatorio;
    });
  };

  // Gerar relatório em PDF
  const gerarRelatorioPDF = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há itens para gerar o relatório.');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório de Itens', 14, 22);

    doc.setFontSize(10);
    doc.text(`Formato: ${reportFormat}`, 14, 30);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 36);

    const columns = Object.keys(dadosRelatorio[0]);
    doc.autoTable({
      startY: 44,
      columns: columns.map((col) => ({ header: col, dataKey: col })),
      body: dadosRelatorio,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save('relatorio_itens.pdf');
    handleCloseMenu();
  };

  // Gerar relatório em Excel (XLS)
  const gerarRelatorioXLS = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há itens para gerar o relatório.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(dadosRelatorio);
    const workbook = XLSX.utils.book_new();

    workbook.Props = {
      Title: 'Relatório de Itens',
      Subject: `Relatório gerado em ${new Date().toLocaleDateString()}`,
      Author: 'Sistema de Gestão',
      CreatedDate: new Date(),
    };

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Itens');
    XLSX.writeFile(workbook, 'relatorio_itens.xlsx');
    handleCloseMenu();
  };

  // Gerar relatório em CSV
  const gerarRelatorioCSV = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há itens para gerar o relatório.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(dadosRelatorio);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'relatorio_itens.csv');
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
        disabled={loading || !items || items.length === 0}
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
                <MenuItem value="completo">Todos os Itens</MenuItem>
                <MenuItem value="ativos">Apenas Itens Disponíveis</MenuItem>
                <MenuItem value="inativos">Apenas Itens Indisponíveis</MenuItem>
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

export default ItemRelatorio;
