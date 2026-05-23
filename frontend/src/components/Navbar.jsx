import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/activities', label: 'Activities' },
    ...(isAuthenticated() ? [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/sessions', label: 'My Sessions' },
    ] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-wellness-500 to-calm-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🧘</span>
            </div>
            <span className="font-bold text-xl text-slate-800 font-display">
              Zen<span className="gradient-text">Space</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to) ? 'bg-wellness-50 text-wellness-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated() ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-wellness-50 rounded-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-wellness-400 to-calm-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user?.firstName || user?.username}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-sm">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
          </div>

          <button onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu">
            <div className="w-5 h-5 flex flex-col justify-center gap-1">
              <span className={`block h-0.5 bg-current transition-all ${isMobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${isMobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${isMobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {isMobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-2 space-y-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-wellness-50 text-wellness-700' : 'text-slate-600 hover:bg-slate-50'
                }`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 mt-2">
              {isAuthenticated() ? (
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link to="/login" className="btn-secondary text-center text-sm py-2">Sign In</Link>
                  <Link to="/register" className="btn-primary text-center text-sm py-2">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
