'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectLeetCodeProps {
  onConnected: (username: string) => void;
}

export function ConnectLeetCode({ onConnected }: ConnectLeetCodeProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      // Validate by fetching stats directly — check content-type to avoid JSON parse errors
      const res = await fetch(`/api/leetcode/${encodeURIComponent(trimmed)}`);
      const contentType = res.headers.get('content-type') || '';

      if (!contentType.includes('application/json')) {
        const rawText = await res.text().catch(() => '');
        throw new Error(
          res.status === 404
            ? `LeetCode user "@${trimmed}" not found`
            : `Server returned non-JSON response (${res.status}). Please try again.`
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Username not found on LeetCode');
      }

      // Verify we got a real profile back
      if (!data.profile?.username) {
        throw new Error('Could not find that LeetCode username');
      }

      toast.success(`Connected as @${data.profile.username}`);
      onConnected(trimmed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-8 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
        <Code2 className="w-7 h-7 text-orange-500" />
      </div>
      <h3 className="text-lg font-bold mb-2">Connect your LeetCode profile</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your public LeetCode username to sync your stats and get AI-powered insights.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="e.g. NeetCode"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(''); }}
          className={error ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
          disabled={loading}
          autoFocus
        />
        <Button
          type="submit"
          disabled={loading || !username.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0"
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <CheckCircle2 className="w-4 h-4" />
          }
          <span className="ml-1.5">Connect</span>
        </Button>
      </form>
      {error && (
        <p className="mt-3 text-xs text-rose-500 flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Your LeetCode profile must be public for stats to load.
      </p>
    </div>
  );
}
