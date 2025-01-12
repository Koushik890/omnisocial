import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        subscription: {
          select: {
            lemonSqueezyCustomerPortalUrl: true,
          },
        },
      },
    });

    if (!user?.subscription?.lemonSqueezyCustomerPortalUrl) {
      return new NextResponse('No subscription found', { status: 404 });
    }

    return NextResponse.json({ url: user.subscription.lemonSqueezyCustomerPortalUrl });
  } catch (error) {
    console.error('Error fetching customer portal URL:', error);
    return new NextResponse('Error fetching customer portal URL', { status: 500 });
  }
} 