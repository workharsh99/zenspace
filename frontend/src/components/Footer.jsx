import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-wellness-500 to-calm-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🧘</span>
            </div>
            <span className="font-bold text-xl text-white font-display">ZenSpace</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Your personal sanctuary for stress relief and mental wellness.
            Find your calm, restore your balance, and thrive every day.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/activities', label: 'All Activities' },
              { to: '/activities?category=MEDITATION', label: 'Meditation' },
              { to: '/activities?category=BREATHING', label: 'Breathing' },
              { to: '/activities?category=YOGA', label: 'Yoga' },
            ].map(l => (
              <li key={l.to}><Link to={l.to} className="hover:text-wellness-400 transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Account</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: '/login', label: 'Sign In' },
              { to: '/register', label: 'Register' },
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/sessions', label: 'My Sessions' },
            ].map(l => (
              <li key={l.to}><Link to={l.to} className="hover:text-wellness-400 transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">© 2024 ZenSpace. Built with ❤️ for mental wellness.</p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-wellness-500 rounded-full animate-pulse" />
            3 Microservices Running
          </span>
          <span>•</span>
          <span>Spring Boot + React + MongoDB</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
