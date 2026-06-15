/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { isAnalyticsEventName } from "@/lib/analytics/events";
import { logger } from "@/lib/logger";

const analyticsEventSchema = z.object({
  name: z.string().refine(isAnalyticsEventName),
  userId: z.string().min(1).optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.string().datetime().optional(),
});

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { prisma } = await import("@/lib/prisma");
  const payload = analyticsEventSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json(fail("INVALID_ANALYTICS_EVENT", "Analytics event payload is invalid.", payload.error.flatten()), {
      status: 400,
    });
  }

  try {

    await prisma.analyticsEvent.create({
      data: {
        name: payload.data.name,
        userId: payload.data.userId,
        source: "web",
        payload: payload.data.properties as any,
        createdAt: payload.data.timestamp ? new Date(payload.data.timestamp) : undefined,
      },
    });

    return NextResponse.json(ok({ accepted: true }), { status: 202 });
  } catch (error) {
    logger.error("Failed to persist analytics event", { error });
    return NextResponse.json(fail("ANALYTICS_PERSISTENCE_FAILED", "Analytics event could not be saved."), { status: 500 });
  }
}
