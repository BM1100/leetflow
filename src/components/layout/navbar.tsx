'use client';

import { UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface DashboardNavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function DashboardNavbar({ onMenuClick, sidebarOpen }: DashboardNavbarProps) {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0 || segments[0] === 'dashboard') return 'Dashboard';
    const raw = segments[segments.length - 1];
    return raw.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className="sticky top-0 z-10 h-16 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-lg hidden sm:block">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-2">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
