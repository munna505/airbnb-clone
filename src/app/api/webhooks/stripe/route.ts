import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { moveToConfirmedBooking, removePendingBooking } from '@/lib/data';

// Check if Stripe is configured
const isStripeConfigured = process.env.STRIPE_SECRET_KEY && 
  process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key' && 
  process.env.STRIPE_SECRET_KEY !== 'sk_test_your_actual_stripe_test_secret_key_here';

let stripe: Stripe | null = null;

if (isStripeConfigured) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

export async function POST(request: NextRequest) {
  if (!stripe || !isStripeConfigured) {
    console.error('Stripe not configured. Webhook processing requires proper Stripe setup.');
    return NextResponse.json(
      { error: 'Webhook processing not configured' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        
        const bookingId = paymentIntent.metadata.bookingId;
        if (bookingId) {
          await moveToConfirmedBooking(bookingId, paymentIntent.id);
          console.log('Booking confirmed:', bookingId);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPaymentIntent.id);
        
        const failedBookingId = failedPaymentIntent.metadata.bookingId;
        if (failedBookingId) {
          await removePendingBooking(failedBookingId);
          console.log('Pending booking removed due to payment failure:', failedBookingId);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
