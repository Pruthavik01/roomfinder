import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const { session, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">RoomFinder</Link>

        <nav className="flex items-center space-x-4">
          <Link to="/" className={isActive('/') ? 'text-blue-600' : ''}>Home</Link>

          {session && profile?.role === 'owner' && (
            <Link to="/dashboard" className={isActive('/dashboard') ? 'text-blue-600' : ''}>Dashboard</Link>
          )}

          {session ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="px-3 py-1">
                {profile?.username || session.user.email}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow">
                  <div className="p-3 border-b">
                    <div className="font-semibold">{profile?.username}</div>
                    <div className="text-xs text-gray-500">{session.user.email}</div>
                  </div>
                  <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-50">Profile</button>
                  <button onClick={() => { signOut(); navigate('/login'); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={isActive('/login') ? 'text-blue-600' : ''}>Login</Link>
              <Link to="/register" className="px-3 py-1 bg-blue-600 text-white rounded">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
