import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No results', description = 'Nothing here yet.', action }) {
  return (
    <div className="empty-state">
      <Inbox className="empty-icon" />
      <p className="empty-title">{title}</p>
      <p className="empty-desc">{description}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
