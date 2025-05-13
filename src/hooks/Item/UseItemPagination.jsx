// src/hooks/useItemPagination.jsx
import { useState, useMemo } from 'react';

export const useItemPagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => Math.ceil(items.length / itemsPerPage), [items, itemsPerPage]);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return { currentPage, totalPages, paginatedItems, handlePageChange };
};
