export const APP_NAME = 'LeetFlow';
export const APP_DESCRIPTION = 'AI-powered coding coach and DSA practice platform.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const DIFFICULTY_COLORS = {
  Easy: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', hex: '#00b8a3' },
  Medium: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', hex: '#ffc01e' },
  Hard: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', hex: '#ff375f' },
} as const;

export const NAV_ITEMS = [
  { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { title: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { title: 'AI Coach', href: '/ai-coach', icon: 'Bot' },
  { title: 'Study Plan', href: '/study-plan', icon: 'BookOpen' },
  { title: 'AI Solver', href: '/ai-solver', icon: 'Sparkles' },
  { title: 'Complexity Analyzer', href: '/complexity-analyzer', icon: 'Gauge' },
  { title: 'Profile', href: '/profile', icon: 'User' },
  { title: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

/**
 * Official LeetCode Topic Tags with 30+ Questions Available
 */
export const TOPICS = [
  'Array',
  'String',
  'Hash Table',
  'Math',
  'Dynamic Programming',
  'Sorting',
  'Greedy',
  'Depth-First Search',
  'Binary Search',
  'Database',
  'Bit Manipulation',
  'Matrix',
  'Tree',
  'Prefix Sum',
  'Breadth-First Search',
  'Two Pointers',
  'Heap (Priority Queue)',
  'Simulation',
  'Counting',
  'Graph Theory',
  'Binary Tree',
  'Stack',
  'Sliding Window',
  'Enumeration',
  'Design',
  'Backtracking',
  'Number Theory',
  'Union-Find',
  'Linked List',
  'Segment Tree',
  'Ordered Set',
  'Monotonic Stack',
  'Divide and Conquer',
  'Combinatorics',
  'Trie',
  'Queue',
  'Bitmask',
  'Recursion',
  'Geometry',
  'Binary Indexed Tree',
  'Hash Function',
  'Memoization',
  'Binary Search Tree',
  'Shortest Path',
  'Topological Sort',
  'String Matching',
  'Rolling Hash',
  'Game Theory',
] as const;
