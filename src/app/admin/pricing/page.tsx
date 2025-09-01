'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface PricingItem {
  id: number;
  serviceType: 'HOME' | 'AIRBNB';
  key: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPricing() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchPricing();
  }, [session, status, router]);

  const fetchPricing = async () => {
    try {
      const response = await fetch('/api/admin/pricing');
      if (!response.ok) {
        if (response.status === 403) {
          setError('Access denied. Admin privileges required.');
          return;
        }
        throw new Error('Failed to fetch pricing');
      }
      
      const data = await response.json();
      setPricing(data.pricing);
    } catch (error) {
      setError('Failed to load pricing');
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: PricingItem) => {
    setEditingItem(`${item.serviceType}-${item.key}`);
    setEditPrice(item.price);
  };

  const handleSave = async (item: PricingItem) => {
    try {
      const response = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: item.serviceType,
          key: item.key,
          price: editPrice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update pricing');
      }

      setSuccess('Pricing updated successfully!');
      setEditingItem(null);
      fetchPricing(); // Refresh the data
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update pricing');
      console.error('Error updating pricing:', error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditPrice(0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getServiceTypeLabel = (type: string) => {
    return type === 'HOME' ? 'Home Cleaning' : 'Airbnb Cleaning';
  };

  const getKeyLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      'base_price': 'Base Price',
      'bedroom_price': 'Per Bedroom',
      'bathroom_price': 'Per Bathroom',
      'living_area_price': 'Per Living Area',
      'deep_cleaning': 'Deep Cleaning',
      'oven_cleaning': 'Oven Cleaning',
      'fridge_cleaning': 'Fridge Cleaning',
      'window_cleaning': 'Window Cleaning',
      'cabinet_cleaning': 'Cabinet Cleaning',
      'laundry': 'Laundry Service',
      'dishwashing': 'Dishwashing',
      'bed_making': 'Bed Making',
      'towel_replacement': 'Towel Replacement',
      'amenity_restocking': 'Amenity Restocking',
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
                <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
                <p className="text-gray-600">Update service prices</p>
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

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success</h3>
                  <div className="mt-2 text-sm text-green-700">{success}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Service Pricing ({pricing.length} items)
              </h3>
            </div>
            
            {pricing.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pricing data</h3>
                <p className="mt-1 text-sm text-gray-500">No pricing items have been configured yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pricing.map((item) => {
                  const isEditing = editingItem === `${item.serviceType}-${item.key}`;
                  
                  return (
                    <li key={item.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {getKeyLabel(item.key)}
                                </h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {getServiceTypeLabel(item.serviceType)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                Key: {item.key}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {isEditing ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editPrice}
                                onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                                className="w-24 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <button
                                onClick={() => handleSave(item)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-medium text-gray-900">
                                {formatPrice(item.price)}
                              </span>
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-400">
                        Last updated: {new Date(item.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
