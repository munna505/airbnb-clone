import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🧪 Test webhook received');
  
  try {
    const body = await request.text();
    console.log('📝 Request body:', body);
    console.log('📝 Headers:', Object.fromEntries(request.headers.entries()));
    
    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      body: body 
    });
  } catch (error) {
    console.error('❌ Error in test webhook:', error);
    return NextResponse.json(
      { error: 'Test webhook failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Test webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
}
