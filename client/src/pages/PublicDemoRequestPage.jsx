import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { BookOpen, CheckCircle } from 'lucide-react';

const INSTITUTION_TYPES = [
  'K-12 School',
  'College / University',
  'Vocational Institute',
  'Coaching Centre',
  'Online Education Platform',
  'Corporate Training',
  'Other',
];

const STUDENT_COUNT_OPTIONS = [
  { value: '< 100', label: 'Less than 100' },
  { value: '100–500', label: '100 – 500' },
  { value: '500–1000', label: '500 – 1,000' },
  { value: '1000–5000', label: '1,000 – 5,000' },
  { value: '5000+', label: '5,000+' },
];

const FEATURES = [
  'Live Classes',
  'Assessments & Quizzes',
  'Progress Tracking',
  'Parent Portal',
  'Content Library',
  'Certificates',
  'Analytics & Reports',
  'Mobile App',
];

const schema = z.object({
  contact_name: z.string()
    .min(2, 'Full name is required')
    .refine(val => !/^\d+$/.test(val.trim()), 'Name cannot be only numbers'),
  email: z.string().email('Please enter a valid work email'),
  phone: z.string()
    .min(7, 'Phone number is too short')
    .regex(/^[+\d\s\-().]{7,20}$/, 'Please enter a valid phone format')
    .refine(val => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }, 'Phone number must contain between 7 and 15 digits'),
  institution_name: z.string()
    .min(2, 'Institution name is required')
    .refine(val => !/^\d+$/.test(val.trim()), 'Institution name cannot be only numbers'),
  institution_type: z.string().min(1, 'Please select an institution type'),
  student_count: z.string().optional(),
  interested_features: z.array(z.string()).optional(),
  preferred_demo_datetime: z.string().refine(
    (val) => val && new Date(val) > new Date(),
    { message: 'Please choose a future date and time' }
  ),
  requirements: z.string()
    .max(1000)
    .optional()
    .refine(val => !val || !/^\d+$/.test(val.trim()), 'Note cannot be only numbers'),
});

const minDatetime = () => {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return d.toISOString().slice(0, 16);
};

export default function PublicDemoRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { interested_features: [] },
  });

  const toggleFeature = (feature) => {
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(updated);
    setValue('interested_features', updated);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      await api.post('/demo-requests', { ...data, interested_features: selectedFeatures });
      setSubmitted(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-slate-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: '100%',
            background: 'var(--color-white)',
            border: '1px solid var(--color-slate-200)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--color-emerald-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle size={24} style={{ color: 'var(--color-emerald-600)' }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: 8 }}>
            Request Received
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-slate-500)', lineHeight: 1.6 }}>
            Thank you for your interest in Eduvo. Our sales team will review your request and reach out within 1 business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header
        style={{
          width: '100%',
          background: 'var(--color-white)',
          borderBottom: '1px solid var(--color-slate-200)',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={20} style={{ color: 'var(--color-blue-600)' }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-slate-900)' }}>Eduvo</span>
        </div>
        <a
          href="/login"
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--color-slate-600)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-blue-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-slate-600)')}
        >
          Staff Login
        </a>
      </header>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 16px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 680 }}>
          {/* Header text */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Request a Product Demo
            </h1>
            <p style={{ fontSize: 14, color: 'var(--color-slate-500)', maxWidth: 440, margin: '0 auto' }}>
              Fill out the form below and a member of our team will reach out to schedule a personalized walkthrough.
            </p>
          </div>

        {/* Form Card */}
        <div
          className="card"
          style={{ padding: '32px' }}
        >
          {serverError && (
            <div className="alert alert-error" style={{ marginBottom: 24 }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Section: Contact Information */}
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-slate-400)',
                  marginBottom: 16,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--color-slate-100)',
                }}
              >
                Contact Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="contact_name">Full Name *</label>
                  <input
                    {...register('contact_name')}
                    id="contact_name"
                    type="text"
                    className={`form-input ${errors.contact_name ? 'error' : ''}`}
                    placeholder="Jane Smith"
                  />
                  {errors.contact_name && <p className="form-error">{errors.contact_name.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Work Email *</label>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="jane@school.edu"
                  />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number *</label>
                  <input
                    {...register('phone')}
                    id="phone"
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Section: Institution Information */}
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-slate-400)',
                  marginBottom: 16,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--color-slate-100)',
                }}
              >
                Institution Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="institution_name">Institution Name *</label>
                  <input
                    {...register('institution_name')}
                    id="institution_name"
                    type="text"
                    className={`form-input ${errors.institution_name ? 'error' : ''}`}
                    placeholder="Greenfield Academy"
                  />
                  {errors.institution_name && <p className="form-error">{errors.institution_name.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="institution_type">Institution Type *</label>
                  <select
                    {...register('institution_type')}
                    id="institution_type"
                    className={`form-select ${errors.institution_type ? 'error' : ''}`}
                  >
                    <option value="">Select type...</option>
                    {INSTITUTION_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.institution_type && <p className="form-error">{errors.institution_type.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="student_count">Approximate Student Count</label>
                  <select {...register('student_count')} id="student_count" className="form-select">
                    <option value="">Select range...</option>
                    {STUDENT_COUNT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Interested Features */}
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-slate-400)',
                  marginBottom: 16,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--color-slate-100)',
                }}
              >
                Interested Features
              </h2>
              <div className="checkbox-group">
                {FEATURES.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    className={`checkbox-chip ${selectedFeatures.includes(feature) ? 'selected' : ''}`}
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Demo Scheduling */}
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-slate-400)',
                  marginBottom: 16,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--color-slate-100)',
                }}
              >
                Preferred Demo Slot
              </h2>
              <div className="form-group">
                <label className="form-label" htmlFor="preferred_demo_datetime">
                  Preferred Date & Time *
                </label>
                <input
                  {...register('preferred_demo_datetime')}
                  id="preferred_demo_datetime"
                  type="datetime-local"
                  min={minDatetime()}
                  className={`form-input ${errors.preferred_demo_datetime ? 'error' : ''}`}
                />
                {errors.preferred_demo_datetime && (
                  <p className="form-error">{errors.preferred_demo_datetime.message}</p>
                )}
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label" htmlFor="requirements">Additional Requirements</label>
                <textarea
                  {...register('requirements')}
                  id="requirements"
                  className="form-textarea"
                  placeholder="Tell us about your specific needs, challenges, or questions..."
                  rows={4}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="submit-demo-request"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 40, fontSize: 14 }}
            >
              {loading ? (
                <span className="loader-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              ) : (
                'Submit Demo Request'
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--color-slate-400)' }}>
          By submitting this form, you agree to be contacted by the Eduvo sales team.
        </p>
        </div>
      </div>
    </div>
  );
}
