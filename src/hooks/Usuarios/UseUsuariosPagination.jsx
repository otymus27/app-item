import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 5;

export const useUsuariosPagination = (filteredUsuarios) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Lógica de Paginação: seleciona os itens da página atual
  const paginatedUsuarios = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsuarios.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsuarios, currentPage]);

  const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return {
    currentPage,
    paginatedUsuarios,
    totalPages,
    handlePageChange,
    setCurrentPage,
  };
};
