import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from './AdminLayout';
import {
  LayoutDashboard,
  Inbox,
  LogOut,
  BookOpen,
  X
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Demo Requests', to: '/admin/requests', icon: Inbox },
];

const SALES_NAV = [
  { label: 'My Requests', to: '/admin/requests', icon: Inbox },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isOpen, setIsOpen } = useSidebar();
  const navigate = useNavigate();

  const navItems = user?.role === 'ADMIN' ? ADMIN_NAV : SALES_NAV;

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, setIsOpen]);

  // Prevent body scroll on mobile when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        w-[85vw] max-w-xs md:w-[240px] md:max-w-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center">
            <BookOpen size={18} style={{ color: 'var(--color-blue-600)', marginRight: 10 }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-slate-900)', letterSpacing: '-0.01em' }}>
              Eduvo CRM
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 -mr-2 text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <p className="nav-section-label">Navigation</p>
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-item-icon" size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer: user + logout */}
        <div className="p-3 border-t border-slate-200 shrink-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div className="avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--color-slate-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.role === 'ADMIN' ? 'Administrator' : 'Sales Executive'}
              </p>
            </div>
          </div>
          <button className="nav-item text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
            <LogOut className="nav-item-icon" style={{ color: 'inherit' }} size={15} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
