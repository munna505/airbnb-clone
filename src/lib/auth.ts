import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET environment variable is not set. This will cause authentication to fail.');
  throw new Error('NEXTAUTH_SECRET is required');
}

// Set default NEXTAUTH_URL if not provided
if (!process.env.NEXTAUTH_URL) {
  if (process.env.NODE_ENV === 'production') {
    // In production, try to use Vercel's automatically provided URL
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
      process.env.NEXTAUTH_URL = `https://${vercelUrl}`;
    } else {
      console.error('NEXTAUTH_URL not set in production. Please set it to your actual domain.');
      throw new Error('NEXTAUTH_URL is required in production');
    }
  } else {
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
  }
  console.warn('NEXTAUTH_URL not set, using default:', process.env.NEXTAUTH_URL);
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.email)) {
            console.log('Invalid email format');
            return null;
          }

          // Test database connection first
          await prisma.$connect();
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          });

          if (!user) {
            console.log('User not found');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }


          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          
          // Handle specific database connection errors
          if (error instanceof Error) {
            if (error.message.includes('connect') || error.message.includes('timeout')) {
              console.error('Database connection error during authentication');
              // Don't expose database connection issues to users
              return null;
            }
          }
          
          // Return null instead of throwing to prevent 500 errors
          return null;
        } finally {
          // Ensure database connection is closed
          try {
            await prisma.$disconnect();
          } catch (disconnectError) {
            console.error('Error disconnecting from database:', disconnectError);
          }
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        // Return a minimal token to prevent complete failure
        return {
          ...token,
          id: user?.id || token.id,
          role: user?.role || token.role,
        };
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        // Return a minimal session to prevent complete failure
        return {
          ...session,
          user: {
            ...session.user,
            id: token?.id as string || session.user.id,
            role: token?.role as string || session.user.role,
          },
        };
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect auth errors back to login page
  },
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email);
    },
    async signOut({ session, token }) {
      console.log('User signed out');
    },
  },
};
