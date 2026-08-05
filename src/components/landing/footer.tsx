import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-rose-500 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
              LeetFlow
            </span>
          </Link>

          {/* Copyright & Links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">Workflow</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <span>© {currentYear} LeetFlow. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
