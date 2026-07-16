import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const user = await login(data.email, data.password);
      if (user.role === 'SALES_EXECUTIVE') {
        navigate('/admin/requests');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid credentials');
    }
  };

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
      <div style={{ width: '100%', maxWidth: 380, position: 'relative' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: -40,
            left: 0,
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-slate-500)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            padding: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-slate-800)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-slate-500)'}
        >
          <ArrowLeft size={14} /> Back to Site
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              background: 'var(--color-slate-900)',
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            <BookOpen size={20} style={{ color: 'white' }} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: 4 }}>
            Eduvo CRM
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--color-slate-500)' }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{ padding: 28 }}
        >
          {serverError && (
            <div className="alert alert-error" style={{ marginBottom: 18, fontSize: 13 }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@company.com"
                id="login-email"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  id="login-password"
                  style={{ paddingRight: 38 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-slate-400)',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ marginTop: 4, width: '100%', justifyContent: 'center', height: 38 }}
              id="login-submit"
            >
              {isSubmitting ? (
                <span className="loader-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12.5, color: 'var(--color-slate-400)' }}>
          Demo Request & Follow-up Management System
        </p>
      </div>
    </div>
  );
}
