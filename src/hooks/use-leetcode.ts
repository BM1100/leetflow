import { useQuery } from '@tanstack/react-query';
import type { LeetCodeFullStats } from '@/types/leetcode';

export function useLeetCode(username: string | null | undefined) {
  return useQuery<LeetCodeFullStats, Error>({
    queryKey: ['leetcode', username],
    queryFn: async () => {
      if (!username) throw new Error('No username');
      const res = await fetch(`/api/leetcode/${encodeURIComponent(username)}`);
      const contentType = res.headers.get('content-type') || '';

      if (!contentType.includes('application/json')) {
        throw new Error(`Failed to fetch LeetCode data for @${username} (Server response status ${res.status})`);
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch LeetCode data');
      }
      return data;
    },
    enabled: !!username && username.length > 1,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
