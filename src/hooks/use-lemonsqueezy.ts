import { useState } from 'react';
import { SUBSCRIPTION_PLAN } from '@prisma/client';

interface CreateCheckoutOptions {
  userId: string;
  userEmail: string;
  plan: SUBSCRIPTION_PLAN;
}

export function useLemonSqueezy() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async ({ userId, userEmail, plan }: CreateCheckoutOptions) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          plan,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToCustomerPortal = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/payment/customer-portal');
      if (!response.ok) {
        throw new Error('Failed to get customer portal URL');
      }

      const { url } = await response.json();
      if (!url) {
        throw new Error('No customer portal URL found');
      }

      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createCheckoutSession,
    redirectToCustomerPortal,
  };
} 