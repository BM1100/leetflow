import { cn } from '@/lib/utils';
import type { LeetCodeSubmission } from '@/types/leetcode';
import { CheckCircle2, ExternalLink } from 'lucide-react';

const langColors: Record<string, string> = {
  python3: 'text-blue-500',
  python: 'text-blue-500',
  cpp: 'text-purple-500',
  c: 'text-gray-500',
  java: 'text-orange-600',
  javascript: 'text-yellow-500',
  typescript: 'text-blue-400',
  rust: 'text-orange-400',
  go: 'text-cyan-500',
  kotlin: 'text-violet-500',
};

interface RecentSubmissionsProps {
  submissions: LeetCodeSubmission[];
}

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
  if (!submissions || submissions.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">No recent submissions.</p>;
  }

  return (
    <div className="space-y-1">
      {submissions.slice(0, 8).map((s) => (
        <a
          key={s.id}
          href={`https://leetcode.com/problems/${s.titleSlug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="flex-1 text-sm font-medium truncate group-hover:text-orange-500 transition-colors">{s.title}</span>
          <span className={cn('text-xs font-mono flex-shrink-0', langColors[s.lang] || 'text-muted-foreground')}>
            {s.lang}
          </span>
          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </a>
      ))}
    </div>
  );
}
