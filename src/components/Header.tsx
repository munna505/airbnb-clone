'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowLeft, CheckCircle, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  variant?: 'default' | 'back' | 'confirmation';
  title?: string;
  showLogo?: boolean;
}

export default function Header({ variant = 'default', title, showLogo = true }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {variant === 'back' ? (
            <>
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </>
          ) : variant === 'confirmation' ? (
            <>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">CleanPro</span>
              </div>
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Home
              </Link>
            </>
          ) : (
            <>
              {showLogo && (
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">CleanPro</span>
                </div>
              )}
              {title && (
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              )}
              <nav className="hidden md:flex space-x-8">
                <Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Services
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </nav>
              
              {/* Authentication Section */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Package className="h-4 w-4 mr-3" />
                          My Orders
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
