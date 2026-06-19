import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const updateCollectionSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  isPublic: z.boolean().optional(),
  tools: z.array(z.string()).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId: clerkId } = await auth();

    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: { user: { select: { name: true, avatarUrl: true } } },
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // Check if private and not owner
    if (!collection.isPublic) {
      if (!clerkId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const user = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
      if (!user || user.id !== collection.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    return NextResponse.json({ collection });
  } catch (error) {
    logger.error("Failed to fetch collection", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
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

    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateCollectionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updated = await prisma.collection.update({
      where: { slug },
      data: result.data,
    });

    return NextResponse.json({ collection: updated });
  } catch (error) {
    logger.error("Failed to update collection", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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

    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.collection.delete({ where: { slug } });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete collection", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
