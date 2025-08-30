import Link from 'next/link';
import { Sparkles, Home as HomeIcon, Building2 } from 'lucide-react';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Cleaning
            <span className="text-blue-600"> Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Book reliable, professional cleaning services for your home or Airbnb property. 
            Fast, thorough, and affordable solutions tailored to your needs.
          </p>
        </div>

        {/* Service Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Home Clean */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
                             <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                 <HomeIcon className="h-8 w-8 text-blue-600" />
               </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Home Clean</h2>
              <p className="text-gray-600 mb-6">
                Regular home cleaning service with customizable options for bedrooms, 
                bathrooms, and living areas.
              </p>
              <ul className="text-left text-gray-600 mb-8 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Bedroom & bathroom cleaning
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Living area & kitchen
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Flexible scheduling
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Instant price calculation
                </li>
              </ul>
              <Link href="/book/home" className="btn-primary inline-block w-full">
                Book Home Clean
              </Link>
            </div>
          </div>

          {/* Airbnb Clean */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Airbnb Clean</h2>
              <p className="text-gray-600 mb-6">
                Specialized cleaning for Airbnb properties with linen changes, 
                towel services, and bed size options.
              </p>
              <ul className="text-left text-gray-600 mb-8 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Complete property cleaning
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Linen & towel services
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Bed size customization
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Turnover ready
                </li>
              </ul>
              <Link href="/book/airbnb" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block w-full">
                Book Airbnb Clean
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose CleanPro?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Service</h3>
              <p className="text-gray-600">Trained and experienced cleaning professionals</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Booking</h3>
              <p className="text-gray-600">Book anytime with instant confirmation</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">No hidden fees, clear upfront costs</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CleanPro</span>
            </div>
            <p className="text-gray-600 mb-4">Professional cleaning services for homes and Airbnb properties</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/services" className="hover:text-gray-900">Services</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
              <span>© 2024 CleanPro. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
