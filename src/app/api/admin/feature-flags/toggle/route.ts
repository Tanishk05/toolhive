import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const { userId: clerkUserId } = await auth.protect();

    // Verify caller is admin
    const caller = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!caller || caller.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { flagId, enabled } = body;

    if (!flagId || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // Update flag
    const updatedFlag = await prisma.featureFlag.update({
      where: { id: flagId },
      data: { enabled },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_FEATURE_FLAG",
        resource: "FeatureFlag",
        resourceId: flagId,
        userId: caller.id,
        metadata: { key: updatedFlag.key, enabled },
      },
    });

    return NextResponse.json({ success: true, flag: updatedFlag });
  } catch (error) {
    console.error("Error updating feature flag:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
