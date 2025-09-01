import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.log('🔵 API: Fetching bookings for user ID:', session.user.id);

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        serviceType: true,
        bedrooms: true,
        bathrooms: true,
        livingAreas: true,
        price: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        address: true,
        date: true,
        time: true,
        addons: true,
        bedSizes: true,
        paymentStatus: true,
        paymentCompletedAt: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ bookings });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
