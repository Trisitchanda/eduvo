import {
  Inbox,
  Sparkles,
  CalendarCheck,
  CheckCircle,
  TrendingUp,
  Clock,
  Percent,
} from 'lucide-react';

const STAT_ITEMS = [
  { key: 'totalRequests',      label: 'Total Requests',      icon: Inbox,         color: 'var(--color-slate-400)' },
  { key: 'newRequests',        label: 'New Requests',        icon: Sparkles,      color: 'var(--color-blue-600)' },
  { key: 'scheduledDemos',     label: 'Scheduled Demos',     icon: CalendarCheck, color: 'var(--color-violet-600)' },
  { key: 'completedDemos',     label: 'Completed',           icon: CheckCircle,   color: 'var(--color-slate-500)' },
  { key: 'convertedLeads',     label: 'Converted',           icon: TrendingUp,    color: 'var(--color-emerald-600)' },
  { key: 'overdueFollowups',   label: 'Overdue Follow-ups',  icon: Clock,         color: 'var(--color-red-600)' },
  { key: 'conversionPercentage', label: 'Conversion Rate',   icon: Percent,       color: 'var(--color-amber-500)', suffix: '%' },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 12,
      }}
    >
      {STAT_ITEMS.map(({ key, label, icon: Icon, color, suffix = '' }) => (
        <div key={key} className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="stat-label">{label}</span>
            <Icon size={15} style={{ color, flexShrink: 0 }} />
          </div>
          <div className="stat-value">
            {loading ? (
              <span className="loader-spinner" style={{ width: 20, height: 20 }} />
            ) : (
              `${stats?.[key] ?? '—'}${suffix}`
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
