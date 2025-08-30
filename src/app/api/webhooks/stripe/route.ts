import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { moveToConfirmedBooking, removePendingBooking } from '@/lib/data';

// Check if Stripe is configured
const isStripeConfigured = process.env.STRIPE_SECRET_KEY;

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
  console.log('🔵 Stripe webhook received');
  
  if (!stripe || !isStripeConfigured) {
    console.error('Stripe not configured. Webhook processing requires proper Stripe setup.');
    return NextResponse.json(
      { error: 'Webhook processing not configured' },
      { status: 503 }
    );
  }

  let body: string;
  try {
    body = await request.text();
  } catch (error) {
    console.error('Failed to read request body:', error);
    return NextResponse.json(
      { error: 'Failed to read request body' },
      { status: 400 }
    );
  }

  const signature = request.headers.get('stripe-signature');

  console.log('📝 Webhook signature present:', !!signature);
  console.log('🔑 Webhook secret configured:', !!process.env.STRIPE_WEBHOOK_SECRET);

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Webhook signature verified successfully');
    console.log('📦 Event type:', event.type);
    console.log('📦 Event ID:', event.id);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 Payment succeeded:', paymentIntent.id);
        console.log('💰 Payment amount:', paymentIntent.amount);
        console.log('💰 Payment metadata:', paymentIntent.metadata);
        
        const bookingId = paymentIntent.metadata.bookingId;
        if (bookingId) {
          console.log('📋 Processing booking confirmation for:', bookingId);
          await moveToConfirmedBooking(bookingId, paymentIntent.id);
          console.log('✅ Booking confirmed:', bookingId);
        } else {
          console.warn('⚠️ No bookingId found in payment metadata');
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment failed:', failedPaymentIntent.id);
        console.log('❌ Failure reason:', failedPaymentIntent.last_payment_error?.message);
        
        const failedBookingId = failedPaymentIntent.metadata.bookingId;
        if (failedBookingId) {
          console.log('🗑️ Removing pending booking due to payment failure:', failedBookingId);
          await removePendingBooking(failedBookingId);
          console.log('✅ Pending booking removed:', failedBookingId);
        } else {
          console.warn('⚠️ No bookingId found in failed payment metadata');
        }
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('🛒 Checkout session completed:', session.id);
        console.log('🛒 Session metadata:', session.metadata);
        
        const sessionBookingId = session.metadata?.bookingId;
        if (sessionBookingId) {
          console.log('📋 Processing checkout session for booking:', sessionBookingId);
          await moveToConfirmedBooking(sessionBookingId, session.payment_intent as string);
          console.log('✅ Booking confirmed from checkout session:', sessionBookingId);
        } else {
          console.warn('⚠️ No bookingId found in checkout session metadata');
        }
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Return a proper response for Vercel
    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS (if needed)
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
    },
  });
}
