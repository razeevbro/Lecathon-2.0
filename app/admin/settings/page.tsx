"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/admin-ui";
import type { SiteSettings } from "@/lib/types/site";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [msg, setMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailTesting, setEmailTesting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setForm(d.data);
      });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMsg(data.success ? "Settings saved." : data.message);
    if (data.success) setForm(data.data);
  };

  const testEmail = async () => {
    setEmailTesting(true);
    setEmailMsg("");
    const res = await fetch("/api/admin/email/test", { method: "POST" });
    const data = await res.json();
    setEmailTesting(false);
    setEmailMsg(data.message || (data.success ? "Test email sent." : "Failed."));
  };

  if (!form) {
    return (
      <AdminShell title="Site Settings" description="Loading…">
        <p className="text-[#888] text-sm">Loading settings…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Site Settings"
      description="Event details, registration controls, social links, and email."
    >
      <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <h2 className="font-semibold mb-4">Event & hero</h2>
          <div className="flex flex-col gap-3">
            <AdminInput
              label="Hackathon date (ISO)"
              value={form.hackathonDate}
              onChange={(e) =>
                setForm({ ...form, hackathonDate: e.target.value })
              }
            />
            <AdminInput
              label="Schedule date label"
              value={form.scheduleDateLabel}
              onChange={(e) =>
                setForm({ ...form, scheduleDateLabel: e.target.value })
              }
            />
            <AdminInput
              label="Schedule tab — Day 1 (online)"
              value={form.scheduleDay1Label}
              onChange={(e) =>
                setForm({ ...form, scheduleDay1Label: e.target.value })
              }
            />
            <AdminInput
              label="Schedule tab — Day 2 (offline)"
              value={form.scheduleDay2Label}
              onChange={(e) =>
                setForm({ ...form, scheduleDay2Label: e.target.value })
              }
            />
            <AdminInput
              label="Prize pool"
              value={form.prizePool}
              onChange={(e) => setForm({ ...form, prizePool: e.target.value })}
            />
            <AdminInput
              label="Participants stat (fallback)"
              value={form.participantsLabel}
              onChange={(e) =>
                setForm({ ...form, participantsLabel: e.target.value })
              }
            />
            <AdminInput
              label="Duration stat"
              value={form.durationLabel}
              onChange={(e) =>
                setForm({ ...form, durationLabel: e.target.value })
              }
            />
            <AdminInput
              label="Venue name"
              value={form.venueName}
              onChange={(e) => setForm({ ...form, venueName: e.target.value })}
            />
            <AdminInput
              label="Venue address"
              value={form.venueAddress}
              onChange={(e) =>
                setForm({ ...form, venueAddress: e.target.value })
              }
            />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-semibold mb-4">Registration</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={form.registrationOpen}
                onChange={(e) =>
                  setForm({ ...form, registrationOpen: e.target.checked })
                }
                className="rounded border-white/20"
              />
              Registration open
            </label>
            <AdminInput
              label="Deadline (ISO, optional)"
              value={form.registrationDeadline}
              onChange={(e) =>
                setForm({ ...form, registrationDeadline: e.target.value })
              }
              placeholder="2026-06-27T23:00:00+05:45"
            />
            <AdminInput
              label="Max teams (0 = unlimited)"
              type="number"
              min={0}
              value={String(form.maxTeams)}
              onChange={(e) =>
                setForm({ ...form, maxTeams: Number(e.target.value) || 0 })
              }
            />
            <AdminTextarea
              label="Closed message"
              value={form.registrationClosedMessage}
              onChange={(e) =>
                setForm({ ...form, registrationClosedMessage: e.target.value })
              }
            />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-semibold mb-4">Social & contact</h2>
          <div className="flex flex-col gap-3">
            <AdminInput
              label="GitHub URL"
              value={form.socialGithub}
              onChange={(e) =>
                setForm({ ...form, socialGithub: e.target.value })
              }
            />
            <AdminInput
              label="Instagram URL"
              value={form.socialInstagram}
              onChange={(e) =>
                setForm({ ...form, socialInstagram: e.target.value })
              }
            />
            <AdminInput
              label="Facebook URL"
              value={form.socialFacebook}
              onChange={(e) =>
                setForm({ ...form, socialFacebook: e.target.value })
              }
            />
            <AdminInput
              label="Website URL"
              value={form.socialWebsite}
              onChange={(e) =>
                setForm({ ...form, socialWebsite: e.target.value })
              }
            />
            <AdminInput
              label="Contact email"
              value={form.contactEmail}
              onChange={(e) =>
                setForm({ ...form, contactEmail: e.target.value })
              }
            />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-semibold mb-4">Email</h2>
          <p className="text-sm text-[#888] mb-4">
            Configure SMTP_USER, SMTP_PASS, EMAIL_FROM, and
            ADMIN_NOTIFICATION_EMAIL in Vercel env vars.
          </p>
          <AdminButton type="button" onClick={testEmail} disabled={emailTesting}>
            {emailTesting ? "Sending…" : "Send test email"}
          </AdminButton>
          {emailMsg && <p className="text-xs text-yellow-400 mt-3">{emailMsg}</p>}
        </AdminCard>

        <div className="lg:col-span-2">
          <AdminButton type="submit">Save all settings</AdminButton>
          {msg && <p className="text-xs text-yellow-400 mt-3">{msg}</p>}
        </div>
      </form>
    </AdminShell>
  );
}
