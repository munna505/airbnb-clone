import { NextResponse } from 'next/server';
import { getAllConfirmedBookings, getAllPendingBookings } from '@/lib/data';

export async function POST() {
  // Bookings are now created only after payment confirmation via webhook
  return NextResponse.json(
    { error: 'Bookings must be created through payment flow' },
    { status: 405 }
  );
}

export async function GET() {
  try {
    console.log('🔵 API: GET /api/bookings - Fetching all bookings');
    
    // Return both pending and confirmed bookings for debugging
    const confirmedBookings = await getAllConfirmedBookings();
    const pendingBookings = await getAllPendingBookings();
    
    console.log('🔵 API: Confirmed bookings count:', confirmedBookings.length);
    console.log('🔵 API: Pending bookings count:', pendingBookings.length);
    console.log('🔵 API: All booking IDs:', [
      ...confirmedBookings.map(b => b.id),
      ...pendingBookings.map(b => b.id)
    ]);
    
    return NextResponse.json({
      success: true,
      confirmedBookings,
      pendingBookings,
      allBookings: [...confirmedBookings, ...pendingBookings]
    });
  } catch (error) {
    console.error('🔴 API: Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
