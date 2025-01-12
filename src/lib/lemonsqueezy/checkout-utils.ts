import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// Initialize LemonSqueezy with API key
lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

interface LemonSqueezyCheckoutSessionParams {
  storeId: string;
  variantId: string;
  userEmail: string;
  userId: string;
}

export async function createLemonSqueezyCheckoutSession({ storeId, variantId, userEmail, userId }: LemonSqueezyCheckoutSessionParams) {
  const { data: session, error } = await createCheckout(storeId, variantId, {
    checkoutData: {
      email: userEmail,
      custom: {
        user_id: userId
      }
    }
  });

  if (error) {
    throw error;
  }

  if (!session) {
    throw new Error('Checkout session not created');
  }

  return {
    url: session.data.attributes.url,
    id: session.data.id,
  };
} 