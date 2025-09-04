import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// Add error handling to prevent crashes
export async function GET(request: Request) {
  try {
    return await handler(request);
  } catch (error) {
    console.error('NextAuth GET error:', error);
    return new Response(
      JSON.stringify({ error: 'Authentication service temporarily unavailable' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    return await handler(request);
  } catch (error) {
    console.error('NextAuth POST error:', error);
    return new Response(
      JSON.stringify({ error: 'Authentication service temporarily unavailable' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
