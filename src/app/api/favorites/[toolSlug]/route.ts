import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ toolSlug: string }> }
) {
  try {
    const { toolSlug } = await params;
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

    await prisma.savedTool.delete({
      where: {
        userId_toolSlug: {
          userId: user.id,
          toolSlug,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete favorite", { error });
    // Note: If the record doesn't exist, Prisma throws an error which will be caught here.
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
