import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getLeetCodeProfile } from '@/services/leetcode';
import { z } from 'zod';

const schema = z.object({ username: z.string().min(2).max(50) });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { username } = parsed.data;

  try {
    // Validate username exists on LeetCode first
    const profile = await getLeetCodeProfile(username);

    // Best-effort DB save — don't fail the whole request if DB is unreachable
    try {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (user) {
        await prisma.profile.upsert({
          where: { userId: user.id },
          create: { userId: user.id, leetcodeUsername: username },
          update: { leetcodeUsername: username, lastSynced: new Date() },
        });
      }
    } catch (dbErr) {
      // DB unavailable — that's OK, username is saved in localStorage on the client
      console.warn('[api/leetcode POST] DB save skipped:', dbErr instanceof Error ? dbErr.message : dbErr);
    }

    return NextResponse.json({ success: true, username: profile.username });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
