/**
 * Navbar.jsx — AgroVision v2
 * Sticky responsive navbar with mobile hamburger menu.
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

// ── Icons ──────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1h-4v-4H8v4H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const DashIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const ChatIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h12a1 1 0 011 1v7a1 1 0 01-1 1H7l-4 3V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6v5M10 14.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6 2 3 8 3 12c0 4.5 3 8 9 8s9-3.5 9-8c0-4-3-8-9-8z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.18" strokeLinejoin="round"/>
    <path d="M12 20V10M12 10C9 8 6 9 4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const LINKS = [
  { to: '/',          labelKey: 'navbar.home',      Icon: HomeIcon  },
  { to: '/dashboard', labelKey: 'navbar.dashboard', Icon: DashIcon  },
  { to: '/chat',      labelKey: 'navbar.chat',      Icon: ChatIcon  },
  { to: '/onion-info', labelKey: 'navbar.onion_info', Icon: InfoIcon },
];

const Navbar = () => {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, toggleLanguage } = useTranslation();

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location]);

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      } border-b border-forest-100`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-forest-700 rounded-lg flex items-center justify-center text-white group-hover:bg-forest-600 transition-colors">
            <LeafIcon />
          </div>
          <span className="font-display font-bold text-lg text-forest-900 tracking-tight">
            Agro<span className="text-forest-500">Vision</span>
          </span>
          <span className="hidden xs:inline text-[10px] font-mono font-semibold bg-forest-100 text-forest-600 px-2 py-0.5 rounded-full tracking-wider uppercase">
            v2
          </span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, labelKey, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                  isActive
                    ? 'nav-link-active'
                    : 'text-gray-500 hover:text-forest-700 hover:bg-forest-50'
                }`
              }
            >
              <Icon />
              {t(labelKey)}
            </NavLink>
          ))}
        </div>

        {/* Right side badges + hamburger */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="text-xs font-sans font-medium text-forest-700 bg-forest-50 border border-forest-200 rounded-full px-3 py-1.5 hover:bg-forest-100 transition-colors"
            title="Toggle language"
          >
            मा/EN
          </button>

          <span className="hidden sm:flex items-center gap-1.5 text-xs font-sans font-medium text-forest-700 bg-forest-50 border border-forest-200 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
            AI Active
          </span>

          {/* Hamburger */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-forest-50 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`block w-5 h-0.5 bg-forest-800 transition-transform duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-forest-800 transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-forest-800 transition-transform duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } border-t border-forest-100 bg-white`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {LINKS.map(({ to, labelKey, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all ${
                  isActive
                    ? 'nav-link-active'
                    : 'text-gray-600 hover:bg-forest-50 hover:text-forest-800'
                }`
              }
            >
              <Icon />
              {t(labelKey)}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;