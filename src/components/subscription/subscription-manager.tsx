'use client'

import { useUser } from '@clerk/nextjs';
import { SUBSCRIPTION_PLAN } from '@prisma/client';
import { useLemonSqueezy } from '@/hooks/use-lemonsqueezy';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { onUserInfo } from '@/actions/user';

interface SubscriptionManagerProps {
  currentPlan?: SUBSCRIPTION_PLAN;
  hasActiveSubscription: boolean;
}

interface CheckoutResponse {
  url: string;
}

export function SubscriptionManager({ currentPlan, hasActiveSubscription }: SubscriptionManagerProps) {
  const { user } = useUser();
  const { createCheckoutSession, redirectToCustomerPortal, isLoading, error } = useLemonSqueezy();

  const { data: userData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: onUserInfo,
  });

  const { mutate: createCheckout } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.data?.id,
        }),
      });
      const data = await res.json() as CheckoutResponse;
      return data;
    },
    onSuccess: (data: CheckoutResponse) => {
      window.location.href = data.url;
    },
  });

  const handleUpgrade = async () => {
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) return;

    await createCheckoutSession({
      userId: user.id,
      userEmail: user.emailAddresses[0].emailAddress,
      plan: SUBSCRIPTION_PLAN.PRO,
    });
  };

  const handleManageSubscription = async () => {
    await redirectToCustomerPortal();
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">
          Current Plan: {currentPlan || SUBSCRIPTION_PLAN.FREE}
        </h3>
        {hasActiveSubscription ? (
          <Button
            onClick={handleManageSubscription}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Loading...' : 'Manage Subscription'}
          </Button>
        ) : (
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? 'Loading...' : 'Upgrade to Pro'}
          </Button>
        )}
      </div>
    </div>
  );
} 