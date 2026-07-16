import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PageLoader } from '../common/Loader';

const STATUS_COLORS = {
  'New':            '#2563eb',
  'Contacted':      '#f59e0b',
  'Demo Scheduled': '#7c3aed',
  'Demo Completed': '#64748b',
  'Converted':      '#059669',
  'Lost':           '#dc2626',
  'Cancelled':      '#94a3b8',
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div
        style={{
          background: 'var(--color-white)',
          border: '1px solid var(--color-slate-200)',
          borderRadius: 6,
          padding: '8px 12px',
          boxShadow: 'var(--shadow-md)',
          fontSize: 13,
        }}
      >
        <p style={{ fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: 2 }}>{name}</p>
        <p style={{ color: 'var(--color-slate-500)' }}>{value} lead{value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
}

export default function ConversionChart({ data, loading }) {
  if (loading) return <PageLoader />;

  const filtered = (data || []).filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data || []}
        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
        barCategoryGap="35%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-100)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: 'var(--color-slate-500)' }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={40}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: 'var(--color-slate-400)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-slate-50)' }} />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {(data || []).map((entry, idx) => (
            <Cell
              key={idx}
              fill={STATUS_COLORS[entry.name] || 'var(--color-slate-300)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
