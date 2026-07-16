import { useNavigate } from 'react-router';
import StatusBadge from '../requests/StatusBadge';
import { formatDistanceToNow } from '../../utils/dateUtils';

export default function RecentActivity({ requests = [], loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div className="loader-full" />
      </div>
    );
  }

  if (!requests.length) {
    return (
      <p style={{ fontSize: 13, color: 'var(--color-slate-400)', padding: '16px 0' }}>
        No recent activity.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {requests.map((req) => (
        <div
          key={req.id}
          onClick={() => navigate(`/admin/requests/${req.id}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 0',
            borderBottom: '1px solid var(--color-slate-100)',
            cursor: 'pointer',
          }}
          className="hover:bg-slate-50"
        >
          <div className="avatar">
            {req.contact_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {req.contact_name}
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-slate-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {req.institution_name}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
            <StatusBadge status={req.status} />
            <span style={{ fontSize: 11, color: 'var(--color-slate-400)' }}>
              {formatDistanceToNow(new Date(req.createdAt))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
