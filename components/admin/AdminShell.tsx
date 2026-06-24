"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Layers,
  Calendar,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/registrations", label: "Registrations", icon: Users },
  { href: "/admin/sponsors", label: "Sponsors", icon: Building2 },
  { href: "/admin/themes", label: "Problem Themes", icon: Layers },
  { href: "/admin/schedule", label: "Schedule", icon: Calendar },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

function SidebarContent({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-sm">
            Leca<span className="text-yellow-400">thon</span> CMS
          </p>
          <p className="text-[10px] text-[#888] mt-1 uppercase tracking-wider">
            Admin Dashboard
          </p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="lg:hidden p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-white/5"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-yellow-400/15 text-yellow-400"
                  : "text-[#aaa] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-2 px-3 py-2 text-xs text-[#888] hover:text-white rounded-lg hover:bg-white/5"
        >
          <ExternalLink size={14} />
          View live site
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs text-[#888] hover:text-red-400 rounded-lg hover:bg-white/5 w-full text-left"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>
    </>
  );
}

export default function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-[#0a0a0a]">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="p-2 -ml-2 rounded-lg text-[#aaa] hover:text-white hover:bg-white/5"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <p className="font-bold text-sm truncate">
          Leca<span className="text-yellow-400">thon</span> CMS
        </p>
        <Link
          href="/"
          target="_blank"
          className="p-2 -mr-2 rounded-lg text-[#888] hover:text-white hover:bg-white/5"
          aria-label="View live site"
        >
          <ExternalLink size={18} />
        </Link>
      </div>

      {navOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setNavOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <div className="flex min-h-[calc(100vh-53px)] lg:min-h-screen">
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 max-w-[85vw] shrink-0 border-r border-white/10 bg-[#0a0a0a] flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            pathname={pathname}
            onNavigate={() => setNavOpen(false)}
            onLogout={logout}
          />
        </aside>

        <main className="flex-1 min-w-0 w-full overflow-auto">
          <header className="border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-sm text-[#888] mt-1">{description}</p>
            )}
          </header>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
