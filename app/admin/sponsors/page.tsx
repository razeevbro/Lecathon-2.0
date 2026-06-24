"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import EmptyCmsHint from "@/components/admin/EmptyCmsHint";
import { ItemActions } from "@/components/admin/ItemActions";
import {
  SponsorLogoUpload,
  resolveSponsorLogoUrl,
} from "@/components/admin/SponsorLogoUpload";
import {
  adminJson,
  useAdminResource,
} from "@/components/admin/useAdminResource";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
} from "@/components/admin/admin-ui";
import {
  SPONSOR_TIERS,
  SPONSOR_TIER_LABELS,
  type SponsorTier,
} from "@/lib/sponsor-tiers";

type SponsorRow = {
  id: number;
  name: string;
  logo_url: string | null;
  logo_text: string | null;
  website_url: string | null;
  tier: string;
  sort_order: number;
};

const emptyForm = {
  name: "",
  logoUrl: "",
  logoText: "",
  websiteUrl: "",
  tier: "supporting_partner" as SponsorTier,
  sortOrder: "0",
};

function TierSelect({
  value,
  onChange,
}: {
  value: SponsorTier;
  onChange: (tier: SponsorTier) => void;
}) {
  return (
    <AdminSelect
      label="Sponsor tier *"
      value={value}
      onChange={(e) => onChange(e.target.value as SponsorTier)}
      required
    >
      {SPONSOR_TIERS.map((tier) => (
        <option key={tier} value={tier}>
          {SPONSOR_TIER_LABELS[tier]}
        </option>
      ))}
    </AdminSelect>
  );
}

export default function AdminSponsorsPage() {
  const { items, loading, msg, setMsg, load } =
    useAdminResource<SponsorRow>("/api/admin/sponsors");
  const [form, setForm] = useState(emptyForm);
  const [addLogoFile, setAddLogoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const seedDefaults = async () => {
    setSeeding(true);
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const data = await res.json();
    setSeeding(false);
    setMsg(data.message || (data.success ? "Defaults loaded." : "Seed failed."));
    if (data.success) load();
  };

  const startEdit = (s: SponsorRow) => {
    setEditingId(s.id);
    setEditLogoFile(null);
    setEditForm({
      name: s.name,
      logoUrl: s.logo_url ?? "",
      logoText: s.logo_text ?? "",
      websiteUrl: s.website_url ?? "",
      tier: (s.tier as SponsorTier) || "supporting_partner",
      sortOrder: String(s.sort_order),
    });
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      const logoUrl = await resolveSponsorLogoUrl({
        newFile: addLogoFile,
        requireLogo: true,
      });
      const data = await adminJson("/api/admin/sponsors", "POST", {
        name: form.name,
        logoUrl,
        logoText: form.logoText || form.name,
        websiteUrl: form.websiteUrl || null,
        tier: form.tier,
        sortOrder: Number(form.sortOrder),
      });
      if (data.success) {
        setForm(emptyForm);
        setAddLogoFile(null);
        setMsg("Sponsor added. Public site updated.");
        load();
      } else {
        setMsg(data.message || "Failed.");
      }
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Failed to add sponsor.");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    setSaving(true);
    setMsg("");
    try {
      const logoUrl = await resolveSponsorLogoUrl({
        existingUrl: editForm.logoUrl,
        newFile: editLogoFile,
      });
      const data = await adminJson(`/api/admin/sponsors/${editingId}`, "PATCH", {
        name: editForm.name,
        logoUrl,
        logoText: editForm.logoText || editForm.name,
        websiteUrl: editForm.websiteUrl || null,
        tier: editForm.tier,
        sortOrder: Number(editForm.sortOrder),
      });
      if (data.success) {
        setEditingId(null);
        setEditLogoFile(null);
        setMsg("Sponsor updated.");
        load();
      } else {
        setMsg(data.message || "Failed.");
      }
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Failed to update sponsor.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this sponsor?")) return;
    await adminJson(`/api/admin/sponsors/${id}`, "DELETE");
    setMsg("Sponsor deleted.");
    load();
  };

  return (
    <AdminShell
      title="Sponsors"
      description="Add, edit, or remove partners on the landing page."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <AdminCard>
          <h2 className="font-semibold mb-4">Add sponsor</h2>
          <form onSubmit={add} className="flex flex-col gap-3">
            <AdminInput
              label="Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <TierSelect
              value={form.tier}
              onChange={(tier) => setForm({ ...form, tier })}
            />
            <SponsorLogoUpload
              label="Logo image *"
              onChange={setAddLogoFile}
            />
            <AdminInput
              label="Logo alt text (optional)"
              value={form.logoText}
              onChange={(e) => setForm({ ...form, logoText: e.target.value })}
              placeholder="Shown if image fails to load"
            />
            <AdminInput
              label="Website URL"
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              placeholder="https://..."
            />
            <AdminInput
              label="Sort order"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
            <AdminButton type="submit" disabled={saving}>
              {saving ? "Uploading…" : "Add sponsor"}
            </AdminButton>
          </form>
        </AdminCard>

        <AdminCard>
          <h2 className="font-semibold mb-4">
            Current sponsors ({loading ? "…" : items.length})
          </h2>
          {loading ? (
            <p className="text-sm text-[#888]">Loading…</p>
          ) : !loading && items.length === 0 ? (
            <EmptyCmsHint
              label="sponsors"
              onSeed={seedDefaults}
              seeding={seeding}
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((s) => (
                <li
                  key={s.id}
                  className="p-3 bg-[#111] rounded-lg border border-white/5"
                >
                  {editingId === s.id ? (
                    <div className="flex flex-col gap-2 mb-3">
                      <AdminInput
                        label="Name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                      <TierSelect
                        value={editForm.tier}
                        onChange={(tier) =>
                          setEditForm({ ...editForm, tier })
                        }
                      />
                      <SponsorLogoUpload
                        label="Logo image"
                        currentUrl={editForm.logoUrl || undefined}
                        onChange={setEditLogoFile}
                      />
                      <AdminInput
                        label="Logo alt text"
                        value={editForm.logoText}
                        onChange={(e) =>
                          setEditForm({ ...editForm, logoText: e.target.value })
                        }
                      />
                      <AdminInput
                        label="Website"
                        value={editForm.websiteUrl}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            websiteUrl: e.target.value,
                          })
                        }
                      />
                      <AdminInput
                        label="Sort order"
                        type="number"
                        value={editForm.sortOrder}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            sortOrder: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="mb-2 min-w-0 flex gap-3 items-start">
                      {s.logo_url ? (
                        <img
                          src={s.logo_url}
                          alt={s.logo_text || s.name}
                          className="w-12 h-12 object-contain rounded bg-[#0a0a0a] border border-white/10 p-1 shrink-0"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="font-medium break-words">{s.name}</p>
                        <p className="text-xs text-[#888]">
                          {SPONSOR_TIER_LABELS[s.tier as SponsorTier] ||
                            "Supporting Partner"}{" "}
                          · {s.logo_url ? "Logo uploaded" : s.logo_text || "No logo"} · order{" "}
                          {s.sort_order}
                        </p>
                      </div>
                    </div>
                  )}
                  <ItemActions
                    editing={editingId === s.id}
                    onEdit={() => startEdit(s)}
                    onCancel={() => {
                      setEditingId(null);
                      setEditLogoFile(null);
                    }}
                    onSave={saveEdit}
                    onDelete={() => remove(s.id)}
                    saving={saving}
                  />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
      {msg && <p className="text-xs text-yellow-400 mt-4">{msg}</p>}
    </AdminShell>
  );
}
