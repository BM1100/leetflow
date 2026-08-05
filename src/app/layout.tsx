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
    default: "LeetCode AI Coach",
    template: "%s | LeetCode AI Coach",
  },
  description:
    "AI-powered coding coach that analyzes your LeetCode performance, identifies weak spots, and creates personalized study plans.",
  keywords: [
    "leetcode",
    "coding",
    "interview prep",
    "ai coach",
    "dsa",
    "algorithms",
    "data structures",
  ],
  authors: [{ name: "LeetCode AI Coach" }],
  openGraph: {
    title: "LeetCode AI Coach",
    description:
      "AI-powered coding coach for LeetCode performance analysis and interview preparation.",
    type: "website",
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
