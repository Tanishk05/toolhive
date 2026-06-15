import type { User } from "@clerk/nextjs/server";
import { getToolRegistry, type ToolRegistryEntry } from "@/features/tools/tool-registry";
import { freeSubscription, type SubscriptionSummary } from "@/lib/auth/subscription";
import type { SavedTool } from "@prisma/client";
import { logger } from "@/lib/logger";

export type AccountUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

export type SavedToolSummary = {
  slug: string;
  name: string;
  categoryLabel: string;
  summary: string;
  premium: boolean;
};

function primaryEmail(user: User) {
  return user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "";
}

function displayName(user: User) {
  return user.fullName ?? ([user.firstName, user.lastName].filter(Boolean).join(" ") || primaryEmail(user));
}

async function prismaClient() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export const accountService = {
  async syncCurrentUser(user: User): Promise<AccountUser | null> {
    const email = primaryEmail(user);

    if (!email) {
      return null;
    }

    try {
      const prisma = await prismaClient();
      const record = await prisma.user.upsert({
        where: { clerkId: user.id },
        update: {
          email,
          name: displayName(user),
          avatarUrl: user.imageUrl,
        },
        create: {
          clerkId: user.id,
          email,
          name: displayName(user),
          avatarUrl: user.imageUrl,
        },
      });

      return {
        id: record.id,
        clerkId: record.clerkId ?? user.id,
        email: record.email,
        name: record.name,
        avatarUrl: record.avatarUrl,
      };
    } catch (error) {
      logger.error("Failed to sync Clerk user", { error });
      return {
        id: user.id,
        clerkId: user.id,
        email,
        name: displayName(user),
        avatarUrl: user.imageUrl,
      };
    }
  },

  async getSavedTools(userId: string): Promise<SavedToolSummary[]> {
    try {
      const prisma = await prismaClient();
      const savedTools = await prisma.savedTool.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      const savedToolSlugs = new Set(savedTools.map((st: SavedTool) => st.toolSlug));
      const tools = await getToolRegistry();

      return tools
        .filter((tool: ToolRegistryEntry) => savedToolSlugs.has(tool.slug))
        .map((tool: ToolRegistryEntry) => ({
          slug: tool.slug,
          name: tool.name,
          categoryLabel: tool.categoryLabel,
          summary: tool.summary,
          premium: tool.premium,
          savedAt: savedTools.find((st: SavedTool) => st.toolSlug === tool.slug)?.createdAt || new Date(),
        }));
    } catch (error) {
      logger.error("Failed to load saved tools", { error });
      return [];
    }
  },

  async getSubscriptionStatus(userId: string): Promise<SubscriptionSummary> {
    try {
      const prisma = await prismaClient();
      const subscription = await prisma.subscription.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      if (!subscription) {
        return freeSubscription;
      }

      return {
        plan: subscription.providerPlanId.includes("team") ? "team" : "pro",
        status: subscription.status,
        premiumAccess: ["active", "trialing"].includes(subscription.status),
        renewsAt: subscription.currentPeriodAt,
      };
    } catch (error) {
      logger.error("Failed to load subscription status", { error });
      return freeSubscription;
    }
  },
};
