import Link from 'next/link';
import { Sparkles, Home, Building2, CheckCircle, Clock, Shield, Users } from 'lucide-react';
import Header from '@/components/Header';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Cleaning Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional cleaning services tailored to your needs. From regular home cleaning 
            to specialized Airbnb turnover services, we ensure your space is spotless and welcoming.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Home Cleaning */}
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Home Cleaning</h2>
                <p className="text-gray-600">Regular residential cleaning service</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Our comprehensive home cleaning service is designed to keep your living space 
              fresh, clean, and comfortable. Perfect for busy families, professionals, or 
              anyone who wants a consistently clean home.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Bedrooms & Bathrooms</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dust all surfaces and furniture
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Clean mirrors and windows
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Vacuum and mop floors
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Sanitize bathrooms
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Change bed linens (optional)
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Living Areas & Kitchen</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Clean kitchen appliances
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Wipe down countertops
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dust and clean furniture
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Vacuum carpets and rugs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Empty trash and recycling
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">From $60</p>
                <p className="text-sm text-gray-600">Based on home size</p>
              </div>
              <Link href="/book/home" className="btn-primary">
                Book Now
              </Link>
            </div>
          </div>

          {/* Airbnb Cleaning */}
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Airbnb Cleaning</h2>
                <p className="text-gray-600">Professional turnover service</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Specialized cleaning service designed specifically for Airbnb and vacation rental 
              properties. We ensure your property is guest-ready with thorough cleaning and 
              professional presentation.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h3>
                        <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Complete Property</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Deep clean all rooms
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Sanitize bathrooms
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Clean appliances
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Vacuum and mop floors
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Dust all surfaces
                </li>
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-green-600">From $90</p>
                <p className="text-sm text-gray-600">Includes premium services</p>
              </div>
              <Link href="/book/airbnb" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose CleanPro?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Team</h3>
              <p className="text-gray-600">
                Our trained and experienced cleaning professionals are background-checked 
                and insured for your peace of mind.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book cleaning services at your convenience with flexible scheduling 
                options and same-day availability.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">
                We stand behind our work with a 100% satisfaction guarantee. 
                If you're not happy, we'll make it right.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="card">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Home Cleaning Rates</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Base Rate</span>
                  <span className="font-semibold">$40</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Bedroom</span>
                  <span className="font-semibold">$25 each</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Bathroom</span>
                  <span className="font-semibold">$20 each</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700">Living Area</span>
                  <span className="font-semibold">$15 each</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Airbnb Cleaning Rates</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Base Rate</span>
                  <span className="font-semibold">$70</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Bedroom</span>
                  <span className="font-semibold">$25 each</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Bathroom</span>
                  <span className="font-semibold">$20 each</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700">Living Area</span>
                  <span className="font-semibold">$15 each</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your cleaning service today and experience the difference that professional 
            cleaning makes in your home or Airbnb property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book/home" className="btn-primary">
              Book Home Cleaning
            </Link>
            <Link href="/book/airbnb" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              Book Airbnb Cleaning
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
