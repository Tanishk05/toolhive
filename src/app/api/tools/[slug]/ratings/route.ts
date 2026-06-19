import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const rateSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const stats = await prisma.toolRating.aggregate({
      where: { toolSlug: slug },
      _avg: { rating: true },
      _count: { rating: true },
    });

    let userRating = 0;
    const { userId: clerkId } = await auth();
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
      if (user) {
        const rating = await prisma.toolRating.findUnique({
          where: { userId_toolSlug: { userId: user.id, toolSlug: slug } }
        });
        if (rating) userRating = rating.rating;
      }
    }

    return NextResponse.json({ 
      average: stats._avg.rating || 0, 
      count: stats._count.rating,
      userRating 
    });
  } catch (error) {
    logger.error("Failed to fetch tool ratings", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = rateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const rating = await prisma.toolRating.upsert({
      where: { userId_toolSlug: { userId: user.id, toolSlug: slug } },
      update: { rating: result.data.rating },
      create: { userId: user.id, toolSlug: slug, rating: result.data.rating },
    });

    return NextResponse.json({ rating });
  } catch (error) {
    logger.error("Failed to submit rating", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
