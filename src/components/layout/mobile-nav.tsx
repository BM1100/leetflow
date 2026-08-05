'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BarChart3, Bot, Sparkles, User } from 'lucide-react';

const navItems = [
  { title: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
  { title: 'AI Coach', href: '/ai-coach', icon: Bot },
  { title: 'AI Solver', href: '/ai-solver', icon: Sparkles },
  { title: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-t flex items-center justify-around px-2 z-50 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground transition-colors",
              isActive && "text-rose-500 dark:text-rose-400 font-semibold"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
