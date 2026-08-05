import { formatDistanceToNow, format } from 'date-fns';

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: Date | string, pattern = 'MMM dd, yyyy'): string {
  return format(new Date(date), pattern);
}

export function formatRuntime(runtime: string): string {
  return runtime.replace(/\s+/g, '');
}
