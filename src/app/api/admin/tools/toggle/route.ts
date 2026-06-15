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
    const { toolId, field, value } = body;

    if (!toolId || !field || typeof value !== 'boolean') {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // 2. Update tool
    const updatedTool = await prisma.tool.update({
      where: { id: toolId },
      data: { [field]: value },
    });

    // 3. Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: `UPDATE_TOOL_${field.toUpperCase()}`,
        resource: "Tool",
        resourceId: toolId,
        userId: caller.id,
        metadata: { field, value },
      },
    });

    return NextResponse.json({ success: true, tool: updatedTool });
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
