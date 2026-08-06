import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LeetFlow — AI Coding Coach & DSA Practice Platform",
    template: "%s | LeetFlow",
  },
  description:
    "AI-powered coding coach that analyzes your LeetCode performance, identifies weak spots, and creates personalized study plans.",
  keywords: [
    "leetflow",
    "leetcode",
    "coding",
    "interview prep",
    "ai coach",
    "dsa",
    "algorithms",
    "data structures",
  ],
  authors: [{ name: "LeetFlow" }],
  openGraph: {
    title: "LeetFlow — AI Coding Coach",
    description:
      "AI-powered coding coach for LeetCode performance analysis and interview preparation.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "#7c3aed",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <TooltipProvider>
                {children}
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    classNames: {
                      toast:
                        "bg-card border-border text-foreground",
                      description: "text-muted-foreground",
                    },
                  }}
                />
              </TooltipProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
