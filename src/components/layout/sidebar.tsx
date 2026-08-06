'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { NAV_ITEMS } from '@/lib/constants';
import { LayoutDashboard, BarChart3, Bot, BookOpen, Search, User, Settings, ChevronLeft, ChevronRight, Code2, Sparkles, Gauge } from 'lucide-react';
import React from 'react';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, BarChart3, Bot, BookOpen, Sparkles, Gauge, Search, User, Settings,
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export function Sidebar({ isOpen, onToggle, isMobile }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Header */}
      <div className="h-16 flex items-center px-4 justify-between border-b">
        <div className={cn("flex items-center gap-2", !isOpen && !isMobile && "hidden")}>
          <img src="/icon.png" alt="LeetFlow Logo" className="w-7 h-7 rounded-lg object-cover shadow-xs border border-rose-500/20" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
            LeetFlow
          </span>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto">
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          <TooltipProvider>
            {NAV_ITEMS?.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = pathname === item.href;
              
              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
                    isActive 
                      ? "bg-rose-500/10 text-rose-500 dark:text-rose-400 font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !isOpen && !isMobile && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-rose-500 dark:text-rose-400" : "")} />
                  {(isOpen || isMobile) && <span>{item.title}</span>}
                  
                  {isActive && (isOpen || isMobile) && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
                  )}
                </Link>
              );

              if (!isOpen && !isMobile) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger render={link} />
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                );
              }

              return link;
            })}
          </TooltipProvider>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t text-xs text-muted-foreground flex items-center justify-between">
        {(isOpen || isMobile) && (
          <>
            <span className="font-medium text-foreground/80">LeetFlow</span>
            <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-rose-500 font-semibold">v1.0</span>
          </>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onToggle()}>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <VisuallyHidden.Root><SheetTitle>Sidebar</SheetTitle></VisuallyHidden.Root>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col transition-all duration-300 ease-in-out bg-card",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <SidebarContent />
    </div>
  );
}
