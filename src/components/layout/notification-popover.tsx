'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, Target, BookOpen, Flame, Lightbulb, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'goal' | 'plan' | 'streak' | 'tip';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Daily Goal Reminder',
    description: 'Solve 3 problems today to keep your streak active!',
    time: '10m ago',
    unread: true,
    type: 'goal',
  },
  {
    id: '2',
    title: 'AI Study Plan Ready',
    description: 'Day 1 (Easy Warmup) & progressive path is ready for your practice.',
    time: '1h ago',
    unread: true,
    type: 'plan',
  },
  {
    id: '3',
    title: '🔥 Streak Active!',
    description: 'You are on a streak! Keep solving problems daily.',
    time: '1d ago',
    unread: false,
    type: 'streak',
  },
  {
    id: '4',
    title: '💡 AI Coach Tip',
    description: 'Master Two-Pointer patterns before attempting Sliding Window problems.',
    time: '2d ago',
    unread: false,
    type: 'tip',
  },
];

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('Marked all notifications as read');
  }

  function clearAll() {
    setNotifications([]);
    toast.info('Cleared all notifications');
  }

  function toggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  }

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'goal':
        return <Target className="w-4 h-4 text-orange-500" />;
      case 'plan':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-96 p-0 border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-orange-500/10 text-orange-500 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-orange-500/20">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
              >
                <Check className="w-3.5 h-3.5 mr-1" /> Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 text-xs text-muted-foreground hover:text-destructive px-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No new notifications!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={`p-3 flex items-start gap-3 transition-colors cursor-pointer hover:bg-muted/50 ${
                  item.unread ? 'bg-orange-500/5' : ''
                }`}
              >
                <div className="p-2 rounded-lg bg-muted border border-border/50 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className={`text-xs font-medium truncate ${item.unread ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {item.unread && <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
