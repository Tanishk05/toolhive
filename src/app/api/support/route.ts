import type { NextRequest } from "next/server";
import {
  supportRequestSchema,
  supportCategoryLabels,
  supportPriorityLabels,
} from "@/lib/validations/contact";
import { supportLimiter, getClientIp } from "@/lib/rate-limit";
import { emailService } from "@/lib/email";
import { logger } from "@/lib/logger";
import { ok, fail } from "@/lib/api-response";

const MIN_SUBMISSION_TIME_MS = 2000;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const limit = supportLimiter.check(ip);
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
  const parsed = supportRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return Response.json(
      fail("VALIDATION_ERROR", firstError?.message ?? "Invalid input.", parsed.error.issues),
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Spam: honeypot check
  if (data.website || data._gotcha) {
    return Response.json(ok({ sent: true }));
  }

  // Spam: timing check
  if (data._timestamp && Date.now() - data._timestamp < MIN_SUBMISSION_TIME_MS) {
    return Response.json(ok({ sent: true }));
  }

  // Save to database
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        type: "support",
        category: data.category,
        priority: data.priority,
      },
    });
  } catch (error) {
    logger.error("Failed to save support request", { error });
  }

  // Send emails
  const templateData = {
    name: data.name,
    email: data.email,
    subject: data.subject,
    category: supportCategoryLabels[data.category],
    priority: supportPriorityLabels[data.priority],
    message: data.message,
  };

  const [confirmResult, notifyResult] = await Promise.allSettled([
    emailService.sendSupportConfirmation(data.email, templateData),
    emailService.sendSupportNotification(templateData),
  ]);

  if (confirmResult.status === "rejected" || notifyResult.status === "rejected") {
    logger.warn("One or more support emails failed to send", {
      confirm: confirmResult.status,
      notify: notifyResult.status,
    });
  }

  return Response.json(ok({ sent: true }));
}
