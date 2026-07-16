import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import StatusBadge from '../components/requests/StatusBadge';
import ActivityTimeline from '../components/requests/ActivityTimeline';
import FollowupNotes from '../components/requests/FollowupNotes';
import DemoScheduler from '../components/requests/DemoScheduler';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { PageLoader } from '../components/common/Loader';
import requestService from '../services/requestService';
import { useAuth } from '../hooks/useAuth';
import { format, formatDate } from '../utils/dateUtils';
import api from '../services/api';

const VALID_TRANSITIONS = {
  'New':            ['Contacted'],
  'Contacted':      ['Demo Scheduled', 'Lost', 'Cancelled'],
  'Demo Scheduled': ['Demo Completed', 'Lost', 'Cancelled'],
  'Demo Completed': ['Converted', 'Lost'],
  'Converted':      [],
  'Lost':           [],
  'Cancelled':      [],
};

export default function DemoRequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status modal
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  // Assign modal (admin only)
  const [assignModal, setAssignModal] = useState(false);
  const [salesUsers, setSalesUsers] = useState([]);
  const [assignTo, setAssignTo] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const fetchRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestService.getRequestById(id);
      setRequest(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchRequest(); }, [fetchRequest]);

  // Load sales users for assign modal (admin only)
  const openAssignModal = async () => {
    setAssignError(null);
    try {
      const res = await api.get('/auth/users?role=SALES_EXECUTIVE');
      setSalesUsers(res.data || []);
      setAssignTo(request?.assigned_to?.toString() || '');
      setAssignModal(true);
    } catch {
      // Fallback if endpoint not available
      setAssignModal(true);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;
    setStatusLoading(true);
    setStatusError(null);
    try {
      await requestService.updateStatus(id, newStatus);
      setStatusModal(false);
      setNewStatus('');
      fetchRequest();
    } catch (err) {
      setStatusError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!assignTo) return;
    setAssignLoading(true);
    setAssignError(null);
    try {
      await requestService.assignRequest(id, parseInt(assignTo));
      setAssignModal(false);
      fetchRequest();
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign request');
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return (
    <div style={{ padding: 32 }}>
      <div className="alert alert-error">{error}</div>
    </div>
  );
  if (!request) return null;

  const allowedStatuses = VALID_TRANSITIONS[request.status] || [];
  const isAdmin = user?.role === 'ADMIN';

  const FEATURES = Array.isArray(request.interested_features)
    ? request.interested_features
    : request.interested_features
      ? JSON.parse(request.interested_features)
      : [];

  return (
    <>
      <Header
        title={request.contact_name}
        subtitle={request.institution_name}
        actions={
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/admin/requests')}
          >
            <ArrowLeft size={13} />
            Back
          </button>
        }
      />

      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
          {/* LEFT: main info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Status bar */}
            <div className="card">
              <div
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatusBadge status={request.status} />
                  {request.preferred_demo_datetime && (
                    <span style={{ fontSize: 12.5, color: 'var(--color-slate-500)' }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {format(new Date(request.preferred_demo_datetime))}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {/* Schedule / Reschedule */}
                  {(request.status === 'Contacted' || request.status === 'Demo Scheduled') && (
                    <DemoScheduler
                      requestId={id}
                      currentDatetime={request.preferred_demo_datetime}
                      onScheduled={fetchRequest}
                    />
                  )}
                  {/* Change Status */}
                  {allowedStatuses.length > 0 && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setNewStatus(''); setStatusModal(true); }}
                    >
                      Change Status
                    </button>
                  )}
                  {/* Assign (admin) */}
                  {isAdmin && (
                    <button className="btn btn-secondary btn-sm" onClick={openAssignModal}>
                      <User size={13} />
                      {request.assignee ? 'Reassign' : 'Assign'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Institution */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Contact Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Contact Info */}
                <div className="detail-section">
                  <p className="detail-section-title">Contact</p>
                  <div className="detail-row">
                    <span className="detail-key">Name</span>
                    <span className="detail-value">{request.contact_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Email</span>
                    <a
                      href={`mailto:${request.email}`}
                      className="detail-value"
                      style={{ color: 'var(--color-blue-600)', textDecoration: 'none' }}
                    >
                      {request.email}
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Phone</span>
                    <span className="detail-value">{request.phone}</span>
                  </div>
                </div>
                {/* Institution */}
                <div className="detail-section md:border-l border-t md:border-t-0 border-slate-200">
                  <p className="detail-section-title">Institution</p>
                  <div className="detail-row">
                    <span className="detail-key">Name</span>
                    <span className="detail-value">{request.institution_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Type</span>
                    <span className="detail-value">{request.institution_type || '—'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Students</span>
                    <span className="detail-value">
                      {request.student_count ? request.student_count.toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features + Requirements */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Requirements</h2>
              </div>
              <div className="detail-section">
                <p className="detail-section-title">Interested Features</p>
                {FEATURES.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {FEATURES.map((f) => (
                      <span
                        key={f}
                        style={{
                          padding: '3px 10px',
                          background: 'var(--color-slate-100)',
                          borderRadius: 20,
                          fontSize: 12,
                          color: 'var(--color-slate-700)',
                          fontWeight: 500,
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--color-slate-400)' }}>None specified</p>
                )}
              </div>
              {request.requirements && (
                <div className="detail-section">
                  <p className="detail-section-title">Additional Requirements</p>
                  <p style={{ fontSize: 13, color: 'var(--color-slate-700)', lineHeight: 1.6 }}>
                    {request.requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Follow-up Notes */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Follow-up Notes</h2>
              </div>
              <div className="card-body">
                <FollowupNotes
                  notes={request.notes || []}
                  requestId={id}
                  onNoteAdded={fetchRequest}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: meta + activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Meta */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Request Info</h2>
              </div>
              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-key">Submitted</span>
                  <span className="detail-value">{formatDate(new Date(request.createdAt))}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Assigned to</span>
                  <span className="detail-value">
                    {request.assignee?.name || <span style={{ color: 'var(--color-slate-400)' }}>Unassigned</span>}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Next follow-up</span>
                  <span className="detail-value">
                    {request.next_followup_date
                      ? formatDate(new Date(request.next_followup_date))
                      : <span style={{ color: 'var(--color-slate-400)' }}>—</span>}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Preferred slot</span>
                  <span className="detail-value" style={{ fontSize: 12 }}>
                    {format(new Date(request.preferred_demo_datetime))}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Activity</h2>
              </div>
              <div className="card-body">
                <ActivityTimeline activities={request.activities || []} />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Status Change Modal */}
      <Modal
        isOpen={statusModal}
        onClose={() => { setStatusModal(false); setStatusError(null); }}
        title="Change Status"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setStatusModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              loading={statusLoading}
              disabled={!newStatus}
              onClick={handleStatusChange}
            >
              Update Status
            </Button>
          </>
        }
      >
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">
            Current status: <StatusBadge status={request.status} />
          </label>
        </div>
        <div className="form-group">
          <label className="form-label">Move to</label>
          <select
            className="form-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Select new status...</option>
            {allowedStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {statusError && (
          <div className="alert alert-error" style={{ marginTop: 12, fontSize: 12 }}>{statusError}</div>
        )}
      </Modal>

      {/* Assign Modal (Admin only) */}
      <Modal
        isOpen={assignModal}
        onClose={() => { setAssignModal(false); setAssignError(null); }}
        title="Assign Request"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setAssignModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              loading={assignLoading}
              disabled={!assignTo}
              onClick={handleAssign}
            >
              Assign
            </Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Sales Executive</label>
          {salesUsers.length > 0 ? (
            <select
              className="form-select"
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
            >
              <option value="">Select sales executive...</option>
              {salesUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
              ))}
            </select>
          ) : (
            <div>
              <input
                type="number"
                className="form-input"
                placeholder="Enter user ID"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              />
              <p className="form-error" style={{ color: 'var(--color-slate-400)', marginTop: 4 }}>
                Enter the ID of the sales executive to assign.
              </p>
            </div>
          )}
        </div>
        {assignError && (
          <div className="alert alert-error" style={{ marginTop: 12, fontSize: 12 }}>{assignError}</div>
        )}
      </Modal>
    </>
  );
}
