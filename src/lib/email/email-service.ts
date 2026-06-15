import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getResendClient } from "@/lib/email/resend";
import {
  contactConfirmationTemplate,
  contactNotificationTemplate,
  newsletterWelcomeTemplate,
  supportConfirmationTemplate,
  supportNotificationTemplate,
  type ContactTemplateData,
  type NewsletterTemplateData,
  type SupportTemplateData,
} from "@/lib/email/templates";

export type EmailResult =
  | { success: true; id: string }
  | { success: false; error: string };

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export const emailService = {
  /**
   * Low-level send method. All other methods delegate to this.
   */
  async send(options: SendEmailOptions): Promise<EmailResult> {
    const resend = getResendClient();

    if (!resend) {
      logger.warn("Email skipped — RESEND_API_KEY not configured", {
        to: options.to,
        subject: options.subject,
      });
      return { success: true, id: "skipped-no-api-key" };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      });

      if (error) {
        logger.error("Resend API error", { error });
        return { success: false, error: error.message };
      }

      logger.info("Email sent", { id: data?.id, to: options.to });
      return { success: true, id: data?.id ?? "unknown" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email error";
      logger.error("Email send failed", { error: message });
      return { success: false, error: message };
    }
  },

  // ── Contact ──

  async sendContactConfirmation(to: string, data: ContactTemplateData): Promise<EmailResult> {
    const template = contactConfirmationTemplate(data);
    return this.send({ to, ...template, replyTo: env.CONTACT_TO_EMAIL });
  },

  async sendContactNotification(data: ContactTemplateData): Promise<EmailResult> {
    const template = contactNotificationTemplate(data);
    return this.send({ to: env.CONTACT_TO_EMAIL, ...template, replyTo: data.email });
  },

  // ── Newsletter ──

  async sendNewsletterWelcome(to: string, data: NewsletterTemplateData): Promise<EmailResult> {
    const template = newsletterWelcomeTemplate(data);
    return this.send({ to, ...template });
  },

  // ── Support ──

  async sendSupportConfirmation(to: string, data: SupportTemplateData): Promise<EmailResult> {
    const template = supportConfirmationTemplate(data);
    return this.send({ to, ...template, replyTo: env.CONTACT_TO_EMAIL });
  },

  async sendSupportNotification(data: SupportTemplateData): Promise<EmailResult> {
    const template = supportNotificationTemplate(data);
    return this.send({ to: env.CONTACT_TO_EMAIL, ...template, replyTo: data.email });
  },
};
