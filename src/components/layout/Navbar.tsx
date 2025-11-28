'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../ui/Button';
import { Menu, X, Terminal, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <button
          className="mr-4 md:hidden text-slate-400 hover:text-slate-100"
          onClick={onMenuClick}
          aria-label="Open menu"
          title="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-green-500">
          <Terminal className="h-6 w-6" />
          <span>CTF Platform</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  {session.user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline-block">{session.user?.username}</span>
              </button>
              
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-slate-800 bg-slate-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-800 mb-1">
                      Signed in as <br />
                      <span className="font-medium text-slate-300 truncate block">{session.user?.email}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
