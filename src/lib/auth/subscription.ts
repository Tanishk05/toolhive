import type { SubscriptionStatus } from "@prisma/client";

export type SubscriptionPlan = "free" | "pro" | "team";

export type SubscriptionSummary = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus | "none";
  premiumAccess: boolean;
  renewsAt?: Date | null;
};

export const freeSubscription: SubscriptionSummary = {
  plan: "free",
  status: "none",
  premiumAccess: false,
  renewsAt: null,
};

export function hasPremiumAccess(subscription: SubscriptionSummary) {
  return subscription.premiumAccess && ["active", "trialing"].includes(subscription.status);
}
