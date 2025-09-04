'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import PaymentForm from '@/components/PaymentForm';

interface BookingData {
  serviceType: 'home' | 'airbnb';
  bedrooms: number;
  bathrooms: number;
  livingAreas: number;
  price: number;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  addons?: string[];
  bedSizes?: Record<string, string>;
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);


  useEffect(() => {
    // Get booking data from URL parameters or localStorage
    const dataFromParams = searchParams.get('data');
    const dataFromStorage = localStorage.getItem('bookingData');
    
    if (dataFromParams) {
      try {
        setBookingData(JSON.parse(decodeURIComponent(dataFromParams)));
      } catch (error) {
        console.error('Error parsing booking data from URL:', error);
      }
    } else if (dataFromStorage) {
      try {
        setBookingData(JSON.parse(dataFromStorage));
      } catch (error) {
        console.error('Error parsing booking data from storage:', error);
      }
    }
    

  }, [searchParams]);

  const handlePaymentSuccess = (sessionId: string, bookingId: string) => {
    // Clear booking data from storage
    localStorage.removeItem('bookingData');
    // Redirect to confirmation page with booking ID
    window.location.href = `/confirmation?bookingId=${bookingId}`;
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}. Please try again.`);
  };





  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="back" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Payment
          </h1>
          <p className="text-lg text-gray-600">
            Secure payment to confirm your booking
          </p>
        </div>

        <div className="card">
          <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Booking Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Service</span>
                  <span className="text-sm font-semibold text-gray-900">{bookingData?.serviceType === 'home' ? 'Home Cleaning' : 'Airbnb Cleaning'}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Bedrooms</span>
                  <span className="text-sm font-semibold text-gray-900">{bookingData?.bedrooms}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Bathrooms</span>
                  <span className="text-sm font-semibold text-gray-900">{bookingData?.bathrooms}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Living Areas</span>
                  <span className="text-sm font-semibold text-gray-900">{bookingData?.livingAreas}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Date</span>
                  <span className="text-sm font-semibold text-gray-900">{bookingData?.date}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Time</span>
                  <span className="text-sm font-semibold text-gray-900">{bookingData?.time}</span>
                </div>
                
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-2xl font-bold text-white">${bookingData?.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {
          bookingData !== null && (
            <PaymentForm
              bookingData={bookingData}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )
        }
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
