import { NextRequest, NextResponse } from 'next/server';
import { moveToConfirmedBooking } from '@/lib/data';

export async function POST(request: NextRequest) {
  console.log('🔵 Payment confirmation API route called');
  
  // Set proper headers for JSON response
  const headers = {
    'Content-Type': 'application/json',
  };
  
  try {
    const body = await request.json();
    const { bookingId, paymentIntentId } = body;

    if (!bookingId || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing bookingId or paymentIntentId' },
        { status: 400, headers }
      );
    }

    console.log('📋 Confirming booking:', bookingId, 'with payment:', paymentIntentId);

    // Move booking to confirmed status
    const confirmedBooking = await moveToConfirmedBooking(bookingId, paymentIntentId);

    if (confirmedBooking) {
      console.log('✅ Booking confirmed successfully:', bookingId);
      return NextResponse.json({
        success: true,
        booking: confirmedBooking,
      }, { headers });
    } else {
      console.error('❌ Failed to confirm booking:', bookingId);
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500, headers }
      );
    }

  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500, headers }
    );
  }
}
