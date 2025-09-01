'use client';


import { Home } from 'lucide-react';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';

export default function HomeBookingPage() {
  const handleStepChange = () => {
    // Step change handler
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="back" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book Home Cleaning Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your home professionally cleaned with our comprehensive cleaning service. 
            Customize your booking based on your home&apos;s size and needs.
          </p>
        </div>

        {/* Booking Form */}
        <BookingForm
          serviceType="home"
          onStepChange={handleStepChange}
        />

        {/* Service Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What&apos;s Included in Home Cleaning
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bedrooms & Bathrooms</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Dust all surfaces and furniture
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Clean mirrors and windows
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Vacuum and mop floors
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Sanitize bathrooms
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Change bed linens (if requested)
                </li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Living Areas & Kitchen</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Clean kitchen appliances
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Wipe down countertops
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Dust and clean furniture
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Vacuum carpets and rugs
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Empty trash and recycling
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
