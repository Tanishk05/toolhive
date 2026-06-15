"use server";

import { ok } from "@/lib/api-response";

export async function pingAction() {
  return ok({ status: "ok", timestamp: new Date().toISOString() });
}