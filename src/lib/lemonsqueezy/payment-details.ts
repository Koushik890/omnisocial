import { PrismaClient, SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@prisma/client';

export const updateUserLemonSqueezyPaymentDetails = async (
  { 
    customerId,
    userId,
    subscriptionPlan,
    subscriptionStatus,
    lemonSqueezyCustomerPortalUrl,
  }: {
    customerId: string;
    userId: string;
    subscriptionPlan?: SUBSCRIPTION_PLAN;
    subscriptionStatus?: SUBSCRIPTION_STATUS;
    lemonSqueezyCustomerPortalUrl?: string;
  },
  prisma: PrismaClient
) => {
  return prisma.subscription.upsert({
    where: {
      userId: userId,
    },
    create: {
      userId,
      customerId,
      plan: subscriptionPlan || SUBSCRIPTION_PLAN.FREE,
      subscriptionStatus: subscriptionStatus || SUBSCRIPTION_STATUS.ACTIVE,
      lemonSqueezyCustomerPortalUrl,
    },
    update: {
      customerId,
      plan: subscriptionPlan,
      subscriptionStatus,
      lemonSqueezyCustomerPortalUrl,
    },
  });
}; 