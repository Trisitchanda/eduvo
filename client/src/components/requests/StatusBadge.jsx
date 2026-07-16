const STATUS_CONFIG = {
  'New':            { cls: 'badge-new',       label: 'New' },
  'Contacted':      { cls: 'badge-contacted', label: 'Contacted' },
  'Demo Scheduled': { cls: 'badge-scheduled', label: 'Demo Scheduled' },
  'Demo Completed': { cls: 'badge-completed', label: 'Demo Completed' },
  'Converted':      { cls: 'badge-converted', label: 'Converted' },
  'Lost':           { cls: 'badge-lost',      label: 'Lost' },
  'Cancelled':      { cls: 'badge-cancelled', label: 'Cancelled' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { cls: 'badge-new', label: status };
  return <span className={`badge ${config.cls}`}>{config.label}</span>;
}
