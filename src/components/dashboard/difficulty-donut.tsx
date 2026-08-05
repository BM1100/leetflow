'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DifficultyDonutProps {
  easy: number;
  medium: number;
  hard: number;
}

const DIFFICULTY_CONFIG = [
  { key: 'Easy',   color: '#10b981', textColor: '#10b981' },
  { key: 'Medium', color: '#f59e0b', textColor: '#f59e0b' },
  { key: 'Hard',   color: '#f43f5e', textColor: '#f43f5e' },
];

export function DifficultyDonut({ easy, medium, hard }: DifficultyDonutProps) {
  const total = easy + medium + hard;

  // Always keep all three in order — use 0 values so the chart stays stable
  const data = [
    { name: 'Easy',   value: easy },
    { name: 'Medium', value: medium },
    { name: 'Hard',   value: hard },
  ];

  if (total === 0) {
    return <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={data.filter(d => d.value > 0).length > 1 ? 3 : 0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry) => {
              const c = DIFFICULTY_CONFIG.find((x) => x.key === entry.name)?.color || '#888';
              return <Cell key={entry.name} fill={entry.value > 0 ? c : 'transparent'} strokeWidth={0} />;
            })}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(val: any) => [val, 'Problems']}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom legend — always Easy → Medium → Hard */}
      <div className="flex items-center gap-4 text-xs">
        {DIFFICULTY_CONFIG.map(({ key, color }) => {
          const val = key === 'Easy' ? easy : key === 'Medium' ? medium : hard;
          const pct = total > 0 ? Math.round((val / total) * 100) : 0;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-muted-foreground">{key}</span>
              <span className="font-medium tabular-nums">{val}</span>
              <span className="text-muted-foreground">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
