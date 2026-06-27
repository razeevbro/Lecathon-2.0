import nodemailer from "nodemailer";
import { ORGANIZER_NAME } from "@/app/constants";
import type { ValidatedRegistration } from "@/lib/registration";
import type { RegistrationRow } from "@/lib/types/site";

type SendResult = { ok: true } | { ok: false; error: string };

export type ThankYouRecipient = {
  leaderName: string;
  leaderEmail: string;
  teamName: string;
  college: string;
  theme: string | null;
  registrationId: string;
};

export type ThankYouBulkResult = {
  sent: number;
  failed: number;
  results: {
    id: number;
    teamName: string;
    email: string;
    ok: boolean;
    error?: string;
  }[];
};

type EmailProvider = "smtp" | "resend";

function getSharedConfig() {
  const from = process.env.EMAIL_FROM?.trim();
  const adminTo = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  if (!from || !adminTo) {
    return null;
  }
  return { from, adminTo };
}

function getProvider(): EmailProvider | null {
  const shared = getSharedConfig();
  if (!shared) {
    return null;
  }

  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  if (smtpUser && smtpPass) {
    return "smtp";
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    return "resend";
  }

  return null;
}

async function sendViaSmtp(options: {
  to: string[];
  subject: string;
  html: string;
}): Promise<SendResult> {
  const shared = getSharedConfig();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!shared || !user || !pass) {
    return { ok: false, error: "SMTP is not configured." };
  }

  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || "587");

  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transport.sendMail({
      from: shared.from,
      to: options.to.join(", "),
      subject: options.subject,
      html: options.html,
    });

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "SMTP send failed",
    };
  }
}

async function sendViaResend(options: {
  to: string[];
  subject: string;
  html: string;
}): Promise<SendResult> {
  const shared = getSharedConfig();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!shared || !apiKey) {
    return { ok: false, error: "Resend is not configured." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: shared.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: body || `Resend HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Resend send failed",
    };
  }
}

async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<SendResult> {
  const provider = getProvider();
  if (!provider) {
    return { ok: false, error: "Email is not configured." };
  }

  const to = (Array.isArray(options.to) ? options.to : [options.to])
    .map((e) => e.trim())
    .filter(Boolean);

  if (provider === "smtp") {
    return sendViaSmtp({ ...options, to });
  }
  return sendViaResend({ ...options, to });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function membersHtml(members: ValidatedRegistration["members"]): string {
  return members
    .map(
      (m, i) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i + 1}</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(m.name)}</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(m.email)}</td></tr>`
    )
    .join("");
}

function adminNotificationHtml(
  data: ValidatedRegistration,
  registrationId: string
): string {
  return `
    <div style="font-family:sans-serif;max-width:560px;color:#111;">
      <h2 style="color:#111;margin:0 0 16px;">New Lecathon 2.0 registration</h2>
      <p style="margin:0 0 8px;"><strong>ID:</strong> ${escapeHtml(registrationId)}</p>
      <p style="margin:0 0 8px;"><strong>Team:</strong> ${escapeHtml(data.teamName)}</p>
      <p style="margin:0 0 8px;"><strong>Leader:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})</p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p style="margin:0 0 8px;"><strong>College:</strong> ${escapeHtml(data.college)}</p>
      <p style="margin:0 0 8px;"><strong>Theme:</strong> ${escapeHtml(data.theme || "—")}</p>
      <p style="margin:0 0 8px;"><strong>Video:</strong> <a href="${escapeHtml(data.videoUrl)}" style="color:#2563eb;">${escapeHtml(data.videoUrl)}</a></p>
      <p style="margin:0 0 16px;"><strong>Team size:</strong> ${data.teamSize}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead><tr style="background:#f5f5f5;">
          <th style="padding:8px;text-align:left;">#</th>
          <th style="padding:8px;text-align:left;">Member</th>
          <th style="padding:8px;text-align:left;">Email</th>
        </tr></thead>
        <tbody>${membersHtml(data.members)}</tbody>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#666;">View all registrations in the Lecathon CMS admin dashboard.</p>
    </div>
  `;
}

function buildThankYouHtml(recipient: ThankYouRecipient): string {
  return `
    <div style="font-family:sans-serif;max-width:560px;color:#111;">
      <h2 style="color:#111;margin:0 0 16px;">Thank you for registering for Lecathon 2.0</h2>
      <p>Hi ${escapeHtml(recipient.leaderName)},</p>
      <p>Thank you for registering. Your team <strong>${escapeHtml(recipient.teamName)}</strong> has been registered successfully.</p>
      <p style="margin:0 0 8px;"><strong>Reference:</strong> ${escapeHtml(recipient.registrationId)}</p>
      <p style="margin:0 0 8px;"><strong>College:</strong> ${escapeHtml(recipient.college)}</p>
      <p style="margin:0 0 8px;"><strong>Preferred theme:</strong> ${escapeHtml(recipient.theme || "Not selected")}</p>
      <p style="margin:16px 0 0;">We will contact you at this email if your team is selected among the <strong>top 10 teams</strong> for further processing.</p>
      <p style="margin:12px 0 0;">Best of luck, and thank you for being part of Lecathon 2.0.</p>
      <p style="margin:24px 0 0;font-size:12px;color:#666;">— ${ORGANIZER_NAME} · Lecathon 2.0</p>
    </div>
  `;
}

function confirmationHtml(
  data: ValidatedRegistration,
  registrationId: string
): string {
  return buildThankYouHtml({
    leaderName: data.name,
    leaderEmail: data.email,
    teamName: data.teamName,
    college: data.college,
    theme: data.theme ?? null,
    registrationId,
  });
}

function registrationRowToThankYou(row: RegistrationRow): ThankYouRecipient {
  return {
    leaderName: row.teamLeaderName,
    leaderEmail: row.teamLeaderEmail,
    teamName: row.teamName,
    college: row.college,
    theme: row.theme,
    registrationId: `REG-${row.id}`,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const THANK_YOU_SUBJECT = "Lecathon 2.0 — Thank you for registering";

export async function sendThankYouEmail(
  recipient: ThankYouRecipient
): Promise<SendResult> {
  return sendEmail({
    to: recipient.leaderEmail,
    subject: THANK_YOU_SUBJECT,
    html: buildThankYouHtml(recipient),
  });
}

export async function sendThankYouToRegistrations(
  rows: RegistrationRow[]
): Promise<ThankYouBulkResult> {
  if (!getProvider()) {
    throw new Error(
      "Email not configured. Set SMTP_USER, SMTP_PASS, EMAIL_FROM, and ADMIN_NOTIFICATION_EMAIL."
    );
  }

  const results: ThankYouBulkResult["results"] = [];
  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const recipient = registrationRowToThankYou(row);
    const result = await sendThankYouEmail(recipient);

    if (result.ok) {
      sent += 1;
      results.push({
        id: row.id,
        teamName: row.teamName,
        email: row.teamLeaderEmail,
        ok: true,
      });
    } else {
      failed += 1;
      results.push({
        id: row.id,
        teamName: row.teamName,
        email: row.teamLeaderEmail,
        ok: false,
        error: result.error,
      });
    }

    if (rows.length > 1) {
      await sleep(750);
    }
  }

  return { sent, failed, results };
}

export function isEmailConfigured(): boolean {
  return getProvider() !== null;
}

export function getEmailProviderLabel(): string {
  const p = getProvider();
  if (p === "smtp") return "SMTP (Gmail, etc.)";
  if (p === "resend") return "Resend";
  return "disabled";
}

export async function sendTestEmail(): Promise<SendResult> {
  const shared = getSharedConfig();
  if (!getProvider() || !shared) {
    return {
      ok: false,
      error:
        "Email not configured. Set SMTP_USER, SMTP_PASS, EMAIL_FROM, and ADMIN_NOTIFICATION_EMAIL.",
    };
  }

  const adminTo = shared.adminTo
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  return sendEmail({
    to: adminTo,
    subject: "[Lecathon] Test email from admin",
    html: `
      <div style="font-family:sans-serif;max-width:560px;color:#111;">
        <h2>Lecathon 2.0 — Email test</h2>
        <p>If you received this, your SMTP configuration is working.</p>
        <p style="font-size:12px;color:#666;">Sent from the admin dashboard.</p>
      </div>
    `,
  });
}

export async function sendRegistrationEmails(
  data: ValidatedRegistration,
  registrationId: string
): Promise<{ admin: SendResult; confirmation: SendResult | null }> {
  const shared = getSharedConfig();
  if (!getProvider() || !shared) {
    const skipped = { ok: false as const, error: "Email not configured" };
    return { admin: skipped, confirmation: null };
  }

  const adminTo = shared.adminTo
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const admin = await sendEmail({
    to: adminTo,
    subject: `[Lecathon] New team: ${data.teamName}`,
    html: adminNotificationHtml(data, registrationId),
  });

  const sendConfirmation =
    process.env.SEND_REGISTRATION_CONFIRMATION !== "false";

  let confirmation: SendResult | null = null;
  if (sendConfirmation) {
    confirmation = await sendEmail({
      to: data.email,
      subject: THANK_YOU_SUBJECT,
      html: confirmationHtml(data, registrationId),
    });
  }

  return { admin, confirmation };
}
