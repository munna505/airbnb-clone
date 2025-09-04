import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// Let NextAuth handle errors naturally - it has built-in error handling
export { handler as GET, handler as POST };
