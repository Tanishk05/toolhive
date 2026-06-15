import { Resend } from "resend";
import { env } from "@/lib/env";

let _resend: Resend | null = null;

/**
 * Lazy-initialized Resend client singleton.
 * Returns null when RESEND_API_KEY is not configured (e.g. local dev).
 */
export function getResendClient(): Resend | null {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  if (!_resend) {
    _resend = new Resend(env.RESEND_API_KEY);
  }

  return _resend;
}
