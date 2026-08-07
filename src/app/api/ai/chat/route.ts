import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/gemini';
import { getFullLeetCodeStats } from '@/services/leetcode';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages, username } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    let userContext = '';
    if (username) {
      try {
        const stats = await getFullLeetCodeStats(username);
        const topSkills = [
          ...stats.skills.advanced,
          ...stats.skills.intermediate,
        ]
          .slice(0, 8)
          .map((s) => `${s.tagName}: ${s.problemsSolved}`)
          .join(', ');

        userContext = `
LeetCode Username: @${stats.profile.username}
Name: ${stats.profile.realName}
Problems Solved: ${stats.solved.totalSolved} Total (Easy: ${stats.solved.easySolved}, Medium: ${stats.solved.mediumSolved}, Hard: ${stats.solved.hardSolved})
Contest Rating: ${stats.contest.contestRating} (${stats.contest.contestAttend} contests)
Active Days: ${stats.calendar.totalActiveDays}
Top Practiced Topics: ${topSkills || 'None'}
`;
      } catch (err) {
        console.warn('Could not load LeetCode stats for AI context:', err);
      }
    }

    const reply = await generateAIResponse(messages, userContext);
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    const isQuotaError = rawMessage.includes('RESOURCE_EXHAUSTED') || rawMessage.includes('quota') || rawMessage.includes('429');
    const cleanMessage = isQuotaError
      ? 'Gemini API rate limit temporarily reached. Please wait a few seconds and click Send again.'
      : rawMessage;

    return NextResponse.json({ error: cleanMessage }, { status: 500 });
  }
}
