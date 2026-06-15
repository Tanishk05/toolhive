import { z } from "zod";

// ── Contact Form ──

export const contactSubjects = [
  "general",
  "feedback",
  "partnership",
  "other",
] as const;

export const contactSubjectLabels: Record<(typeof contactSubjects)[number], string> = {
  general: "General Inquiry",
  feedback: "Feedback",
  partnership: "Partnership",
  other: "Other",
};

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email must be under 254 characters"),
  subject: z.enum(contactSubjects, {
    message: "Please select a subject",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  // Spam protection (hidden fields)
  website: z.string().max(0, "Bot detected").optional(),
  _gotcha: z.string().max(0, "Bot detected").optional(),
  _timestamp: z.number().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// ── Newsletter ──

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email must be under 254 characters"),
  // Spam protection
  website: z.string().max(0, "Bot detected").optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

// ── Support Request ──

export const supportCategories = [
  "bug",
  "feature",
  "billing",
  "other",
] as const;

export const supportCategoryLabels: Record<(typeof supportCategories)[number], string> = {
  bug: "Bug Report",
  feature: "Feature Request",
  billing: "Billing",
  other: "Other",
};

export const supportPriorities = [
  "low",
  "normal",
  "high",
  "urgent",
] as const;

export const supportPriorityLabels: Record<(typeof supportPriorities)[number], string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const supportRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email must be under 254 characters"),
  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be under 200 characters"),
  category: z.enum(supportCategories, {
    message: "Please select a category",
  }),
  priority: z.enum(supportPriorities, {
    message: "Please select a priority",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be under 5000 characters"),
  // Spam protection
  website: z.string().max(0, "Bot detected").optional(),
  _gotcha: z.string().max(0, "Bot detected").optional(),
  _timestamp: z.number().optional(),
});

export type SupportFormValues = z.infer<typeof supportRequestSchema>;
