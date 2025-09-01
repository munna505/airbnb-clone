'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';

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
  addons: Record<string, unknown>;
  bedSizes: Record<string, unknown>;
  paymentStatus: 'PENDING' | 'COMPLETED';
  paymentCompletedAt: string | null;
  createdAt: string;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for authentication to finish loading before checking user
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    fetchUserOrders();
  }, [user, authLoading, router]);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/user/orders');
              if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBookings(data.bookings);
        }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusIcon = (status: string) => {
    return status === 'COMPLETED' ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <Clock className="h-5 w-5 text-yellow-500" />
    );
  };

  const getStatusText = (status: string) => {
    return status === 'COMPLETED' ? 'Completed' : 'Pending';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CleanPro</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading orders...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-4">Start by booking your first cleaning service</p>
              <button
                onClick={() => router.push('/book/home')}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Book Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.serviceType === 'HOME' ? 'Home Cleaning' : 'Airbnb Cleaning'}
                        </h3>
                        {getStatusIcon(booking.paymentStatus)}
                        <span className={`text-sm font-medium ${
                          booking.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {getStatusText(booking.paymentStatus)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatTime(booking.time)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">${booking.price}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <p><strong>Service Details:</strong> {booking.bedrooms} bedrooms, {booking.bathrooms} bathrooms, {booking.livingAreas} living areas</p>
                        <p><strong>Order Date:</strong> {formatDate(booking.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
