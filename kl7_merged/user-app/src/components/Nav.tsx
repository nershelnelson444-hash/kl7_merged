import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Button from './Button';
import kl7logo from '../assets/kl7logo.png';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../firebase';

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { user } = useAuth();
  const navigate = useNavigate();

  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(242, 242, 242, 1)", "rgba(242, 242, 242, 0.85)"]
  );
  const backdropFilter = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(230, 230, 230, 1)", "1px solid rgba(230, 230, 230, 0.5)"]
  );

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Bikes', to: '/inventory' },
    { label: 'Sell Your Bike', to: '/sell' },
    { label: 'About', to: '/about-us' },
    { label: 'Contact', to: '/contact' },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Inlined auth button JSX — NOT a nested component so React never unmounts it mid-click
  const authButtonJSX = user ? (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
        className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-black/10 hover:border-black/40 transition-all flex-shrink-0 flex items-center justify-center bg-gray-200"
        title={user.displayName || user.email || 'Profile'}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-sm font-bold text-black">
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[54px] w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <p className="font-semibold text-sm text-black truncate">{user.displayName || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()} // prevent outside-click handler from firing first
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <Link
      to="/login"
      className="h-[46px] px-6 rounded-full flex items-center justify-center border border-grey-main bg-white text-black transition-transform hover:scale-105 flex-shrink-0 font-medium text-sm"
      title="Login"
    >
      Login
    </Link>
  );

  return (
    <>
      <motion.nav
        style={{ backgroundColor, backdropFilter, borderBottom }}
        className="fixed top-0 left-0 w-full h-auto z-50 px-8 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <div className="max-w-[1480px] mx-auto flex flex-row items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={kl7logo} alt="KL7 Garage" className="h-12 w-auto object-contain" />
          </Link>

          {/* Center Nav Links */}
          <div className="hidden lg:flex flex-row items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-text-black font-medium text-base hover:text-text-black-muted transition-colors relative group"
              >
                {label}
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex flex-row items-center gap-3">
            {/* Desktop only: Get in Touch + auth */}
            <div className="hidden lg:flex flex-row items-center gap-3">
              <Button asLink to="/contact" variant="primary">
                Get in Touch
              </Button>
              {authButtonJSX}
            </div>

            {/* Mobile: auth + hamburger */}
            <div className="flex lg:hidden flex-row items-center gap-2">
              {authButtonJSX}
              <button
                className="flex flex-col justify-center items-center w-[46px] h-[46px] rounded-full border border-grey-main bg-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 4 : -2 }}
                  className="block w-5 h-[2px] bg-black mb-[4px]"
                />
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -4 : 2 }}
                  className="block w-5 h-[2px] bg-black"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed inset-0 top-[78px] bg-background-main z-40 flex flex-col p-8 border-t border-grey-main lg:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-medium">
              {navLinks.map(({ label, to }) => (
                <Link key={to} to={to} onClick={() => setIsMobileMenuOpen(false)}>{label}</Link>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <Button asLink to="/contact" variant="primary" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-lg">
                Get in Touch
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}