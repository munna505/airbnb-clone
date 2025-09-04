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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Professional Cleaning
            <span > Services</span>
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

        {/* Transparent Pricing Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No hidden fees, no surprises. See exactly what you&apos;ll pay before you book.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Home Clean Pricing */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-blue-100 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HomeIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Home Clean</h3>
                  <p className="text-gray-600">Starting from</p>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$25</div>
                  <p className="text-sm text-gray-500">per room</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Bedroom</span>
                    <span className="font-semibold text-gray-900">$25</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Bathroom</span>
                    <span className="font-semibold text-gray-900">$30</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Living Room</span>
                    <span className="font-semibold text-gray-900">$35</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Kitchen</span>
                    <span className="font-semibold text-gray-900">$40</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-blue-800">
                    <Sparkles className="h-5 w-5 mr-2" />
                    <span className="font-semibold">What&apos;s Included:</span>
                  </div>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• All cleaning supplies included</li>
                    <li>• 100% satisfaction guarantee</li>
                    <li>• Professional equipment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Airbnb Clean Pricing */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-200 to-green-100 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Airbnb Clean</h3>
                  <p className="text-gray-600">Starting from</p>
                  <div className="text-4xl font-bold text-green-600 mb-2">$80</div>
                  <p className="text-sm text-gray-500">per property</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Studio (1 bed)</span>
                    <span className="font-semibold text-gray-900">$80</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">1 Bedroom</span>
                    <span className="font-semibold text-gray-900">$100</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">2 Bedrooms</span>
                    <span className="font-semibold text-gray-900">$130</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">3+ Bedrooms</span>
                    <span className="font-semibold text-gray-900">$160+</span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-green-800">
                    <Sparkles className="h-5 w-5 mr-2" />
                    <span className="font-semibold">What&apos;s Included:</span>
                  </div>
                  <ul className="mt-2 text-sm text-green-700 space-y-1">
                    <li>• Linen & towel service</li>
                    <li>• Deep cleaning & sanitizing</li>
                    <li>• Turnover ready guarantee</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Features */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Our Pricing is Different</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Hidden Fees</h4>
                <p className="text-gray-600 text-sm">What you see is what you pay. No surprise charges or extra fees.</p>
              </div>
              <div className="text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Instant Quotes</h4>
                <p className="text-gray-600 text-sm">Get your exact price instantly when you book. No waiting for estimates.</p>
              </div>
              <div className="text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Price Protection</h4>
                <p className="text-gray-600 text-sm">Your quoted price is locked in. No price changes after booking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose WelcomeFresh?</h2>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">100% satisfaction guarantee on every service</p>
            </div>
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
            <div className="flex justify-center mb-4">
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Contact Us
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 WelcomeFresh. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
