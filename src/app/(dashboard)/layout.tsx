'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { DashboardNavbar } from '@/components/layout/navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onToggle={() => setMobileSidebarOpen(false)}
        isMobile
      />

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 overflow-hidden flex flex-col transition-all duration-300 ease-in-out pb-16 md:pb-0',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
        )}
      >
        <DashboardNavbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
