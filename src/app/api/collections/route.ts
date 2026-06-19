import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(200).optional(),
  isPublic: z.boolean().default(false),
  tools: z.array(z.string()).default([]),
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

    const collections = await prisma.collection.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ collections });
  } catch (error) {
    logger.error("Failed to fetch collections", { error });
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
    const result = createCollectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Invalid data" }, { status: 400 });
    }

    const { name, description, isPublic, tools } = result.data;
    
    // Generate a slug from the name
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    // Ensure slug uniqueness
    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const collection = await prisma.collection.create({
      data: {
        userId: user.id,
        name,
        slug,
        description,
        isPublic,
        tools,
      },
    });

    return NextResponse.json({ collection });
  } catch (error) {
    logger.error("Failed to create collection", { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
