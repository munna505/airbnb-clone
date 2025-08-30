import { prisma } from './prisma';
import { ServiceType, PaymentStatus } from '@prisma/client';

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
        serviceType: booking.serviceType.toUpperCase() as ServiceType,
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
        paymentStatus: PaymentStatus.PENDING,
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
        paymentStatus: PaymentStatus.COMPLETED,
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
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    
    return booking ? convertToBookingData(booking) : undefined;
  } catch (error) {
    console.error('Error finding booking:', error);
    return undefined;
  }
}

export async function getAllConfirmedBookings(): Promise<BookingData[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: { paymentStatus: PaymentStatus.COMPLETED },
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
      where: { paymentStatus: PaymentStatus.PENDING },
      orderBy: { createdAt: 'desc' }
    });
    
    return bookings.map(convertToBookingData);
  } catch (error) {
    console.error('Error getting pending bookings:', error);
    return [];
  }
}

// Helper function to convert Prisma model to BookingData interface
function convertToBookingData(booking: any): BookingData {
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
    addons: booking.addons,
    bedSizes: booking.bedSizes,
    paymentStatus: booking.paymentStatus.toLowerCase() as 'pending' | 'completed',
    stripeSessionId: booking.stripeSessionId,
    paymentCompletedAt: booking.paymentCompletedAt?.toISOString(),
    createdAt: booking.createdAt.toISOString(),
  };
}
