import Link from 'next/link';
import { Home, Search, ArrowLeft, Sparkles } from 'lucide-react';
import Header from '@/components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-green-200 rounded-full blur opacity-30"></div>
              <div className="relative bg-white rounded-full w-32 h-32 flex items-center justify-center mx-auto shadow-lg border border-gray-100">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  404
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Oops! The page you&apos;re looking for seems to have been cleaned away. 
            Don&apos;t worry, we&apos;ll help you find what you need.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/" 
              className="btn-primary inline-flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>
            <Link 
              href="/book/home" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Book a Clean
            </Link>
          </div>

          {/* Popular Links */}
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Pages</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link 
                href="/book/home" 
                className="card hover:shadow-lg transition-shadow duration-300 text-left"
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Home Clean</h3>
                    <p className="text-sm text-gray-600">Book home cleaning</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/book/airbnb" 
                className="card hover:shadow-lg transition-shadow duration-300 text-left"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    <Sparkles className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Airbnb Clean</h3>
                    <p className="text-sm text-gray-600">Book Airbnb cleaning</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/contact" 
                className="card hover:shadow-lg transition-shadow duration-300 text-left"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    <Search className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Contact Us</h3>
                    <p className="text-sm text-gray-600">Get in touch</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/orders" 
                className="card hover:shadow-lg transition-shadow duration-300 text-left"
              >
                <div className="flex items-center">
                  <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    <ArrowLeft className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Orders</h3>
                    <p className="text-sm text-gray-600">View bookings</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">
              Still can&apos;t find what you&apos;re looking for?
            </p>
            <Link 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Contact our support team
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-400 bg-clip-text text-transparent">WelcomeFresh</span>
            </div>
            <p className="text-gray-600 mb-6">Professional cleaning services for homes and Airbnb properties</p>
            <div className="text-sm text-gray-500">
              © 2024 WelcomeFresh. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
