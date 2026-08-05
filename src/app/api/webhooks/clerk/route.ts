import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    // If no webhook secret, create user directly from auth
    // This is a fallback for development
    return NextResponse.json({ message: 'Webhook secret not configured' }, { status: 200 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error verifying webhook' }, { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses[0]?.email_address;
    if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 });

    await prisma.user.create({
      data: {
        clerkId: id,
        email,
        name: [first_name, last_name].filter(Boolean).join(' ') || null,
        imageUrl: image_url || null,
      },
    });
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: email || undefined,
        name: [first_name, last_name].filter(Boolean).join(' ') || null,
        imageUrl: image_url || null,
      },
    });
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    if (id) {
      await prisma.user.delete({
        where: { clerkId: id },
      }).catch(() => {}); // Ignore if user doesn't exist
    }
  }

  return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
}
