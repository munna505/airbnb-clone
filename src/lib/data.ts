import { prisma } from './prisma';

// Shared data store for bookings
// Now using Prisma for database operations

export interface BookingData {
  id: string;
  serviceType: 'home' | 'airbnb';
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
  addons?: {
    linen: boolean;
    towel: boolean;
  };
  bedSizes?: Record<number, string>;
  paymentStatus: 'pending' | 'completed';
  createdAt: string;
  stripeSessionId?: string;
  paymentCompletedAt?: string;
}

// Helper functions using Prisma
export async function addPendingBooking(booking: BookingData) {
  try {
    await prisma.booking.create({
      data: {
        id: booking.id,
        serviceType: booking.serviceType.toUpperCase() as 'HOME' | 'AIRBNB',
        bedrooms: booking.bedrooms,
        bathrooms: booking.bathrooms,
        livingAreas: booking.livingAreas,
        price: booking.price,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        address: booking.address,
        date: booking.date,
        time: booking.time,
        addons: booking.addons,
        bedSizes: booking.bedSizes,
        paymentStatus: 'PENDING',
        stripeSessionId: booking.stripeSessionId,
      }
    });
  } catch (error) {
    console.error('Error adding pending booking:', error);
    throw error;
  }
}

export async function moveToConfirmedBooking(bookingId: string, stripeSessionId: string) {
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'COMPLETED',
        stripeSessionId,
        paymentCompletedAt: new Date(),
      }
    });

    return convertToBookingData(updatedBooking);
  } catch (error) {
    console.error('Error moving booking to confirmed:', error);
    return null;
  }
}

export async function removePendingBooking(bookingId: string) {
  try {
    await prisma.booking.delete({
      where: { id: bookingId }
    });
    return true;
  } catch (error) {
    console.error('Error removing pending booking:', error);
    return false;
  }
}

export async function findBooking(bookingId: string): Promise<BookingData | undefined> {
  console.log('🔵 findBooking: Looking for booking with ID:', bookingId);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    
    console.log('🔵 findBooking: Prisma result:', booking);
    
    if (booking) {
      const convertedBooking = convertToBookingData(booking);
      console.log('🔵 findBooking: Converted booking data:', convertedBooking);
      return convertedBooking;
    } else {
      console.log('🔴 findBooking: No booking found for ID:', bookingId);
      return undefined;
    }
  } catch (error) {
    console.error('🔴 findBooking: Error finding booking:', error);
    return undefined;
  }
}

export async function getAllConfirmedBookings(): Promise<BookingData[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: { paymentStatus: 'COMPLETED' },
      orderBy: { createdAt: 'desc' }
    });
    
    return bookings.map(convertToBookingData);
  } catch (error) {
    console.error('Error getting confirmed bookings:', error);
    return [];
  }
}

export async function getAllPendingBookings(): Promise<BookingData[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: { paymentStatus: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
    
    return bookings.map(convertToBookingData);
  } catch (error) {
    console.error('Error getting pending bookings:', error);
    return [];
  }
}

// Helper function to convert Prisma model to BookingData interface
function convertToBookingData(booking: {
  id: string;
  serviceType: string;
  bedrooms: number;
  bathrooms: number;
  livingAreas: number;
  price: number | string | { toString(): string };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  date: string;
  time: string;
  addons: { linen: boolean; towel: boolean } | null | unknown;
  bedSizes: Record<string, string> | null | unknown;
  paymentStatus: string;
  stripeSessionId: string | null;
  paymentCompletedAt: Date | null;
  createdAt: Date;
}): BookingData {
  return {
    id: booking.id,
    serviceType: booking.serviceType.toLowerCase() as 'home' | 'airbnb',
    bedrooms: booking.bedrooms,
    bathrooms: booking.bathrooms,
    livingAreas: booking.livingAreas,
    price: Number(booking.price),
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    address: booking.address,
    date: booking.date,
    time: booking.time,
          addons: booking.addons as { linen: boolean; towel: boolean } | undefined,
      bedSizes: booking.bedSizes as Record<number, string> | undefined,
      paymentStatus: booking.paymentStatus.toLowerCase() as 'pending' | 'completed',
      stripeSessionId: booking.stripeSessionId || undefined,
    paymentCompletedAt: booking.paymentCompletedAt?.toISOString(),
    createdAt: booking.createdAt.toISOString(),
  };
}
