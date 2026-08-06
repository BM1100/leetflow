'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useConnectedUsername } from '@/hooks/use-connected-username';
import { useLeetCode } from '@/hooks/use-leetcode';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

export default function AnalyticsPage() {
  const { username } = useConnectedUsername();
  const { data, isLoading } = useLeetCode(username);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;
  const chartTextColor = isDark ? '#ffffff' : '#0f172a';

  const topicData = data
    ? [
        ...data.skills.advanced,
        ...data.skills.intermediate,
        ...data.skills.fundamental,
      ]
        .sort((a, b) => b.problemsSolved - a.problemsSolved)
        .slice(0, 12)
        .map((s) => ({ name: s.tagName, solved: s.problemsSolved }))
    : [];

  const contestData = data?.contest.contestHistory
    .filter((h) => h.attended)
    .slice(-15)
    .map((h) => ({
      name: h.contest.title.replace('Weekly Contest ', 'WC').replace('Biweekly Contest ', 'BC'),
      rating: Math.round(h.rating),
    }))
    .reverse() || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Detailed breakdown of your LeetCode performance" />

      {!username && (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">Connect your LeetCode profile on the Dashboard first.</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      )}

      {data && (
        <>
          {/* Topic Distribution */}
          <div className="rounded-xl border bg-card p-6 shadow-xs">
            <h3 className="font-semibold text-sm mb-4">Topic Distribution (Top 12 Solved Topics)</h3>
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={topicData} layout="vertical" margin={{ left: 24, right: 24, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: chartTextColor, fontWeight: 600 }} stroke="hsl(var(--border))" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fontSize: 12, fill: chartTextColor, fontWeight: 600 }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                      color: chartTextColor,
                    }}
                    formatter={(v: any) => [v, 'Problems Solved']}
                  />
                  <Bar dataKey="solved" fill="#f43f5e" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No topic data available.</p>
            )}
          </div>

          {/* Contest Rating Chart */}
          {contestData.length > 0 && (
            <div className="rounded-xl border bg-card p-6 shadow-xs">
              <h3 className="font-semibold text-sm mb-4">Contest Rating History</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={contestData} margin={{ right: 8 }}>
                  <defs>
                    <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: chartTextColor }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fontSize: 11, fill: chartTextColor }} domain={['auto', 'auto']} stroke="hsl(var(--border))" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                      color: chartTextColor,
                    }}
                    formatter={(v: any) => [v, 'Rating']}
                  />
                  <Area type="monotone" dataKey="rating" stroke="#f43f5e" strokeWidth={2} fill="url(#ratingGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Skills Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([
              { label: 'Advanced', items: data.skills.advanced, color: 'text-rose-500' },
              { label: 'Intermediate', items: data.skills.intermediate, color: 'text-amber-500' },
              { label: 'Fundamental', items: data.skills.fundamental, color: 'text-emerald-500' },
            ]).map((group) => (
              <div key={group.label} className="rounded-xl border bg-card p-5 shadow-xs">
                <h4 className={`text-sm font-semibold mb-3 ${group.color}`}>{group.label}</h4>
                <ul className="space-y-1.5">
                  {group.items.slice(0, 6).map((s) => (
                    <li key={s.tagSlug} className="flex justify-between text-xs">
                      <span className="text-foreground">{s.tagName}</span>
                      <span className="text-muted-foreground tabular-nums">{s.problemsSolved}</span>
                    </li>
                  ))}
                  {group.items.length === 0 && <li className="text-xs text-muted-foreground">No data</li>}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
