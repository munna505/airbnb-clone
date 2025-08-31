'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Load Stripe outside of component to avoid recreating on every render
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error(
    'Stripe publishable key is not set. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.'
  );
}

const stripePromise = loadStripe(stripePublishableKey!);

interface PaymentFormProps {
  bookingData: {
    serviceType: string;
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
    bedSizes?: Record<number, string>;
  };
  onPaymentSuccess: (sessionId: string, bookingId: string) => void;
  onPaymentError: (error: string) => void;
}

function CheckoutForm({
  bookingData,
  onPaymentSuccess,
  onPaymentError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(true);
  const [stripeLoadTimeout, setStripeLoadTimeout] = useState(false);

  useEffect(() => {
    // Check if Stripe is loaded
    if (stripe && elements) {
      setIsStripeLoading(false);
      setStripeLoadTimeout(false);
    }

    // Set a timeout to show error if Stripe takes too long to load
    const timeout = setTimeout(() => {
      if (!stripe || !elements) {
        setStripeLoadTimeout(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('🔵 Payment form submitted');

    if (!stripe || !elements) {
      console.log('❌ Stripe not ready');
      setError(
        'Payment system is not ready. Please refresh the page and try again.'
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('📤 Sending payment request to server...');
      // Create payment intent on the server
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('📥 Server response status:', response.status);

      if (!response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.log('❌ Server error:', errorData);
          throw new Error(errorData.error || 'Failed to create payment session');
        } else {
          // Handle non-JSON responses (like HTML error pages)
          const errorText = await response.text();
          console.log('❌ Non-JSON error response:', errorText.substring(0, 200));
          throw new Error('Server error: Payment system is temporarily unavailable. Please try again later.');
        }
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.log('❌ Non-JSON success response:', errorText.substring(0, 200));
        throw new Error('Server error: Invalid response format. Please try again later.');
      }

      const { clientSecret, bookingId } = await response.json();
      console.log('✅ Payment intent created successfully');

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: bookingData.customerName,
              email: bookingData.customerEmail,
            },
          },
        });
      console.log('🔵 Payment intent:', paymentIntent);
      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onPaymentError(stripeError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        console.log(paymentIntent);
        if (bookingId) {
          // Payment succeeded, confirm the booking immediately
          try {
            const confirmResponse = await fetch('/api/payment/confirm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                bookingId: bookingId,
                paymentIntentId: paymentIntent.id,
              }),
            });

            if (confirmResponse.ok) {
              console.log('✅ Booking confirmed successfully');
              onPaymentSuccess(paymentIntent.id, bookingId);
            } else {
              console.error('❌ Failed to confirm booking');
              setError('Payment succeeded but booking confirmation failed');
              onPaymentError('Payment succeeded but booking confirmation failed');
            }
          } catch (confirmError) {
            console.error('❌ Error confirming booking:', confirmError);
            setError('Payment succeeded but booking confirmation failed');
            onPaymentError('Payment succeeded but booking confirmation failed');
          }
        } else {
          setError('Payment succeeded but booking ID not found');
          onPaymentError('Payment succeeded but booking ID not found');
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
    disableLink: true,
  };


  // Show loading state while Stripe is loading
  if (isStripeLoading && !stripeLoadTimeout) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-semibold">Loading Payment System...</span>
          </div>
          <p className="text-blue-600 text-sm text-center">
            Please wait while we initialize the secure payment system.
          </p>
        </div>
      </div>
    );
  }

  // Show error if Stripe failed to load after timeout
  if (stripeLoadTimeout || (!stripe || !elements)) {
    return (
      <div className="space-y-6">re
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Payment System Error</span>
          </div>
          <p className="text-red-600 text-sm">
            {stripeLoadTimeout 
              ? 'Payment system is taking longer than expected to load. Please refresh the page and try again.'
              : 'Payment system failed to load. Please refresh the page and try again.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show error only if Stripe failed to load after timeout or configuration issue
  if (!stripePublishableKey) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Payment System Error</span>
          </div>
          <p className="text-red-600 text-sm">
            Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.
          </p>
          <div className="mt-4 p-3 bg-red-100 rounded text-xs text-red-700">
            <strong>Debug Info:</strong>
            <br />
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:{' '}
            {stripePublishableKey || 'NOT SET'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ${bookingData.price}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Pay ${bookingData.price}</span>
          </>
        )}
      </button>

      <div className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card details.
      </div>
    </form>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
