'use client';

import { useConnectedUsername } from '@/hooks/use-connected-username';
import { useLeetCode } from '@/hooks/use-leetcode';
import { PageHeader } from '@/components/shared/page-header';
import { RecentSubmissions } from '@/components/dashboard/recent-submissions';
import { DifficultyProgress } from '@/components/dashboard/difficulty-progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Code2, Briefcase, Globe, Trophy, Star } from 'lucide-react';

export default function ProfilePage() {
  const { username } = useConnectedUsername();
  const { data, isLoading } = useLeetCode(username);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your public LeetCode profile" />

      {!username && (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">Connect your LeetCode profile on the Dashboard first.</p>
        </div>
      )}

      {isLoading && <Skeleton className="h-48 rounded-xl" />}

      {data && (
        <>
          {/* Profile Header */}
          <div className="rounded-xl border bg-card p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {data.profile.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.profile.avatarUrl}
                  alt={data.profile.username}
                  className="w-20 h-20 rounded-full border-2 border-border"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold">{data.profile.realName || data.profile.username}</h2>
                <p className="text-muted-foreground text-sm">@{data.profile.username}</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  {data.profile.country && <span className="text-sm text-muted-foreground">📍 {data.profile.country}</span>}
                  {data.profile.company && <span className="text-sm text-muted-foreground">🏢 {data.profile.company}</span>}
                  {data.profile.school && <span className="text-sm text-muted-foreground">🎓 {data.profile.school}</span>}
                </div>
                <div className="flex gap-3 mt-3">
                  {data.profile.githubUrl && (
                    <a href={data.profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Code2 className="w-4 h-4" />
                    </a>
                  )}
                  {data.profile.linkedinUrl && (
                    <a href={data.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </a>
                  )}
                  {data.profile.websites?.map((w) => (
                    <a key={w} href={w} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Globe className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                {data.contest.contestBadge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs border border-orange-500/20">
                    <Trophy className="w-3 h-3" /> {data.contest.contestBadge}
                  </span>
                )}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3" /> {data.solved.reputation} reputation
                </span>
                <span className="text-xs text-muted-foreground">Rank #{data.solved.ranking.toLocaleString()}</span>
              </div>
            </div>
            {data.profile.aboutMe && (
              <p className="mt-4 text-sm text-muted-foreground border-t pt-4">{data.profile.aboutMe}</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6 shadow-xs">
              <h3 className="font-semibold text-sm mb-4">Problem Solving</h3>
              <div className="space-y-4">
                <DifficultyProgress solved={data.solved.easySolved} total={data.solved.totalEasy} difficulty="Easy" />
                <DifficultyProgress solved={data.solved.mediumSolved} total={data.solved.totalMedium} difficulty="Medium" />
                <DifficultyProgress solved={data.solved.hardSolved} total={data.solved.totalHard} difficulty="Hard" />
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-3">
              <h3 className="font-semibold text-sm mb-4">Contest Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Rating', value: data.contest.contestRating ? Math.round(data.contest.contestRating) : 'N/A' },
                  { label: 'Attended', value: data.contest.contestAttend },
                  { label: 'Global Rank', value: data.contest.contestGlobalRanking > 0 ? `#${data.contest.contestGlobalRanking.toLocaleString()}` : 'N/A' },
                  { label: 'Top %', value: data.contest.contestTopPercentage > 0 ? `${data.contest.contestTopPercentage.toFixed(1)}%` : 'N/A' },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold tabular-nums mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="rounded-xl border bg-card p-6 shadow-xs">
            <h3 className="font-semibold text-sm mb-4">Recent Accepted Submissions</h3>
            <RecentSubmissions submissions={data.submissions} />
          </div>
        </>
      )}
    </div>
  );
}
