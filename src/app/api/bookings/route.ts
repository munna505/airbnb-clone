import { NextRequest, NextResponse } from 'next/server';
import { getAllConfirmedBookings } from '@/lib/data';

export async function POST(_request: NextRequest) {
  // Bookings are now created only after payment confirmation via webhook
  return NextResponse.json(
    { error: 'Bookings must be created through payment flow' },
    { status: 405 }
  );
}

export async function GET() {
  try {
    // Return only confirmed bookings
    return NextResponse.json({
      success: true,
      bookings: getAllConfirmedBookings()
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
