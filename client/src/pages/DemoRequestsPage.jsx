import { useState, useEffect, useCallback } from 'react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import RequestsTable from '../components/requests/RequestsTable';
import RequestFilters from '../components/requests/RequestFilters';
import Pagination from '../components/common/Pagination';
import requestService from '../services/requestService';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';

export default function DemoRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ search: '', status: '' });
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });

  const { page, limit, goToPage, reset } = usePagination(1, 15);
  const debouncedSearch = useDebounce(filters.search, 350);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        ...(filters.status && { status: filters.status }),
        ...(debouncedSearch && { search: debouncedSearch }),
        sortField: sort.field,
        sortDir: sort.dir,
      };
      const data = await requestService.getRequests(params);
      setRequests(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters.status, debouncedSearch, sort]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    reset();
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    reset();
  };

  return (
    <>
      <Header
        title="Demo Requests"
        subtitle={`${totalItems} total`}
      />
      <PageContainer style={{ padding: 0 }}>
        <div className="card" style={{ margin: 24 }}>
          {error && (
            <div className="alert alert-error" style={{ margin: '16px 16px 0' }}>{error}</div>
          )}

          {/* Filters */}
          <RequestFilters filters={filters} onChange={handleFilterChange} />

          {/* Table */}
          <RequestsTable
            data={requests}
            loading={loading}
            sort={sort}
            onSort={handleSortChange}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderTop: '1px solid var(--color-slate-100)',
              }}
            >
              <span style={{ fontSize: 12.5, color: 'var(--color-slate-500)' }}>
                Page {page} of {totalPages}
              </span>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
