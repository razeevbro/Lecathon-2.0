"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { AdminButton, AdminCard } from "@/components/admin/admin-ui";

type Stats = {
  registrations: number;
  sponsors: number;
  themes: number;
  faqs: number;
  scheduleItems: number;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
      });
  }, []);

  const seed = async () => {
    if (
      !confirm(
        "Replace all CMS content (sponsors, themes, FAQs, schedule) with defaults?"
      )
    ) {
      return;
    }
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const data = await res.json();
    setSeedMsg(data.message || (data.success ? "Seeded." : "Failed."));
    const statsRes = await fetch("/api/admin/stats");
    const statsData = await statsRes.json();
    if (statsData.success) setStats(statsData.data);
  };

  const links = [
    { href: "/admin/registrations", label: "Registrations", count: stats?.registrations },
    { href: "/admin/results", label: "Top 10 Results" },
    { href: "/admin/sponsors", label: "Sponsors", count: stats?.sponsors },
    { href: "/admin/themes", label: "Problem themes", count: stats?.themes },
    { href: "/admin/schedule", label: "Schedule items", count: stats?.scheduleItems },
    { href: "/admin/faqs", label: "FAQs", count: stats?.faqs },
    { href: "/admin/settings", label: "Site settings" },
  ];

  return (
    <AdminShell
      title="Overview"
      description="Manage Lecathon 2.0 content and registrations."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats &&
          [
            { label: "Teams", value: stats.registrations },
            { label: "Sponsors", value: stats.sponsors },
            { label: "Themes", value: stats.themes },
            { label: "Schedule", value: stats.scheduleItems },
            { label: "FAQs", value: stats.faqs },
          ].map((s) => (
            <AdminCard key={s.label} className="text-center py-6">
              <p className="text-2xl font-black text-yellow-400">{s.value}</p>
              <p className="text-xs text-[#888] mt-1">{s.label}</p>
            </AdminCard>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminCard>
          <h2 className="font-semibold mb-3">Manage</h2>
          <ul className="flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-yellow-400 hover:text-yellow-300 flex justify-between"
                >
                  <span>{l.label}</span>
                  {l.count !== undefined && (
                    <span className="text-[#888]">{l.count}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard>
          <h2 className="font-semibold mb-2">Setup</h2>
          <p className="text-sm text-[#888] mb-4">
            First time? Run <code className="text-yellow-400/80">db/schema.sql</code> in
            Neon, then seed default content.
          </p>
          <AdminButton type="button" onClick={seed}>
            Seed default content
          </AdminButton>
          {seedMsg && <p className="text-xs text-green-400 mt-3">{seedMsg}</p>}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
