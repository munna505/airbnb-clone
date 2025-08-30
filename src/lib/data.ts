// Shared data store for bookings
// In a real app, this would be a database connection

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

// Mock database arrays - using global variables to persist across requests
declare global {
  var __pendingBookings: BookingData[];
  var __confirmedBookings: BookingData[];
}

// Initialize global variables if they don't exist
if (!global.__pendingBookings) {
  global.__pendingBookings = [];
}
if (!global.__confirmedBookings) {
  global.__confirmedBookings = [];
}

export const pendingBookings: BookingData[] = global.__pendingBookings;
export const confirmedBookings: BookingData[] = global.__confirmedBookings;

// Helper functions
export function addPendingBooking(booking: BookingData) {
  pendingBookings.push(booking);
}

export function moveToConfirmedBooking(bookingId: string, stripeSessionId: string) {
  const index = pendingBookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    const booking = pendingBookings[index];
    const confirmedBooking: BookingData = {
      ...booking,
      paymentStatus: 'completed',
      stripeSessionId,
      paymentCompletedAt: new Date().toISOString(),
    };
    confirmedBookings.push(confirmedBooking);
    pendingBookings.splice(index, 1);
    return confirmedBooking;
  }
  return null;
}

export function removePendingBooking(bookingId: string) {
  const index = pendingBookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    pendingBookings.splice(index, 1);
    return true;
  }
  return false;
}

export function findBooking(bookingId: string): BookingData | undefined {
  return confirmedBookings.find(b => b.id === bookingId) || 
         pendingBookings.find(b => b.id === bookingId);
}

export function getAllConfirmedBookings(): BookingData[] {
  return confirmedBookings;
}
