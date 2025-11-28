'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '../ui/Button';
import { 
  LayoutDashboard, 
  Flag, 
  Trophy, 
  Users, 
  Settings, 
  Megaphone, 
  FileText,
  Shield
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const playerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/challenges', label: 'Challenges', icon: Flag },
    { href: '/scoreboard', label: 'Scoreboard', icon: Trophy },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Admin Home', icon: Shield },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/challenges', label: 'Manage Challenges', icon: Flag },
    { href: '/admin/submissions', label: 'Submissions', icon: FileText },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  ];

  const links = isAdmin && pathname.startsWith('/admin') ? adminLinks : playerLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-800 bg-slate-950 transition-transform duration-200 ease-in-out md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-800 px-6 md:hidden">
          <span className="text-lg font-bold text-blue-500">Menu</span>
        </div>
        
        <div className="flex flex-col gap-1 p-4">
          {isAdmin && (
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Switch View
              </div>
              <Link
                href={pathname.startsWith('/admin') ? '/dashboard' : '/admin'}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Settings className="h-4 w-4" />
                {pathname.startsWith('/admin') ? 'Player View' : 'Admin Dashboard'}
              </Link>
            </div>
          )}

          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onClose()}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
