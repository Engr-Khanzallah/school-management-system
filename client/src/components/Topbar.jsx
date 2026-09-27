import { useAuth } from '../context/AuthContext';

export default function Topbar({ onMenuClick, title }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-navy-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-navy-50"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-xl md:text-2xl font-display text-navy-900">{title}</h1>
      </div>
      <div className="text-sm text-navy-600 hidden sm:block">
        {user?.name} <span className="text-navy-400">·</span> <span className="capitalize">{user?.role}</span>
      </div>
    </header>
  );
}
