import { Suspense } from 'react';
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

async function getBookingData(bookingId: string): Promise<BookingData | null> {
  try {
    // For server-side fetching in Next.js, use relative URL or construct proper URL
    let url: string;
    
    if (process.env.VERCEL_URL) {
      // On Vercel, use the VERCEL_URL environment variable
      url = `https://${process.env.VERCEL_URL}/api/bookings/${bookingId}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      // Use the configured base URL
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}`;
    } else {
      // Fallback to relative URL for local development
      url = `/api/bookings/${bookingId}`;
    }
    
    console.log('🔵 Fetching booking from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // Add cache: 'no-store' to ensure fresh data
      cache: 'no-store',
    });

    if (response.ok) {
      const bookingData = await response.json();
      return bookingData;
    } else {
      console.error('Failed to fetch booking:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching booking:', error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return null;
  }
}

async function sendConfirmationNotification(bookingId: string) {
  try {
    let url: string;
    
    if (process.env.VERCEL_URL) {
      // On Vercel, use the VERCEL_URL environment variable
      url = `https://${process.env.VERCEL_URL}/api/notify`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      // Use the configured base URL
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/notify`;
    } else {
      // Fallback to relative URL for local development
      url = `/api/notify`;
    }
    
    console.log('🔵 Sending notification to URL:', url);
    
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId,
        type: 'confirmation',
      }),
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

interface ConfirmationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function ConfirmationPageContent({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams;
  const bookingId = params.bookingId as string;

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <CheckCircle className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking ID Required
          </h1>
          <p className="text-gray-600 mb-6">
            No booking ID provided. Please check your confirmation link.
          </p>
          <Link href="/" className="btn-primary block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const booking = await getBookingData(bookingId);

  if (!booking) {
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
            The booking you are looking for does not exist. Booking ID: {bookingId}
          </p>
          <Link href="/" className="btn-primary block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Send confirmation notification (fire and forget)
  sendConfirmationNotification(bookingId);

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

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
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
      <ConfirmationPageContent searchParams={searchParams} />
    </Suspense>
  );
}
