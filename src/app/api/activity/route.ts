import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const addActivitySchema = z.object({
  toolSlug: z.string(),
});

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const activity = await prisma.recentActivity.findMany({
      where: { userId: user.id },
      orderBy: { visitedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ activity });
  } catch (error) {
    logger.error("Failed to fetch activity", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = addActivitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { toolSlug } = result.data;

    // Optional: We can avoid too many records by upserting or just creating and deleting old ones later.
    // For now, let's just create a new record. We might want to remove duplicates.
    // To keep the DB clean, let's delete previous activity for this tool and create a new one.
    await prisma.recentActivity.deleteMany({
      where: {
        userId: user.id,
        toolSlug,
      },
    });

    const activity = await prisma.recentActivity.create({
      data: {
        userId: user.id,
        toolSlug,
      },
    });

    return NextResponse.json({ activity });
  } catch (error) {
    logger.error("Failed to add activity", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
