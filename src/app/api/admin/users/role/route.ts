import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const { userId: clerkUserId } = await auth.protect();

    // 1. Verify caller is admin
    const caller = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!caller || caller.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    // 3. Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_USER_ROLE",
        resource: "User",
        resourceId: userId,
        userId: caller.id,
        metadata: { newRole: role },
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
