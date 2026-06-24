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

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (theme !== "all") params.set("theme", theme);
    const qs = params.toString();
    return `/api/admin/registrations${qs ? `?${qs}` : ""}`;
  }, [search, theme]);

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

      <div className="flex gap-3 mb-6">
        <a href="/api/admin/registrations?format=csv">
          <AdminButton type="button">Download CSV</AdminButton>
        </a>
        <AdminButton type="button" variant="ghost" onClick={load}>
          Refresh
        </AdminButton>
      </div>

      {msg && (
        <p
          className={`text-sm mb-4 ${msg.includes("deleted") || msg.includes("Deleted") ? "text-green-400" : "text-red-400"}`}
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
                      <AdminButton
                        type="button"
                        variant="danger"
                        disabled={deletingId === row.id}
                        onClick={() => remove(row)}
                      >
                        {deletingId === row.id ? "Deleting…" : "Delete registration"}
                      </AdminButton>
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
