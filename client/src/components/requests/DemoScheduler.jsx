import { useState } from 'react';
import { Calendar } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import requestService from '../../services/requestService';

export default function DemoScheduler({ requestId, currentDatetime, onScheduled }) {
  const [open, setOpen] = useState(false);
  const [datetime, setDatetime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isReschedule = !!currentDatetime;

  const handleSchedule = async () => {
    if (!datetime) return;
    setLoading(true);
    setError(null);
    try {
      await requestService.scheduleDemo(requestId, datetime);
      setOpen(false);
      setDatetime('');
      onScheduled?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule demo');
    } finally {
      setLoading(false);
    }
  };

  // Min datetime: now rounded to next 15 min
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15, 0, 0);
  const minDatetime = now.toISOString().slice(0, 16);

  return (
    <>
      <button className="btn btn-secondary btn-sm" onClick={() => setOpen(true)}>
        <Calendar size={13} />
        {isReschedule ? 'Reschedule' : 'Schedule Demo'}
      </button>

      <Modal
        isOpen={open}
        onClose={() => { setOpen(false); setError(null); setDatetime(''); }}
        title={isReschedule ? 'Reschedule Demo' : 'Schedule Demo'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              disabled={!datetime}
              onClick={handleSchedule}
            >
              {isReschedule ? 'Reschedule' : 'Schedule'}
            </Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Demo Date & Time</label>
          <input
            type="datetime-local"
            className="form-input"
            min={minDatetime}
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-error" style={{ marginTop: 12, fontSize: 12 }}>{error}</div>}
      </Modal>
    </>
  );
}
