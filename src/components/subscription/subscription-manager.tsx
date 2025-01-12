import { useUser } from '@clerk/nextjs';
import { SUBSCRIPTION_PLAN } from '@prisma/client';
import { useLemonSqueezy } from '@/hooks/use-lemonsqueezy';
import { Button } from '@/components/ui/button';

interface SubscriptionManagerProps {
  currentPlan?: SUBSCRIPTION_PLAN;
  hasActiveSubscription: boolean;
}

export function SubscriptionManager({ currentPlan, hasActiveSubscription }: SubscriptionManagerProps) {
  const { user } = useUser();
  const { createCheckoutSession, redirectToCustomerPortal, isLoading, error } = useLemonSqueezy();

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