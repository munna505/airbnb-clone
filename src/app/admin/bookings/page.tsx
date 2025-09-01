'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface Booking {
  id: string;
  serviceType: 'HOME' | 'AIRBNB';
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
  addons: any;
  bedSizes: any;
  paymentStatus: 'PENDING' | 'COMPLETED';
  paymentCompletedAt: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchBookings();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      if (!response.ok) {
        if (response.status === 403) {
          setError('Access denied. Admin privileges required.');
          return;
        }
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    if (status === 'COMPLETED') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ← Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
                <p className="text-gray-600">View and manage all bookings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Bookings ({bookings.length})
              </h3>
            </div>
            
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                <p className="mt-1 text-sm text-gray-500">No bookings have been made yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {booking.customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {booking.customerName}
                            </h4>
                            <span className={getStatusBadge(booking.paymentStatus)}>
                              {booking.paymentStatus}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customerEmail} • {booking.customerPhone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.address}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(booking.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.serviceType} • {booking.bedrooms} bed, {booking.bathrooms} bath
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.date} at {booking.time}
                        </div>
                        <div className="text-xs text-gray-400">
                          Created: {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Details */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Service Details:</span>
                        <ul className="mt-1 space-y-1">
                          <li>• {booking.bedrooms} Bedrooms</li>
                          <li>• {booking.bathrooms} Bathrooms</li>
                          <li>• {booking.livingAreas} Living Areas</li>
                          {booking.addons && Object.keys(booking.addons).length > 0 && (
                            <li>• Add-ons: {Object.keys(booking.addons).join(', ')}</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">Booking Info:</span>
                        <ul className="mt-1 space-y-1">
                          <li>• ID: {booking.id}</li>
                          <li>• Type: {booking.serviceType}</li>
                          {booking.user && (
                            <li>• User: {booking.user.name} ({booking.user.email})</li>
                          )}
                          {booking.paymentCompletedAt && (
                            <li>• Paid: {formatDate(booking.paymentCompletedAt)}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
