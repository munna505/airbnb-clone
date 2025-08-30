import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔵 Test API route called');
  console.log('📅 Current time:', new Date().toISOString());
  
  return NextResponse.json({
    message: 'Test API working!',
    timestamp: new Date().toISOString(),
    serverLogs: 'Check your terminal/console where you ran npm run dev'
  });
}
