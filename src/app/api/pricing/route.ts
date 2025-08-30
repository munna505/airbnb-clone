import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');

    if (serviceType && (serviceType === 'home' || serviceType === 'airbnb')) {
      // Get pricing for specific service type
      const pricing = await prisma.pricing.findMany({
        where: {
          serviceType: serviceType.toUpperCase() as 'HOME' | 'AIRBNB'
        },
        orderBy: { key: 'asc' }
      });

      // Convert to the expected format
      const pricingData: Record<string, number> = {};
      pricing.forEach((item: { key: string; price: any }) => {
        pricingData[item.key] = Number(item.price);
      });

      return NextResponse.json({
        success: true,
        pricing: pricingData
      });
    }

    // Return all pricing if no specific service type requested
    const allPricing = await prisma.pricing.findMany({
      orderBy: [{ serviceType: 'asc' }, { key: 'asc' }]
    });

    // Group by service type
    const pricingData: Record<string, Record<string, number>> = {
      home: {},
      airbnb: {}
    };

    allPricing.forEach((item: { serviceType: string; key: string; price: any }) => {
      const serviceTypeKey = item.serviceType.toLowerCase() as 'home' | 'airbnb';
      pricingData[serviceTypeKey][item.key] = Number(item.price);
    });

    return NextResponse.json({
      success: true,
      pricing: pricingData
    });

  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
