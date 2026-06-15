/**
 * Pure functions returning { subject, html } for each email type.
 * Uses a shared base layout matching the ToolHive brand.
 */

function baseLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #060816; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .card { background-color: #0f172a; border: 1px solid rgba(148,163,184,0.15); border-radius: 24px; padding: 40px 32px; }
    .logo { font-size: 12px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: #34d399; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 600; color: #f8fafc; margin: 0 0 16px 0; line-height: 1.3; }
    p { font-size: 15px; color: #94a3b8; line-height: 1.7; margin: 0 0 16px 0; }
    .highlight { background-color: rgba(30,41,59,0.8); border: 1px solid rgba(148,163,184,0.1); border-radius: 16px; padding: 20px 24px; margin: 20px 0; }
    .highlight p { margin: 0; }
    .label { font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
    .value { font-size: 15px; color: #e2e8f0; margin: 0 0 14px 0; line-height: 1.6; }
    .value:last-child { margin-bottom: 0; }
    .divider { border: none; border-top: 1px solid rgba(148,163,184,0.12); margin: 28px 0; }
    .footer { text-align: center; padding-top: 24px; }
    .footer p { font-size: 12px; color: #475569; margin: 0; }
    .badge { display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 500; }
    .badge-emerald { background-color: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #34d399; }
    .badge-amber { background-color: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2); color: #fbbf24; }
    .badge-red { background-color: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #ef4444; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">ToolHive</div>
      ${body}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ToolHive. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Contact Form ──

export type ContactTemplateData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function contactConfirmationTemplate(data: ContactTemplateData) {
  return {
    subject: `We received your message — ${data.subject}`,
    html: baseLayout(
      "Message Received",
      `<h1>Thanks for reaching out, ${escapeHtml(data.name)}!</h1>
      <p>We&rsquo;ve received your message and will get back to you as soon as possible, typically within 1&ndash;2 business days.</p>
      <div class="highlight">
        <p class="label">Your message</p>
        <p class="value">${escapeHtml(data.message)}</p>
      </div>
      <p>If you need to add anything, simply reply to this email.</p>`
    ),
  };
}

export function contactNotificationTemplate(data: ContactTemplateData) {
  return {
    subject: `[Contact] ${data.subject} — from ${data.name}`,
    html: baseLayout(
      "New Contact Message",
      `<h1>New contact form submission</h1>
      <div class="highlight">
        <p class="label">Name</p>
        <p class="value">${escapeHtml(data.name)}</p>
        <p class="label">Email</p>
        <p class="value">${escapeHtml(data.email)}</p>
        <p class="label">Subject</p>
        <p class="value">${escapeHtml(data.subject)}</p>
        <hr class="divider" />
        <p class="label">Message</p>
        <p class="value">${escapeHtml(data.message)}</p>
      </div>`
    ),
  };
}

// ── Newsletter ──

export type NewsletterTemplateData = {
  email: string;
};

export function newsletterWelcomeTemplate(data: NewsletterTemplateData) {
  return {
    subject: "Welcome to the ToolHive newsletter!",
    html: baseLayout(
      "Newsletter Welcome",
      `<h1>You&rsquo;re on the list!</h1>
      <p>Thanks for subscribing to the ToolHive newsletter. You&rsquo;ll receive updates on new tools, platform features, and curated content from our team.</p>
      <div class="highlight">
        <p class="label">Subscribed as</p>
        <p class="value">${escapeHtml(data.email)}</p>
      </div>
      <p>We keep it concise and relevant &mdash; no spam, ever.</p>`
    ),
  };
}

// ── Support Request ──

export type SupportTemplateData = {
  name: string;
  email: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
};

const priorityBadgeClass: Record<string, string> = {
  low: "badge-emerald",
  normal: "badge-emerald",
  high: "badge-amber",
  urgent: "badge-red",
};

export function supportConfirmationTemplate(data: SupportTemplateData) {
  return {
    subject: `Support request received — ${data.subject}`,
    html: baseLayout(
      "Support Request Received",
      `<h1>We&rsquo;re on it, ${escapeHtml(data.name)}!</h1>
      <p>Your support request has been received and assigned a priority of <span class="badge ${priorityBadgeClass[data.priority] ?? "badge-emerald"}">${escapeHtml(data.priority)}</span>. Our team will review it shortly.</p>
      <div class="highlight">
        <p class="label">Category</p>
        <p class="value">${escapeHtml(data.category)}</p>
        <p class="label">Subject</p>
        <p class="value">${escapeHtml(data.subject)}</p>
      </div>
      <p>We&rsquo;ll follow up via email. Reply to this message if you need to add details.</p>`
    ),
  };
}

export function supportNotificationTemplate(data: SupportTemplateData) {
  const badgeClass = priorityBadgeClass[data.priority] ?? "badge-emerald";
  return {
    subject: `[Support/${data.category}] ${data.subject} — ${data.priority} priority`,
    html: baseLayout(
      "New Support Request",
      `<h1>New support request</h1>
      <p><span class="badge ${badgeClass}">${escapeHtml(data.priority)} priority</span></p>
      <div class="highlight">
        <p class="label">Name</p>
        <p class="value">${escapeHtml(data.name)}</p>
        <p class="label">Email</p>
        <p class="value">${escapeHtml(data.email)}</p>
        <p class="label">Category</p>
        <p class="value">${escapeHtml(data.category)}</p>
        <p class="label">Subject</p>
        <p class="value">${escapeHtml(data.subject)}</p>
        <hr class="divider" />
        <p class="label">Message</p>
        <p class="value">${escapeHtml(data.message)}</p>
      </div>`
    ),
  };
}
