import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 5;

export const useCategoriasPagination = (filteredCategorias) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Lógica de Paginação
  const paginatedCategorias = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategorias.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCategorias, currentPage]);

  const totalPages = Math.ceil(filteredCategorias.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return {
    currentPage,
    paginatedCategorias,
    totalPages,
    handlePageChange,
    setCurrentPage,
  };
};
