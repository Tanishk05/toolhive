import type { NextRequest } from "next/server";
import { newsletterSchema } from "@/lib/validations/contact";
import { newsletterLimiter, getClientIp } from "@/lib/rate-limit";
import { emailService } from "@/lib/email";
import { logger } from "@/lib/logger";
import { ok, fail } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const limit = newsletterLimiter.check(ip);
  if (!limit.allowed) {
    return Response.json(
      fail("RATE_LIMITED", "Too many requests. Please try again later."),
      { status: 429 }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      fail("INVALID_JSON", "Invalid request body."),
      { status: 400 }
    );
  }

  // Validate
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return Response.json(
      fail("VALIDATION_ERROR", firstError?.message ?? "Invalid input.", parsed.error.issues),
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Spam: honeypot check
  if (data.website) {
    return Response.json(ok({ subscribed: true }));
  }

  // Upsert subscriber (idempotent)
  try {
    const { prisma } = await import("@/lib/prisma");
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: data.email },
    });

    if (existing && !existing.unsubscribed) {
      // Already subscribed — don't re-send welcome email
      return Response.json(ok({ subscribed: true }));
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email: data.email },
      update: { unsubscribed: false, subscribedAt: new Date() },
      create: { email: data.email },
    });
  } catch (error) {
    logger.error("Failed to save newsletter subscriber", { error });
  }

  // Send welcome email
  try {
    await emailService.sendNewsletterWelcome(data.email, { email: data.email });
  } catch (error) {
    logger.warn("Newsletter welcome email failed", { error });
  }

  return Response.json(ok({ subscribed: true }));
}
