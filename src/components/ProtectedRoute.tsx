'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requireAdmin = false,
  fallback = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(redirectTo);
      return;
    }

    if (requireAdmin && user.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
  }, [user, loading, router, redirectTo, requireAdmin]);

  // Show loading state
  if (loading) {
    return <>{fallback}</>;
  }

  // Don't render anything if not authenticated (redirect is happening)
  if (!user) {
    return null;
  }

  // Check admin requirement
  if (requireAdmin && user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}

// Convenience wrappers for common use cases
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    redirectTo?: string;
    requireAdmin?: boolean;
    fallback?: React.ReactNode;
  }
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export function withAdminAuth<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    fallback?: React.ReactNode;
  }
) {
  return withAuth(Component, {
    requireAdmin: true,
    redirectTo: '/admin/login',
    ...options
  });
}
