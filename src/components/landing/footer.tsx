import Link from "next/link";
import { Sparkles, Mail, Globe, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-1 items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-rose-500 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
                LeetFlow
              </span>
            </Link>
            <p className="text-xs text-muted-foreground">
              Designed & Built by <span className="font-semibold text-foreground">Bhagya Majithiya</span>
            </p>
          </div>

          {/* Developer Social Links */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="mailto:thakkarbhagya65@gmail.com"
              className="flex items-center gap-1 text-muted-foreground hover:text-rose-500 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-rose-500" /> Email
            </a>
            <a
              href="https://github.com/BM1100"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-rose-500 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-rose-500" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/bhagya-majithiya-05654336b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-rose-500 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-500" /> LinkedIn
            </a>
          </div>

          {/* Copyright & Links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">Workflow</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <span>© {currentYear} LeetFlow.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
