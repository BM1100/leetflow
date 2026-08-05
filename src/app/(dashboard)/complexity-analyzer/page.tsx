'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { FormattedMarkdown } from '@/components/shared/formatted-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gauge, Loader2, Copy, Check, Code2, Zap } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C#'];

const CODE_SAMPLES = [
  {
    name: 'Nested Loops (Two Sum)',
    lang: 'Python',
    code: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
  },
  {
    name: 'Hash Map (Two Sum O(N))',
    lang: 'Python',
    code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
  },
  {
    name: 'Binary Search O(log N)',
    lang: 'C++',
    code: `int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  {
    name: 'Merge K Lists (Heap O(N log K))',
    lang: 'Java',
    code: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode node : lists) {
        if (node != null) pq.add(node);
    }
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!pq.isEmpty()) {
        ListNode curr = pq.poll();
        tail.next = curr;
        tail = tail.next;
        if (curr.next != null) pq.add(curr.next);
    }
    return dummy.next;
}`,
  },
];

export default function ComplexityAnalyzerPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleAnalyze() {
    if (!code.trim()) {
      toast.error('Please paste code to analyze');
      return;
    }

    setLoading(true);
    setAnalysis('');

    try {
      const res = await fetch('/api/ai/analyze-complexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response (${res.status}). Please try again.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze code complexity');
      }

      setAnalysis(data.analysis);
      toast.success('Complexity analysis complete!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    toast.success('Copied analysis to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Time & Space Complexity Analyzer"
        description="Paste any code snippet to analyze its Big-O Time and Space complexity with line-by-line breakdown and optimization tips."
      />

      {/* Input Card */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gauge className="w-5 h-5 text-rose-500" />
            Code Input & Settings
          </CardTitle>
          <CardDescription>
            Paste your code below or select a sample code snippet to analyze.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sample Snippets */}
          <div>
            <span className="text-xs font-medium text-muted-foreground mr-2">Sample Snippets:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {CODE_SAMPLES.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => {
                    setCode(sample.code);
                    setLanguage(sample.lang);
                  }}
                  className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-md transition-colors border border-border/50"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Code Snippet
            </label>
            <Textarea
              placeholder="Paste your function or algorithm code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[220px] font-mono text-xs bg-zinc-950 text-zinc-100 border-zinc-800 focus-visible:ring-rose-500 resize-y p-3"
            />
          </div>

          {/* Language Selector & Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Language
              </label>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
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
              onClick={handleAnalyze}
              disabled={loading || !code.trim()}
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-2 shadow-xs self-end sm:self-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze Complexity
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Output */}
      {analysis && (
        <Card className="border-border shadow-md bg-card">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-rose-500" />
              <CardTitle className="text-lg">Big-O Complexity Report</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-emerald-500 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied' : 'Copy Report'}
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <FormattedMarkdown content={analysis} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
