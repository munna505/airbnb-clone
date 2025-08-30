import Link from 'next/link';
import { Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';

interface HeaderProps {
  variant?: 'default' | 'back' | 'confirmation';
  title?: string;
  showLogo?: boolean;
}

export default function Header({ variant = 'default', title, showLogo = true }: HeaderProps) {
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
