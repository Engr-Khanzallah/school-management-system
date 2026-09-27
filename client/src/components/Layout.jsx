import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import OfflineBanner from './OfflineBanner';

export default function Layout({ title, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <OfflineBanner />
        <Topbar onMenuClick={() => setMenuOpen(true)} title={title} />
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
