import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const STATUSES = ['New', 'Contacted', 'Demo Scheduled', 'Demo Completed', 'Converted', 'Lost', 'Cancelled'];

export default function RequestFilters({ filters, onChange }) {
  const [open, setOpen] = useState(false);

  const handleSearch = (e) => {
    onChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatus = (e) => {
    onChange({ ...filters, status: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    onChange({ search: '', status: '', page: 1 });
  };

  const hasFilters = filters.search || filters.status;

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="search-input-wrapper" style={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
        <Search size={14} className="search-input-icon" />
        <input
          type="search"
          className="form-input search-input"
          placeholder="Search by name or institution..."
          value={filters.search || ''}
          onChange={handleSearch}
        />
      </div>

      {/* Status filter */}
      <select
        className="form-select"
        style={{ width: 170 }}
        value={filters.status || ''}
        onChange={handleStatus}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Clear */}
      {hasFilters && (
        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
          <X size={13} />
          Clear
        </button>
      )}
    </div>
  );
}
