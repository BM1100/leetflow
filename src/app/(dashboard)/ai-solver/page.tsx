'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { FormattedMarkdown } from '@/components/shared/formatted-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, Code2, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C#', 'SQL'];

const PRESETS = [
  { label: '1. Two Sum', input: '1. Two Sum' },
  { label: '15. 3Sum', input: '15. 3Sum' },
  { label: '20. Valid Parentheses', input: '20. Valid Parentheses' },
  { label: '206. Reverse Linked List', input: '206. Reverse Linked List' },
  { label: '236. Lowest Common Ancestor', input: '236. Lowest Common Ancestor of a Binary Tree' },
  { label: '300. Longest Increasing Subsequence', input: '300. Longest Increasing Subsequence' },
];

function AISolverContent() {
  const searchParams = useSearchParams();
  const initialProblem = searchParams.get('problem') || '';

  const [problemInput, setProblemInput] = useState(initialProblem);
  const [language, setLanguage] = useState('Python');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialProblem) {
      setProblemInput(initialProblem);
      executeSolve(initialProblem, language);
    }
  }, [initialProblem]);

  async function executeSolve(inputStr: string, langStr: string) {
    if (!inputStr.trim()) {
      toast.error('Please enter a LeetCode problem number, title, or description');
      return;
    }

    setLoading(true);
    setSolution('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemInput: inputStr,
          language: langStr,
        }),
      });

      // Handle error responses — safely try JSON first, then fall back to text
      if (!res.ok) {
        let errorMsg = `Server error (${res.status}). Please try again.`;
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {
          try {
            const text = await res.text();
            if (text.trim()) errorMsg = text.trim();
          } catch { /* use default */ }
        }
        throw new Error(errorMsg);
      }

      if (!res.body) throw new Error('No response stream received. Please try again.');

      // Stream: read chunks as they arrive and display progressively
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      setLoading(false); // Hide spinner — solution starts appearing live

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setSolution(accumulated);
      }

      if (!accumulated.trim()) throw new Error('AI returned an empty solution. Please try again.');
      toast.success('Solution generated!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
      toast.error(msg);
      setLoading(false);
    }
  }


  function handleSolve() {
    executeSolve(problemInput, language);
  }

  function handleCopy() {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    toast.success('Copied solution to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="AI Problem Solver"
        description="Enter any LeetCode problem number, title, or problem statement to get step-by-step intuition, code, and complexity analysis."
      />

      {/* Input Card */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            LeetCode Question Input
          </CardTitle>
          <CardDescription>
            Enter a LeetCode problem title (e.g. "Two Sum"), problem number (e.g. "236"), or paste problem details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground font-medium">Quick Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setProblemInput(p.input);
                    executeSolve(p.input, language);
                  }}
                  className="text-xs px-2.5 py-1 rounded-md bg-muted/60 hover:bg-rose-500/10 hover:text-rose-500 border border-border text-muted-foreground transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Type problem name or paste description here (e.g. '1. Two Sum' or 'Given an array of integers nums and an integer target...')"
            value={problemInput}
            onChange={(e) => setProblemInput(e.target.value)}
            className="min-h-[100px] resize-y bg-background border-border focus-visible:ring-rose-500 text-sm"
          />

          {/* Language Selector & Solve Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="space-y-1.5 w-full sm:w-auto">
              <span className="text-xs text-muted-foreground font-medium">Target Language:</span>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguage(lang);
                      if (solution) executeSolve(problemInput, lang);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
                      language === lang
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-background hover:bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSolve}
              disabled={loading || !problemInput.trim()}
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-2 shadow-xs self-end sm:self-center cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Solving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Solve Problem
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <Card className="border-rose-500/30 bg-rose-500/5 shadow-xs">
          <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            <div>
              <h4 className="font-semibold text-base">Generating Solution...</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Gemini AI is streaming your {language} solution live — it will appear below as it generates.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert Card */}
      {errorMessage && !loading && (
        <Card className="border-rose-500/50 bg-rose-500/10 shadow-xs">
          <CardContent className="p-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold text-sm text-rose-500">Failed to Generate Solution</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{errorMessage}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSolve}
                className="mt-2 text-xs border-rose-500/40 text-rose-500 hover:bg-rose-500/10 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution Output */}
      {solution && !loading && (
        <Card className="border-border shadow-md bg-card">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-rose-500" />
              <CardTitle className="text-lg">Optimal {language} Solution</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-emerald-500 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied' : 'Copy Solution'}
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <FormattedMarkdown content={solution} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AISolverPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-muted-foreground">Loading AI Solver...</div>}>
      <AISolverContent />
    </Suspense>
  );
}
