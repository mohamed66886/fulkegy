'use client';

import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/components/shared/QueryProvider';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [user, loading, isLoginPage, router]);

  // Login page: render without auth check or sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1F4B8F] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1F4B8F] text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated: show nothing (redirect happening via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1F4B8F] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1F4B8F] text-sm font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Authenticated: render sidebar + main content
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <AdminSidebar />
      <main className="lg:ml-[280px] min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
