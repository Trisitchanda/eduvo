import { Menu } from 'lucide-react';
import { useSidebar } from './AdminLayout';

export default function Header({ title, subtitle, actions }) {
  const { setIsOpen } = useSidebar();

  return (
    <div className="page-header flex items-center justify-between sticky top-0 z-40 bg-white border-b border-slate-200 h-14 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsOpen(true)}
          className="md:hidden p-1 -ml-1 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-baseline flex-wrap gap-x-2">
          <span className="page-header-title">{title}</span>
          {subtitle && (
            <span className="page-header-meta hidden sm:inline-block">
              — {subtitle}
            </span>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
