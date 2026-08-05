'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-orange-500/5" />
      <div className="relative z-10 text-center px-4">
        <div className="rounded-full bg-destructive/10 p-6 mb-6 mx-auto w-fit">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-2 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        {error.message && (
          <p className="text-sm text-muted-foreground font-mono mb-8 max-w-md mx-auto truncate">
            {error.message}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700">
            <Link href="/dashboard" className="gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
