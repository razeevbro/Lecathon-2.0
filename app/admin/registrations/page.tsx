"use client";

import { useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminJson, useAdminResource } from "@/components/admin/useAdminResource";
import { AdminButton, AdminCard, AdminInput } from "@/components/admin/admin-ui";
import type { RegistrationRow } from "@/lib/types/site";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function AdminRegistrationsPage() {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sendingThankYou, setSendingThankYou] = useState(false);
  const [sendingTeamId, setSendingTeamId] = useState<number | null>(null);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (theme !== "all") params.set("theme", theme);
    const qs = params.toString();
    return `/api/admin/registrations${qs ? `?${qs}` : ""}`;
  }, [search, theme]);

  const buildExportUrl = (format: "html" | "xlsx" | "csv") => {
    const params = new URLSearchParams();
    params.set("format", format);
    if (search.trim()) params.set("q", search.trim());
    if (theme !== "all") params.set("theme", theme);
    return `/api/admin/registrations?${params.toString()}`;
  };

  const { items: rows, loading, msg, setMsg, load } =
    useAdminResource<RegistrationRow>(url);

  const themes = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.theme).filter(Boolean) as string[])
      ).sort(),
    [rows]
  );

  const toggle = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const sendThankYouToAll = async () => {
    if (
      !confirm(
        "Send thank-you email to ALL registered team leaders? Each leader will receive one email about top 10 selection."
      )
    ) {
      return;
    }

    setSendingThankYou(true);
    setMsg("");
    const res = await fetch("/api/admin/registrations/thank-you", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setSendingThankYou(false);
    setMsg(data.message || (data.success ? "Emails sent." : "Failed to send emails."));
  };

  const sendThankYouToTeam = async (row: RegistrationRow) => {
    if (
      !confirm(
        `Send thank-you email to ${row.teamLeaderName} (${row.teamLeaderEmail})?`
      )
    ) {
      return;
    }

    setSendingTeamId(row.id);
    setMsg("");
    const res = await fetch("/api/admin/registrations/thank-you", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [row.id] }),
    });
    const data = await res.json();
    setSendingTeamId(null);
    setMsg(data.message || (data.success ? "Email sent." : "Failed to send email."));
  };

  const remove = async (row: RegistrationRow) => {
    if (
      !confirm(
        `Delete registration for team "${row.teamName}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(row.id);
    const data = await adminJson(
      `/api/admin/registrations/${row.id}`,
      "DELETE"
    );
    setDeletingId(null);

    if (data.success) {
      setMsg("Registration deleted.");
      if (expanded === row.id) setExpanded(null);
      load();
    } else {
      setMsg(data.message || "Failed to delete registration.");
    }
  };

  return (
    <AdminShell
      title="Registrations"
      description={`${rows.length} team${rows.length === 1 ? "" : "s"} shown.`}
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <AdminInput
          label="Search teams"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Team name, leader, email, college…"
          className="flex-1"
        />
        <label className="block sm:w-48">
          <span className="text-xs text-[#888] mb-1 block">Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="all">All themes</option>
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href={buildExportUrl("html")}>
          <AdminButton type="button">Download Report</AdminButton>
        </a>
        <a href={buildExportUrl("xlsx")}>
          <AdminButton type="button" variant="ghost">
            Download Excel
          </AdminButton>
        </a>
        <a href={buildExportUrl("csv")}>
          <AdminButton type="button" variant="ghost">
            Download CSV
          </AdminButton>
        </a>
        <AdminButton
          type="button"
          onClick={sendThankYouToAll}
          disabled={sendingThankYou || loading}
        >
          {sendingThankYou ? "Sending emails…" : "Email all thank-you"}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={load}>
          Refresh
        </AdminButton>
      </div>
      <p className="text-xs text-[#888] -mt-4 mb-6">
        Use Download Report for a readable HTML file (best for project
        descriptions). Excel has a compact Summary sheet plus Project Details.
        Exports respect your current search and theme filters.
      </p>

      {msg && (
        <p
          className={`text-sm mb-4 ${
            msg.includes("sent") ||
            msg.includes("Sent") ||
            msg.includes("deleted") ||
            msg.includes("Deleted")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {msg}
        </p>
      )}

      <AdminCard className="p-0 overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-[#888]">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-5 text-sm text-[#888]">No registrations match your filters.</p>
        ) : (
          <ul>
            {rows.map((row) => {
              const open = expanded === row.id;
              return (
                <li key={row.id} className="border-b border-white/5">
                  <button
                    type="button"
                    onClick={() => toggle(row.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    {open ? (
                      <ChevronDown size={16} className="text-yellow-400 shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-[#888] shrink-0" />
                    )}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="font-semibold">{row.teamName}</p>
                        <p className="text-xs text-[#888]">{row.college}</p>
                      </div>
                      <div>
                        <p>{row.teamLeaderName}</p>
                        <p className="text-xs text-[#888]">{row.teamLeaderEmail}</p>
                      </div>
                      <div className="text-[#ccc]">{row.theme || "—"}</div>
                      <div className="text-xs text-[#888]">
                        {row.teamSize} members ·{" "}
                        {new Date(row.registeredAt).toLocaleString()}
                      </div>
                    </div>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 pl-11 text-sm text-[#ccc] space-y-3">
                      <p>
                        <span className="text-[#888]">Phone:</span> {row.phone}
                      </p>
                      {row.videoUrl ? (
                        <p>
                          <span className="text-[#888]">Video:</span>{" "}
                          <a
                            href={row.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 hover:text-yellow-300 break-all"
                          >
                            Open Google Drive link
                          </a>
                        </p>
                      ) : (
                        <p className="text-[#888]">Video: —</p>
                      )}
                      {row.projectDescription ? (
                        <div>
                          <p className="text-[#888] mb-1">Project description:</p>
                          <p className="whitespace-pre-wrap text-[#ccc] leading-relaxed">
                            {row.projectDescription}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#888]">Project description: —</p>
                      )}
                      <div>
                        <p className="text-[#888] mb-1">Members:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {row.members.map((m, i) => (
                            <li key={i}>
                              {m.name} — {m.email}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <AdminButton
                          type="button"
                          disabled={sendingTeamId === row.id}
                          onClick={() => sendThankYouToTeam(row)}
                        >
                          {sendingTeamId === row.id
                            ? "Sending…"
                            : "Send thank-you email"}
                        </AdminButton>
                        <AdminButton
                          type="button"
                          variant="danger"
                          disabled={deletingId === row.id}
                          onClick={() => remove(row)}
                        >
                          {deletingId === row.id ? "Deleting…" : "Delete registration"}
                        </AdminButton>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </AdminCard>
    </AdminShell>
  );
}
