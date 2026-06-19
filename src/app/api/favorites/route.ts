import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const addFavoriteSchema = z.object({
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

    const favorites = await prisma.savedTool.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    logger.error("Failed to fetch favorites", { error });
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
    const result = addFavoriteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { toolSlug } = result.data;

    const favorite = await prisma.savedTool.upsert({
      where: {
        userId_toolSlug: {
          userId: user.id,
          toolSlug,
        },
      },
      update: {},
      create: {
        userId: user.id,
        toolSlug,
      },
    });

    return NextResponse.json({ favorite });
  } catch (error) {
    logger.error("Failed to add favorite", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
