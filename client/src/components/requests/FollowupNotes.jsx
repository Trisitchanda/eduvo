import { useState } from 'react';
import { Send } from 'lucide-react';
import { format } from '../../utils/dateUtils';
import requestService from '../../services/requestService';

export default function FollowupNotes({ notes = [], requestId, onNoteAdded }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [nextDate, setNextDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await requestService.addNote(requestId, note.trim(), nextDate || null);
      setNote('');
      setNextDate('');
      onNoteAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Note list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {notes.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--color-slate-400)' }}>No notes yet.</p>
        )}
        {notes.map((n) => (
          <div
            key={n.id}
            style={{
              padding: '10px 12px',
              background: 'var(--color-slate-50)',
              border: '1px solid var(--color-slate-200)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div className="avatar" style={{ width: 22, height: 22, fontSize: 10 }}>
                {n.author?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-slate-700)' }}>
                {n.author?.name || 'Unknown'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-slate-400)', marginLeft: 'auto' }}>
                {format(new Date(n.createdAt))}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-slate-700)', lineHeight: 1.5, margin: 0 }}>
              {n.note}
            </p>
          </div>
        ))}
      </div>

      {/* Add note form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {error && (
          <div className="alert alert-error" style={{ fontSize: 12 }}>{error}</div>
        )}
        <textarea
          className="form-textarea"
          placeholder="Add a follow-up note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">Next Follow-up:</label>
            <input
              type="datetime-local"
              className="form-input !py-1 !px-2 !text-xs !h-8 w-auto"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading || !note.trim()}
          >
            {loading ? (
              <span className="loader-spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
            ) : (
              <Send size={12} />
            )}
            Add Note
          </button>
        </div>
      </form>
    </div>
  );
}
