import { useState } from 'react';

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const goToPage = (p) => setPage(p);
  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const reset = () => setPage(1);

  return { page, limit, goToPage, nextPage, prevPage, reset };
}
