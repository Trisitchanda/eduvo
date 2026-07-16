import { formatDistanceToNow, format } from '../../utils/dateUtils';

const ACTION_COLORS = {
  'Lead Created':    'var(--color-blue-600)',
  'Lead Assigned':   'var(--color-violet-600)',
  'Status Changed':  'var(--color-amber-500)',
  'Note Added':      'var(--color-slate-400)',
  'Demo Scheduled':  'var(--color-emerald-600)',
  'Demo Rescheduled':'var(--color-amber-600)',
};

function ActionDetail({ log }) {
  if (log.action === 'Status Changed' && log.old_value && log.new_value) {
    return (
      <span className="timeline-meta">
        {log.old_value} → {log.new_value}
      </span>
    );
  }
  if (log.action === 'Demo Scheduled' || log.action === 'Demo Rescheduled') {
    return (
      <span className="timeline-meta">
        {log.new_value ? format(new Date(log.new_value)) : ''}
      </span>
    );
  }
  return null;
}

export default function ActivityTimeline({ activities = [] }) {
  if (!activities.length) {
    return (
      <p style={{ fontSize: 13, color: 'var(--color-slate-400)', padding: '12px 0' }}>
        No activity yet.
      </p>
    );
  }

  return (
    <div className="timeline">
      {activities.map((log, i) => {
        const dotColor = ACTION_COLORS[log.action] || 'var(--color-slate-300)';
        const isLast = i === activities.length - 1;
        return (
          <div key={log.id} className="timeline-item">
            <div className="timeline-line">
              <span
                className="timeline-dot"
                style={{ background: dotColor, borderColor: 'var(--color-white)' }}
              />
              {!isLast && <div className="timeline-connector" />}
            </div>
            <div className="timeline-content">
              <p className="timeline-action">{log.action}</p>
              <ActionDetail log={log} />
              <p className="timeline-meta">
                {log.user?.name ? `by ${log.user.name} · ` : ''}
                {formatDistanceToNow(new Date(log.createdAt))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
