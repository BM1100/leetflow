import { SignIn } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-rose-500/5 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
              LeetFlow
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to your LeetFlow account to continue your DSA practice
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-rose-500 hover:bg-rose-600 text-white shadow-xs',
              card: 'bg-card border border-border shadow-xl rounded-2xl',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton:
                'border-border text-foreground hover:bg-accent',
              formFieldInput:
                'bg-background border-border text-foreground',
              footerActionLink: 'text-rose-500 hover:text-rose-600 font-medium',
            },
          }}
        />
      </div>
    </div>
  );
}
