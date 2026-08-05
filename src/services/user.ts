import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { profile: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
      },
      include: { profile: true },
    });
  }

  return user;
}

export async function updateUserProfile(clerkId: string, data: {
  leetcodeUsername?: string;
  name?: string;
}) {
  return prisma.user.update({
    where: { clerkId },
    data,
  });
}

export async function deleteUser(clerkId: string) {
  return prisma.user.delete({
    where: { clerkId },
  });
}

export async function ensureProfile(userId: string) {
  const existing = await prisma.profile.findUnique({
    where: { userId },
  });

  if (existing) return existing;

  return prisma.profile.create({
    data: { userId },
  });
}
