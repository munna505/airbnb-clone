import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addPendingBooking } from '@/lib/data';

// Check if Stripe is configured
const isStripeConfigured = process.env.STRIPE_SECRET_KEY

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
  console.log('🔵 Payment API route called');
  try {
    const body = await request.json();
    console.log('📦 Request body received:', JSON.stringify(body, null, 2));
    const { 
      serviceType, bedrooms, bathrooms, livingAreas, price,
      customerName, customerEmail, customerPhone, address, date, time,
      addons, bedSizes 
    } = body;

    if (!serviceType || !bedrooms || !bathrooms || !livingAreas || !price ||
        !customerName || !customerEmail || !customerPhone || !address || !date || !time) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    // Create a temporary booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const pendingBooking = {
      id: bookingId,
      serviceType,
      bedrooms,
      bathrooms,
      livingAreas,
      price,
      customerName,
      customerEmail,
      customerPhone,
      address,
      date,
      time,
      addons,
      bedSizes,
      paymentStatus: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    await addPendingBooking(pendingBooking);

    // Require Stripe to be configured for real payments
    if (!stripe || !isStripeConfigured) {
      console.error('Stripe not configured. Please set up STRIPE_SECRET_KEY in your environment variables.');
      return NextResponse.json(
        { error: 'Payment processing is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Create Stripe PaymentIntent instead of CheckoutSession
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        bookingId: bookingId,
        customerName: customerName,
        customerEmail: customerEmail,
        serviceType: serviceType,
      },
      description: `Cleaning Service - ${serviceType} - Booking ID: ${bookingId}`,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      bookingId: bookingId,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
