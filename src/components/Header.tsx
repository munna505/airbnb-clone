'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowLeft, CheckCircle, User, LogOut, Package, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  variant?: 'default' | 'back' | 'confirmation';
  title?: string;
  showLogo?: boolean;
}

export default function Header({ variant = 'default', title, showLogo = true }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle user dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      
      // Handle mobile menu
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
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
        <div className="flex items-center justify-between py-4">
          {variant === 'back' ? (
            <>
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </>
          ) : variant === 'confirmation' ? (
            <>
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-400 bg-clip-text text-transparent">WelcomeFresh</span>
              </Link>
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Home
              </Link>
            </>
          ) : (
            <>
              {/* Logo Section */}
              <div className="flex items-center">
                {showLogo && (
                  <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <Sparkles className="h-8 w-8 text-green-600" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-400 bg-clip-text text-transparent">WelcomeFresh</span>
                    
                  </Link>
                )}
                {title && (
                  <h1 className="text-xl font-semibold text-gray-900 ml-8">{title}</h1>
                )}
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
              </nav>
              
              {/* Authentication Section - Hidden on mobile */}
              <div className="hidden lg:flex items-center space-x-4">
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {variant === 'default' && showMobileMenu && (
          <div ref={mobileMenuRef} className="lg:hidden absolute top-full right-0 w-2/3 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl z-40 rounded-xl m-2">
            <nav className="flex flex-col p-6">
              {/* Account Section */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Account</h3>
                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium py-3 px-4 rounded-lg group"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium py-3 px-4 rounded-lg group"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Package className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full text-white bg-red-500 hover:bg-red-600 transition-all duration-200 font-medium py-3 px-4 rounded-lg shadow-sm hover:shadow-md"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold text-center shadow-lg hover:shadow-xl"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
