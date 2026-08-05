'use client';

import { useConnectedUsername } from '@/hooks/use-connected-username';
import { useLeetCode } from '@/hooks/use-leetcode';
import { PageHeader } from '@/components/shared/page-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DifficultyProgress } from '@/components/dashboard/difficulty-progress';
import { DifficultyDonut } from '@/components/dashboard/difficulty-donut';
import { RecentSubmissions } from '@/components/dashboard/recent-submissions';
import { ConnectLeetCode } from '@/components/dashboard/connect-leetcode';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckSquare,
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const { username: leetcodeUsername, setConnectedUsername, loading: isAuthLoading } = useConnectedUsername();
  const { data, isLoading, error } = useLeetCode(leetcodeUsername);

  if (isAuthLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!leetcodeUsername) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Connect your LeetCode profile to get started"
        />
        <ConnectLeetCode onConnected={(name) => setConnectedUsername(name)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Stats for @${leetcodeUsername}`}
        action={
          <button
            onClick={() => setConnectedUsername(null)}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Change user
          </button>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
          <p className="text-rose-500 text-sm font-medium">{error.message}</p>
          <button
            onClick={() => setConnectedUsername(null)}
            className="mt-2 text-xs text-muted-foreground underline"
          >
            Try a different username
          </button>
        </div>
      )}

      {data && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatsCard
              title="Total Solved"
              value={data.solved.totalSolved}
              subtitle={`of ${data.solved.totalQuestions} problems`}
              icon={CheckSquare}
              iconColor="text-orange-500"
              iconBg="bg-orange-500/10"
              className="xl:col-span-2"
            />
            <StatsCard
              title="Active Days"
              value={`${data.calendar.totalActiveDays} days`}
              subtitle="Total active days in past year"
              icon={Flame}
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
              className="xl:col-span-2"
            />
            <StatsCard
              title="Contest Rating"
              value={data.contest.contestRating ? Math.round(data.contest.contestRating).toLocaleString() : '—'}
              subtitle={
                data.contest.contestAttend === 0
                  ? 'No contests yet'
                  : data.contest.contestGlobalRanking > 0
                  ? `#${data.contest.contestGlobalRanking.toLocaleString()} contest rank`
                  : `${data.contest.contestAttend} attended · ${Math.max(0, 6 - data.contest.contestAttend)} more for contest rank`
              }
              icon={Trophy}
              iconColor="text-yellow-500"
              iconBg="bg-yellow-500/10"
              className="xl:col-span-2"
            />
            <StatsCard
              title="Acceptance Rate"
              value={data.solved.acceptanceRate > 0 ? `${data.solved.acceptanceRate}%` : '—'}
              subtitle="AC / Total Submissions"
              icon={Target}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              className="xl:col-span-2"
            />
            <StatsCard
              title="Profile Rank"
              value={data.solved.ranking > 0 ? `#${data.solved.ranking.toLocaleString()}` : 'N/A'}
              subtitle="Overall LeetCode rank"
              icon={TrendingUp}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
              className="xl:col-span-2"
            />
            <StatsCard
              title="Reputation"
              value={data.solved.reputation}
              icon={Star}
              iconColor="text-violet-500"
              iconBg="bg-violet-500/10"
              className="xl:col-span-2"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Difficulty Breakdown */}
            <div className="rounded-xl border bg-card p-6 shadow-xs">
              <h3 className="font-semibold text-sm mb-4">Difficulty Breakdown</h3>
              <div className="space-y-4">
                <DifficultyProgress solved={data.solved.easySolved} total={data.solved.totalEasy} difficulty="Easy" />
                <DifficultyProgress solved={data.solved.mediumSolved} total={data.solved.totalMedium} difficulty="Medium" />
                <DifficultyProgress solved={data.solved.hardSolved} total={data.solved.totalHard} difficulty="Hard" />
              </div>
            </div>

            {/* Donut Chart */}
            <div className="rounded-xl border bg-card p-6 shadow-xs">
              <h3 className="font-semibold text-sm mb-2">Solved Distribution</h3>
              <DifficultyDonut
                easy={data.solved.easySolved}
                medium={data.solved.mediumSolved}
                hard={data.solved.hardSolved}
              />
            </div>

            {/* Profile Summary */}
            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                {data.profile.avatarUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.profile.avatarUrl}
                    alt={data.profile.username}
                    className="w-12 h-12 rounded-full border"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{data.profile.realName || data.profile.username}</h3>
                  <p className="text-xs text-muted-foreground">@{data.profile.username}</p>
                </div>
              </div>
              {data.profile.country && (
                <p className="text-sm text-muted-foreground">📍 {data.profile.country}</p>
              )}
              {data.profile.company && (
                <p className="text-sm text-muted-foreground">🏢 {data.profile.company}</p>
              )}
              {data.contest.contestBadge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs border border-orange-500/20">
                  🏅 {data.contest.contestBadge}
                </span>
              )}
              {data.contest.contestTopPercentage > 0 && (
                <p className="text-sm text-muted-foreground">Top {data.contest.contestTopPercentage.toFixed(1)}% globally</p>
              )}
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
