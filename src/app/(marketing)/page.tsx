'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  Gauge, 
  Bot, 
  Search, 
  ChevronRight, 
  Terminal,
  Code2
} from "lucide-react";

export default function MarketingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-28 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-rose-500/10 blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-rose-500/25 bg-rose-500/10 text-rose-500 text-xs font-mono mb-6 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          AI-Powered Coding &amp; DSA Mastery Platform
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6">
          Master Coding Interviews with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-400">
            LeetFlow AI
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          Generate optimal LeetCode solutions in 9+ languages, audit Big-O time and space complexity, and build progressive 7-day study paths powered by Gemini AI.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {isSignedIn ? (
            <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-11 px-8 text-sm font-medium shadow-md transition-all" asChild>
              <Link href="/dashboard">
                Open Dashboard <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          ) : (
            <>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-11 px-8 text-sm font-medium shadow-md transition-all">
                  Get Started Free <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl h-11 px-8 text-sm font-medium border-border hover:bg-muted">
                  Sign In
                </Button>
              </SignInButton>
            </>
          )}
        </div>

        {/* Hero Code Preview */}
        <div className="mt-12 w-full max-w-4xl rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-xl p-2 relative overflow-hidden text-left mx-auto">
          <div className="rounded-xl bg-zinc-950 flex flex-col overflow-hidden border border-zinc-800 font-mono text-xs sm:text-sm">
            <div className="h-9 border-b border-zinc-800 flex items-center px-4 gap-2 bg-zinc-900/90 text-zinc-400">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="ml-2 flex items-center gap-2 text-zinc-400 text-xs">
                <Terminal className="w-3.5 h-3.5 text-rose-500" />
                <span>leetflow --analyze --problem "236. Lowest Common Ancestor"</span>
              </div>
            </div>
            <div className="p-5 text-zinc-300 space-y-2">
              <div className="text-zinc-500">// Gemini 3.6 AI Complexity Analysis &amp; Optimal Solution:</div>
              <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> <span>Time Complexity: O(N) — Every binary tree node is visited at most once.</span></div>
              <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> <span>Space Complexity: O(H) — Call stack depth corresponds to tree height H.</span></div>
              <div className="text-zinc-500 pt-2">// Optimal Solution snippet:</div>
              <div className="pl-3 border-l-2 border-rose-500 text-rose-300">
                def lowestCommonAncestor(root, p, q):<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;if not root or root == p or root == q: return root<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;left = lowestCommonAncestor(root.left, p, q)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;right = lowestCommonAncestor(root.right, p, q)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;return root if (left and right) else (left or right)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 bg-muted/20 border-y border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">Core Features</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">Everything you need to master Data Structures, Algorithms, and Technical Interviews.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-rose-500/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 border border-rose-500/20 text-rose-500 group-hover:scale-105 transition-transform">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">How LeetFlow Works</h2>
            <p className="text-muted-foreground text-sm md:text-base">Streamlined workflow designed for fast, effective learning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-500 font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold mb-2">Connect or Search</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Enter your LeetCode profile handle or search for any problem by title, ID, or topic.</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-500 font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold mb-2">Solve &amp; Analyze</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Use AI Solver for optimal code generation and Complexity Analyzer for Big-O line-by-line breakdown.</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-500 font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold mb-2">Progressive Practice</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Follow structured 7-day study paths that scale strictly from Easy Warmup to Hard Challenges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <section className="w-full py-16 border-t border-border bg-muted/10">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Ready to Level Up Your Coding Skills?</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Get instant solutions, Big-O analysis, and personalized study plans now.
          </p>
          <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-11 px-8 text-sm font-medium shadow-md" asChild>
            <Link href="/dashboard">
              Go to Dashboard <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "AI Problem Solver",
    description: "Generates optimal solutions in 9+ languages with step-by-step intuition, code comments, and edge cases."
  },
  {
    icon: Gauge,
    title: "Complexity Analyzer",
    description: "Audits your custom code snippets and breaks down Big-O Time & Auxiliary Space complexity line-by-line."
  },
  {
    icon: Bot,
    title: "AI DSA Coach",
    description: "An interactive mentor strictly scoped to Data Structures, Algorithms, and technical interview guidance."
  },
  {
    icon: BookOpen,
    title: "Progressive 7-Day Study Plans",
    description: "Structured learning paths across 40 topics that scale difficulty progressively with zero duplicate questions."
  },
  {
    icon: BarChart3,
    title: "LeetCode Analytics",
    description: "Visualize solved problem counts, difficulty breakdown (Easy, Medium, Hard), and top practiced topics."
  },
  {
    icon: Code2,
    title: "LeetCode Live Sync",
    description: "Connect your LeetCode handle to sync solved question stats, contest ratings, and activity streaks."
  }
];
