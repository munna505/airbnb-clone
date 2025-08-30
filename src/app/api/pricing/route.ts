import { NextRequest, NextResponse } from 'next/server';

// Mock pricing data - in a real app, this would come from a database
const pricingData = {
  home: {
    baseRate: 40,
    bedroom: 25,
    bathroom: 20,
    livingArea: 15,
  },
  airbnb: {
    baseRate: 70,
    bedroom: 25,
    bathroom: 20,
    livingArea: 15,
    linenService: 15,
    towelService: 10,
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');

    if (serviceType && pricingData[serviceType as keyof typeof pricingData]) {
      return NextResponse.json({
        success: true,
        pricing: pricingData[serviceType as keyof typeof pricingData]
      });
    }

    // Return all pricing if no specific service type requested
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
