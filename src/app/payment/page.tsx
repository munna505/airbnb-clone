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
  const [loading, setLoading] = useState(true);

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
    
    setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header variant="back" />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="card text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Booking Data Found</h1>
            <p className="text-gray-600 mb-6">
              It looks like there&apos;s no booking data to process. Please go back and complete your booking first.
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Service: {bookingData.serviceType === 'home' ? 'Home Cleaning' : 'Airbnb Cleaning'}</div>
              <div>Bedrooms: {bookingData.bedrooms}</div>
              <div>Bathrooms: {bookingData.bathrooms}</div>
              <div>Living Areas: {bookingData.livingAreas}</div>
              <div>Date: {bookingData.date}</div>
              <div>Time: {bookingData.time}</div>
              <div className="font-semibold text-gray-900 mt-2">Total: ${bookingData.price}</div>
            </div>
          </div>

          <PaymentForm
            bookingData={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
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
