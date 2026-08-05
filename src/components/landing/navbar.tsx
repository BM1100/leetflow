"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sparkles, Menu, Moon, Sun } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isSignedIn } = useUser();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Workflow", href: "#how-it-works" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-xs"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500 text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
            LeetFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="hidden md:flex items-center gap-2">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white shadow-xs">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white shadow-xs" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton />
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full mt-6">
                  <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-base font-medium hover:text-rose-500 transition-colors py-2"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto pt-6 border-t border-border flex flex-col gap-2">
                    {!isSignedIn ? (
                      <>
                        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                          <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                            Sign In
                          </Button>
                        </SignInButton>
                        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                          <Button className="w-full bg-rose-500 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                            Get Started
                          </Button>
                        </SignUpButton>
                      </>
                    ) : (
                      <>
                        <Button className="w-full bg-rose-500 text-white mb-2" asChild>
                          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                            Dashboard
                          </Link>
                        </Button>
                        <div className="flex items-center justify-between px-2">
                          <span className="text-sm text-muted-foreground">Account</span>
                          <UserButton />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
