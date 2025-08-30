import { NextRequest, NextResponse } from 'next/server';
import { findBooking } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🔵 API: GET /api/bookings/[id] - Request received');
  
  try {
    const { id } = await params;
    console.log('🔵 API: Booking ID from params:', id);
    
    // Check both pending and confirmed bookings
    console.log('🔵 API: Calling findBooking with ID:', id);
    const booking = await findBooking(id);
    console.log('🔵 API: findBooking result:', booking);
    
    if (!booking) {
      console.log('🔴 API: Booking not found for ID:', id);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('🔵 API: Returning booking data:', booking);
    return NextResponse.json(booking);

  } catch (error) {
    console.error('🔴 API: Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
