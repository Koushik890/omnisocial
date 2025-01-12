import { NextResponse } from 'next/server';
import { createLemonSqueezyCheckoutSession } from '@/lib/lemonsqueezy/checkout-utils';
import { PrismaClient, SUBSCRIPTION_PLAN } from '@prisma/client';

const prisma = new PrismaClient();
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID!;
const VARIANT_IDS: Record<SUBSCRIPTION_PLAN, string> = {
  [SUBSCRIPTION_PLAN.PRO]: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
  [SUBSCRIPTION_PLAN.FREE]: '', // Free plan doesn't need a variant ID
};

interface CheckoutRequest {
  userId: string;
  userEmail: string;
  plan: SUBSCRIPTION_PLAN;
}

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId, userEmail, plan } = (await req.json()) as CheckoutRequest;

    if (!clerkUserId || !userEmail || !plan) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const variantId = VARIANT_IDS[plan];
    if (!variantId) {
      return new NextResponse('Invalid plan', { status: 400 });
    }

    const { url } = await createLemonSqueezyCheckoutSession({
      storeId: STORE_ID,
      variantId,
      userEmail,
      userId: clerkUserId,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse('Error creating checkout session', { status: 500 });
  }
} 