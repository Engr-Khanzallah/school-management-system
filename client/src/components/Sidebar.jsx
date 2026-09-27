import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'teacher', 'student'] },
  { to: '/students', label: 'Students', roles: ['admin', 'teacher'] },
  { to: '/teachers', label: 'Teachers', roles: ['admin'] },
  { to: '/classes', label: 'Classes', roles: ['admin', 'teacher'] },
  { to: '/attendance', label: 'Attendance', roles: ['admin', 'teacher', 'student'] },
  { to: '/exams', label: 'Exams', roles: ['admin', 'teacher', 'student'] },
  { to: '/results', label: 'Results', roles: ['admin', 'teacher', 'student'] },
  { to: '/fees', label: 'Fees', roles: ['admin', 'student'] },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const visible = links.filter((l) => l.roles.includes(user?.role));

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-navy-700 text-cream flex flex-col transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="px-6 py-5 border-b border-navy-600">
          <p className="font-display text-xl">School MS</p>
          <p className="text-xs text-navy-100 mt-1 capitalize">{user?.role} account</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visible.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-clay-500 text-white' : 'text-navy-100 hover:bg-navy-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-navy-600">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-navy-100 hover:bg-navy-600"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
