// FiltroEmprestimos.jsx
import { TextField, MenuItem } from '@mui/material';

export function FiltroEmprestimos({ filtros, setFiltros }) {
  return (
    <div className="flex gap-4 items-end">
      <TextField
        label="Status"
        select
        value={filtros.status}
        onChange={(e) => setFiltros((prev) => ({ ...prev, status: e.target.value }))}
      >
        <MenuItem value="TODOS">Todos</MenuItem>
        <MenuItem value="EMPRESTADO">Emprestado</MenuItem>
        <MenuItem value="DEVOLVIDO">Devolvido</MenuItem>
      </TextField>
      <TextField
        label="Data Início"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={filtros.dataInicio}
        onChange={(e) => setFiltros((prev) => ({ ...prev, dataInicio: e.target.value }))}
      />
      <TextField
        label="Data Fim"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={filtros.dataFim}
        onChange={(e) => setFiltros((prev) => ({ ...prev, dataFim: e.target.value }))}
      />
    </div>
  );
}
