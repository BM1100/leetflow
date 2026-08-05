import { NextRequest, NextResponse } from 'next/server';
import { getFullLeetCodeStats } from '@/services/leetcode';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  if (!username || username.length < 2) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }
  try {
    const data = await getFullLeetCodeStats(username);
    console.log(`[leetcode] ${username}: solved=${data.solved.totalSolved} easy=${data.solved.easySolved}`);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch data';
    console.error(`[leetcode] Error for ${username}:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
