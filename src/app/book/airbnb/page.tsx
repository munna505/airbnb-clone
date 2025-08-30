'use client';


import { Building2 } from 'lucide-react';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';

export default function AirbnbBookingPage() {
  const handleStepChange = (_step: number) => {
    // Step change handler
  };

  const handleBookingComplete = async (bookingData: unknown) => {
    // This is now handled by the PaymentForm component
    console.log('Booking data prepared:', bookingData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="back" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book Airbnb Cleaning Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional Airbnb turnover cleaning service with linen changes and towel services. 
            Get your property ready for the next guest with our comprehensive cleaning package.
          </p>
        </div>

        {/* Booking Form */}
        <BookingForm
          serviceType="airbnb"
          onStepChange={handleStepChange}
          onBookingComplete={handleBookingComplete}
        />

        {/* Service Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What&apos;s Included in Airbnb Cleaning
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Property Cleaning</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Deep clean all rooms and surfaces
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Sanitize bathrooms and kitchens
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Clean appliances and fixtures
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Vacuum and mop all floors
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Dust and clean all furniture
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Empty all trash and recycling
                </li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Fresh bed linens and towels
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Restock toiletries and supplies
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Check and replace light bulbs
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Inspect for maintenance issues
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Photo documentation of cleanliness
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Guest-ready property guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Airbnb Cleaning Pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Base Rate</h3>
                <p className="text-2xl font-bold text-green-600">$30</p>
                <p className="text-sm text-gray-600">Airbnb premium</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Bedrooms</h3>
                <p className="text-2xl font-bold text-green-600">$25</p>
                <p className="text-sm text-gray-600">per bedroom</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Bathrooms</h3>
                <p className="text-2xl font-bold text-green-600">$20</p>
                <p className="text-sm text-gray-600">per bathroom</p>
              </div>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Living Areas</h3>
                <p className="text-2xl font-bold text-green-600">$15</p>
                <p className="text-sm text-gray-600">per living area</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Add-ons</h3>
                <p className="text-lg font-bold text-green-600">$10-15</p>
                <p className="text-sm text-gray-600">linen & towel services</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
