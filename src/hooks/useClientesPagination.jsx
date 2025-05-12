import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 5;

export const useClientesPagination = (filteredCustomers) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return {
    currentPage,
    paginatedCustomers,
    totalPages,
    handlePageChange,
    setCurrentPage,
  };
};
