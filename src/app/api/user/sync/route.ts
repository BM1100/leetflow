import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      include: {
        profile: true,
        studyPlans: { orderBy: { updatedAt: 'desc' }, take: 1 },
        aiConversations: { orderBy: { updatedAt: 'desc' }, take: 1 },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.fullName,
          imageUrl: clerkUser.imageUrl,
        },
        include: {
          profile: true,
          studyPlans: { orderBy: { updatedAt: 'desc' }, take: 1 },
          aiConversations: { orderBy: { updatedAt: 'desc' }, take: 1 },
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        leetcodeUsername: user.leetcodeUsername || user.profile?.leetcodeUsername || null,
        latestStudyPlan: user.studyPlans[0] || null,
        latestConversation: user.aiConversations[0] || null,
      },
    });
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    console.warn('Sync GET fallback (database unreachable or not configured yet):', rawMessage);
    return NextResponse.json({ authenticated: true, user: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leetcodeUsername, studyPlanData, chatMessages } = await req.json();

    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.fullName,
          imageUrl: clerkUser.imageUrl,
          leetcodeUsername: leetcodeUsername || null,
        },
      });
    } else if (leetcodeUsername !== undefined) {
      user = await prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: { leetcodeUsername: leetcodeUsername || null },
      });
    }

    // Save Profile record
    if (user && leetcodeUsername) {
      await prisma.profile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, leetcodeUsername },
        update: { leetcodeUsername },
      }).catch(() => {});
    }

    // Save Study Plan if provided
    if (user && studyPlanData) {
      await prisma.studyPlan.create({
        data: {
          userId: user.id,
          title: '7-Day Pattern Study Roadmap',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          topics: studyPlanData.topics || [],
          planData: studyPlanData,
        },
      }).catch(() => {});
    }

    // Save AI Conversation if provided
    if (user && Array.isArray(chatMessages) && chatMessages.length > 0) {
      await prisma.aIConversation.create({
        data: {
          userId: user.id,
          title: 'AI Coach Conversation',
          messages: chatMessages,
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    console.warn('Sync POST fallback:', rawMessage);
    return NextResponse.json({ success: true });
  }
}
