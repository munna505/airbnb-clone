'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Home,
  Building2,
  User,
} from 'lucide-react';
import Header from '@/components/Header';

interface BookingData {
  id: string;
  serviceType: 'home' | 'airbnb';
  bedrooms: number;
  bathrooms: number;
  livingAreas: number;
  price: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  date: string;
  time: string;
  addons?: {
    linen: boolean;
    towel: boolean;
  };
  paymentStatus: 'pending' | 'completed';
  createdAt: string;
}

function ConfirmationPageContent() {
  console.log('🔵 ConfirmationPageContent: Component rendering');

  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  console.log(
    '🔵 ConfirmationPageContent: bookingId from search params:',
    bookingId
  );

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  console.log(
    '🔵 ConfirmationPageContent: Initial state - loading:',
    loading,
    'booking:',
    booking,
    'error:',
    _error,
    'retryCount:',
    retryCount
  );

  const fetchBookingDetails = useCallback(async () => {
    console.log(
      '🔵 fetchBookingDetails: Starting fetch for bookingId:',
      bookingId,
      'retryCount:',
      retryCount
    );

    if (!bookingId) {
      console.log('🔴 fetchBookingDetails: No bookingId provided');
      setError('No booking ID provided');
      setLoading(false);
      return;
    }

    try {
      console.log(
        '🔵 fetchBookingDetails: Making API call to /api/bookings/${bookingId}'
      );
      const url = `/api/bookings/${bookingId}`;
      console.log('🔵 fetchBookingDetails: Full URL:', url);

      console.log('🔵 fetchBookingDetails: Starting fetch request...');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log(
        '🔵 fetchBookingDetails: API response status:',
        response.status,
        'ok:',
        response.ok
      );
      if (response.ok) {
        setLoading(false);
        const bookingData = await response.json();
        console.log(
          '🔵 fetchBookingDetails: Booking Data received:',
          bookingData
        );
        console.log(
          '🔵 fetchBookingDetails: Payment status:',
          bookingData.paymentStatus
        );

        // If payment is pending, wait a bit and retry (webhook might be processing)
        if (bookingData.paymentStatus === 'pending' && retryCount < 10) {
          console.log(
            '🔵 fetchBookingDetails: Payment pending, retrying... (attempt',
            retryCount + 1,
            '/10)'
          );
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            console.log('🔵 fetchBookingDetails: Retry timeout triggered');
            fetchBookingDetails();
          }, 1500); // Wait 1.5 seconds and retry
          return;
        } else if (bookingData.paymentStatus === 'pending') {
          console.log(
            '🔵 fetchBookingDetails: Payment still pending after 10 retries, showing booking anyway'
          );
          // After 10 retries, show the booking anyway (payment was successful)
          // The webhook will eventually process and update the status
          setBooking(bookingData);
          setLoading(false);
          return;
        }

        console.log(
          '🔵 fetchBookingDetails: Setting booking data and stopping loading'
        );
        setBooking(bookingData);

        // Send confirmation notifications
        console.log(
          '🔵 fetchBookingDetails: Sending confirmation notification'
        );
        try {
          const notifyResponse = await fetch('/api/notify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookingId,
              type: 'confirmation',
            }),
          });
          console.log(
            '🔵 fetchBookingDetails: Notification response status:',
            notifyResponse.status
          );
        } catch (notifyError) {
          console.log(
            '🔴 fetchBookingDetails: Notification error:',
            notifyError
          );
        }
      } else {
        console.log(
          '🔴 fetchBookingDetails: API response not ok, status:',
          response.status
        );

        // Try to get more details about the error
        try {
          const errorData = await response.text();
          console.log(
            '🔴 fetchBookingDetails: Error response body:',
            errorData
          );
        } catch (e) {
          console.log(
            '🔴 fetchBookingDetails: Could not read error response body'
          );
        }

        // If booking not found, it might still be processing
        // Wait a bit and retry (but limit retries)
        if (retryCount < 5) {
          console.log(
            '🔵 fetchBookingDetails: Booking not found, retrying... (attempt',
            retryCount + 1,
            '/5)'
          );
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            console.log(
              '🔵 fetchBookingDetails: Retry timeout triggered for not found booking'
            );
            fetchBookingDetails();
          }, 2000);
        } else {
          console.log(
            '🔴 fetchBookingDetails: Max retries reached, setting error'
          );
          setError(
            `Booking not found after multiple attempts. Booking ID: ${bookingId}. Please contact support.`
          );
          setLoading(false);
        }
      }
    } catch (error) {
      console.log('🔴 fetchBookingDetails: Caught error:', error);
      setError('Failed to load booking details');
      setLoading(false);
    }
  }, [bookingId, retryCount]);

  useEffect(() => {
    console.log('🔵 useEffect: Component mounted, bookingId:', bookingId);
    if (bookingId) {
      console.log('🔵 useEffect: Calling fetchBookingDetails');
      fetchBookingDetails();
    } else {
      console.log('🔵 useEffect: No bookingId, setting loading to false');
      setLoading(false);
    }
  }, [fetchBookingDetails]);

  // Poll for payment status updates if payment is still pending
  useEffect(() => {
    console.log(
      '🔵 Payment polling useEffect: booking:',
      booking,
      'paymentStatus:',
      booking?.paymentStatus
    );
    if (booking && booking.paymentStatus === 'pending') {
      console.log('🔵 Payment polling useEffect: Setting up polling interval');
      const interval = setInterval(() => {
        console.log(
          '🔵 Payment polling useEffect: Polling for payment status update'
        );
        fetchBookingDetails();
      }, 5000); // Check every 5 seconds

      return () => {
        console.log('🔵 Payment polling useEffect: Clearing interval');
        clearInterval(interval);
      };
    }
  }, [booking, fetchBookingDetails]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  console.log(
    '🔵 ConfirmationPageContent: Current state before render - loading:',
    loading,
    'booking:',
    booking,
    'error:',
    _error
  );

  if (loading) {
    console.log(
      '🔵 ConfirmationPageContent: Rendering loading state, retryCount:',
      retryCount
    );
    return (
      <div className="min-h-screen bg-gray-50">
        <Header variant="confirmation" />

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading State */}
          <div className="text-center mb-12">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Processing Your Booking
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {retryCount > 0
                ? `Confirming payment details... (Attempt ${retryCount}/5)`
                : 'Loading your booking details...'}
            </p>
          </div>

          {/* Loading Card */}
          <div className="card mb-8">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="bg-gray-200 w-12 h-12 rounded-lg mr-4"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Service Details Skeleton */}
                <div>
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule Skeleton */}
                <div>
                  <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="bg-gray-200 w-5 h-5 rounded mr-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Skeleton */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Contact Info */}
          <div className="card mb-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="bg-gray-200 w-5 h-5 rounded mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Loading Next Steps */}
          <div className="card">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start">
                    <div className="bg-gray-200 w-6 h-6 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (_error || !booking) {
    console.log(
      '🔵 ConfirmationPageContent: Rendering error state, error:',
      _error,
      'booking:',
      booking
    );

    const debugBookings = async () => {
      console.log('🔵 Debug: Fetching all bookings');
      try {
        const response = await fetch('/api/bookings');
        const data = await response.json();
        console.log('🔵 Debug: All bookings in database:', data);

        // Try to fetch the first booking to test the API
        if (data.allBookings && data.allBookings.length > 0) {
          const firstBooking = data.allBookings[0];
          console.log(
            '🔵 Debug: Testing fetch for first booking:',
            firstBooking.id
          );
          const testResponse = await fetch(`/api/bookings/${firstBooking.id}`);
          console.log('🔵 Debug: Test fetch status:', testResponse.status);
          if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('🔵 Debug: Test fetch successful:', testData);
          }
        }
      } catch (error) {
        console.log('🔴 Debug: Error fetching bookings:', error);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <CheckCircle className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {_error || 'The booking you are looking for does not exist.'}
          </p>
          <div className="space-y-4">
            <Link href="/" className="btn-primary block">
              Return to Home
            </Link>
            <button onClick={debugBookings} className="btn-secondary block">
              Debug: Check All Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log(
    '🔵 ConfirmationPageContent: Rendering success state with booking:',
    booking
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="confirmation" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your cleaning service has been successfully booked. We&apos;ve sent
            confirmation details to your email and phone number.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="card mb-8">
          <div className="flex items-center mb-6">
            <div
              className={`p-2 rounded-lg mr-4 ${
                booking.serviceType === 'home' ? 'bg-blue-100' : 'bg-green-100'
              }`}
            >
              {booking.serviceType === 'home' ? (
                <Home
                  className={`h-6 w-6 ${
                    booking.serviceType === 'home'
                      ? 'text-blue-600'
                      : 'text-green-600'
                  }`}
                />
              ) : (
                <Building2 className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {booking.serviceType === 'home'
                  ? 'Home Cleaning'
                  : 'Airbnb Cleaning'}
              </h2>
              <p className="text-gray-600">Booking ID: {booking.id}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Service Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Service Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium">{booking.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">{booking.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Living Areas:</span>
                  <span className="font-medium">{booking.livingAreas}</span>
                </div>
                {booking.serviceType === 'airbnb' && booking.addons && (
                  <>
                    {booking.addons.linen && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Linen Service:</span>
                        <span className="font-medium text-green-600">
                          Included
                        </span>
                      </div>
                    )}
                    {booking.addons.towel && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Towel Service:</span>
                        <span className="font-medium text-green-600">
                          Included
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{formatTime(booking.time)}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <span className="text-sm">{booking.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-900">
                Total Amount:
              </span>
              <span className="text-3xl font-bold text-blue-600">
                ${booking.price}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Payment Status:
              <span
                className={`ml-2 font-medium ${
                  booking.paymentStatus === 'completed'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}
              >
                {booking.paymentStatus === 'completed' ? 'Paid' : 'Processing'}
              </span>
              {booking.paymentStatus === 'pending' && (
                <div className="mt-1 text-xs text-gray-500">
                  Payment is being processed. This may take a few moments to
                  update.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <span>{booking.customerName}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <span>{booking.customerEmail}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <span>{booking.customerPhone}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What&apos;s Next?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Confirmation Sent</h4>
                <p className="text-gray-600">
                  We&apos;ve sent confirmation details to your email and phone.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Team Assignment</h4>
                <p className="text-gray-600">
                  Our cleaning team will be assigned and you&apos;ll receive
                  their details.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Service Day</h4>
                <p className="text-gray-600">
                  Our team will arrive at the scheduled time to provide
                  professional cleaning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary text-center">
            Book Another Service
          </Link>
          <Link href="/contact" className="btn-secondary text-center">
            Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmationPage() {
  console.log('🔵 ConfirmationPage: Main component rendering');

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ConfirmationPageContent />
    </Suspense>
  );
}
