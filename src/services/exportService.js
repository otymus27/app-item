// exportService.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export function exportToPDF(data) {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [['Cliente', 'Itens', 'Data Empréstimo', 'Data Devolução', 'Status']],
    body: data.map((e) => [
      e.clienteNome,
      e.itens.map((item) => item.nome).join(', '),
      e.dataEmprestimo,
      e.dataDevolucao || '-',
      e.status,
    ]),
  });
  doc.save('relatorio-emprestimos.pdf');
}

export function exportToExcel(data) {
  const planilha = data.map((e) => ({
    Cliente: e.clienteNome,
    Itens: e.itens.map((item) => item.nome).join(', '),
    'Data Empréstimo': e.dataEmprestimo,
    'Data Devolução': e.dataDevolucao || '-',
    Status: e.status,
  }));
  const ws = XLSX.utils.json_to_sheet(planilha);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Empréstimos');
  XLSX.writeFile(wb, 'relatorio-emprestimos.xlsx');
}

export function exportToCSV(data) {
  const csv = Papa.unparse(
    data.map((e) => ({
      Cliente: e.clienteNome,
      Itens: e.itens.map((item) => item.nome).join(', '),
      'Data Empréstimo': e.dataEmprestimo,
      'Data Devolução': e.dataDevolucao || '-',
      Status: e.status,
    })),
  );
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'relatorio-emprestimos.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
