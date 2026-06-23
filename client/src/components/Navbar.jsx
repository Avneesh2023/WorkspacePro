import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Clients', path: '/clients' },
    { name: 'Projects', path: '/projects' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Live API', path: 'https://workspacepro-backend-igh5.onrender.com', external: true },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Desktop NavLinks */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                Antigravity Workspace
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 ml-8 font-semibold text-sm">
              {navLinks.map((link) => {
                if (link.external) {
                  return (
                    <a
                      key={link.name}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors py-1 px-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/20"
                    >
                      {link.name}
                    </a>
                  );
                }
                const isActive = location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`transition-colors py-1 px-2.5 rounded-lg ${
                      isActive
                        ? 'text-indigo-400 bg-indigo-500/5'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/20'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User controls & Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4 relative">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>
            
            {/* Avatar Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/35 active:scale-95 transition-all"
            >
              {getInitials(user?.name)}
            </button>

            {/* Profile Dropdown Drawer */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl animate-fade-in">
                  <div className="border-b border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400">
                    Role: <span className="text-indigo-400 capitalize">{user?.role || 'User'}</span>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/40 hover:text-white focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950/95 md:hidden animate-slide-down">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => {
              if (link.external) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-400 hover:bg-slate-800/40 hover:text-white"
                  >
                    {link.name}
                  </a>
                );
              }
              const isActive = location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-semibold ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="border-t border-slate-800 mt-3 pt-3 px-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
