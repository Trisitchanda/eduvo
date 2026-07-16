import { useNavigate } from 'react-router';
import StatusBadge from './StatusBadge';
import EmptyState from '../common/EmptyState';
import { PageLoader } from '../common/Loader';
import { formatDate } from '../../utils/dateUtils';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

function SortIcon({ field, sort }) {
  if (sort?.field !== field) return <Minus size={11} style={{ opacity: 0.3 }} />;
  return sort.dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
}

const COLUMNS = [
  { key: 'contact_name', label: 'Contact', sortable: true },
  { key: 'institution_name', label: 'Institution', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'assignee', label: 'Assigned To', sortable: false },
  { key: 'preferred_demo_datetime', label: 'Demo Date', sortable: true },
  { key: 'createdAt', label: 'Submitted', sortable: true },
];

export default function RequestsTable({ data, loading, sort, onSort }) {
  const navigate = useNavigate();

  const handleSort = (key) => {
    if (!sort) return;
    onSort?.({
      field: key,
      dir: sort.field === key && sort.dir === 'asc' ? 'desc' : 'asc',
    });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key}>
                {col.sortable ? (
                  <button className="sort-btn" onClick={() => handleSort(col.key)}>
                    {col.label}
                    <SortIcon field={col.key} sort={sort} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length}>
                <EmptyState
                  title="No requests found"
                  description="Try adjusting your search or filters."
                />
              </td>
            </tr>
          ) : (
            data.map((req) => (
              <tr key={req.id} onClick={() => navigate(`/admin/requests/${req.id}`)}>
                <td>
                  <p style={{ fontWeight: 600, color: 'var(--color-slate-900)', fontSize: 13 }}>
                    {req.contact_name}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-slate-400)', marginTop: 2 }}>
                    {req.email}
                  </p>
                </td>
                <td>
                  <p style={{ fontSize: 13, color: 'var(--color-slate-800)' }}>{req.institution_name}</p>
                  {req.institution_type && (
                    <p style={{ fontSize: 12, color: 'var(--color-slate-400)', marginTop: 2 }}>
                      {req.institution_type}
                    </p>
                  )}
                </td>
                <td>
                  <StatusBadge status={req.status} />
                </td>
                <td>
                  {req.assignee ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div className="avatar">{req.assignee.name[0]?.toUpperCase()}</div>
                      <span style={{ fontSize: 12.5 }}>{req.assignee.name}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--color-slate-400)' }}>Unassigned</span>
                  )}
                </td>
                <td style={{ fontSize: 12.5, color: 'var(--color-slate-600)' }}>
                  {req.preferred_demo_datetime ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{formatDate(new Date(req.preferred_demo_datetime))}</span>
                      {new Date(req.preferred_demo_datetime) < new Date() && !['Demo Completed', 'Converted', 'Lost', 'Cancelled'].includes(req.status) && (
                        <span style={{ 
                          fontSize: 10, 
                          padding: '2px 6px', 
                          background: 'var(--color-red-50)', 
                          color: 'var(--color-red-600)', 
                          borderRadius: 10, 
                          fontWeight: 600,
                          lineHeight: 1 
                        }}>
                          Overdue
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--color-slate-300)' }}>—</span>
                  )}
                </td>
                <td style={{ fontSize: 12.5, color: 'var(--color-slate-500)' }}>
                  {formatDate(new Date(req.createdAt))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
