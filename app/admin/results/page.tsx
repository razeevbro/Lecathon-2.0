"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { ItemActions } from "@/components/admin/ItemActions";
import { adminJson, useAdminResource } from "@/components/admin/useAdminResource";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
} from "@/components/admin/admin-ui";

type ResultsTeamRow = {
  id: number;
  rank: number;
  team_name: string;
  college: string | null;
};

const emptyForm = {
  rank: "1",
  teamName: "",
  college: "",
};

export default function AdminResultsPage() {
  const { items, loading, msg, setMsg, load } =
    useAdminResource<ResultsTeamRow>("/api/admin/results");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const usedRanks = new Set(items.map((item) => item.rank));

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const data = await adminJson("/api/admin/results", "POST", {
      rank: Number(form.rank),
      teamName: form.teamName,
      college: form.college || null,
    });
    setMsg(data.success ? "Team added to top 10." : data.message || "Failed.");
    if (data.success) {
      setForm(emptyForm);
      load();
    }
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    setSaving(true);
    setMsg("");
    const data = await adminJson(`/api/admin/results/${editingId}`, "PATCH", {
      rank: Number(editForm.rank),
      teamName: editForm.teamName,
      college: editForm.college || null,
    });
    setSaving(false);
    setMsg(data.success ? "Team updated." : data.message || "Failed.");
    if (data.success) {
      setEditingId(null);
      load();
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Remove this team from the top 10 list?")) return;
    await adminJson(`/api/admin/results/${id}`, "DELETE");
    setMsg("Team removed.");
    load();
  };

  return (
    <AdminShell
      title="Top 10 Results"
      description="Manage the top 10 teams shown on the homepage when the results timer ends."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <AdminCard>
          <h2 className="font-semibold mb-4">Add team</h2>
          <form onSubmit={add} className="flex flex-col gap-3">
            <AdminSelect
              label="Rank *"
              value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })}
              required
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => (
                <option key={rank} value={rank} disabled={usedRanks.has(rank)}>
                  #{rank}
                  {usedRanks.has(rank) ? " (taken)" : ""}
                </option>
              ))}
            </AdminSelect>
            <AdminInput
              label="Team name *"
              value={form.teamName}
              onChange={(e) => setForm({ ...form, teamName: e.target.value })}
              required
            />
            <AdminInput
              label="College"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
            />
            <AdminButton type="submit" disabled={items.length >= 10}>
              {items.length >= 10 ? "Top 10 is full" : "Add team"}
            </AdminButton>
          </form>
        </AdminCard>

        <AdminCard>
          <h2 className="font-semibold mb-4">
            Current top 10 ({loading ? "…" : items.length}/10)
          </h2>
          {loading ? (
            <p className="text-sm text-[#888]">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-[#888]">
              No teams added yet. Add up to 10 teams before the reveal time set in
              Site Settings.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {[...items]
                .sort((a, b) => a.rank - b.rank)
                .map((team) => (
                  <li
                    key={team.id}
                    className="p-3 bg-[#111] rounded-lg border border-white/5"
                  >
                    {editingId === team.id ? (
                      <div className="flex flex-col gap-2 mb-3">
                        <AdminSelect
                          label="Rank"
                          value={editForm.rank}
                          onChange={(e) =>
                            setEditForm({ ...editForm, rank: e.target.value })
                          }
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (rank) => (
                              <option key={rank} value={rank}>
                                #{rank}
                              </option>
                            )
                          )}
                        </AdminSelect>
                        <AdminInput
                          label="Team name"
                          value={editForm.teamName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              teamName: e.target.value,
                            })
                          }
                        />
                        <AdminInput
                          label="College"
                          value={editForm.college}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              college: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="mb-2">
                        <p className="font-medium text-sm">
                          #{team.rank} — {team.team_name}
                        </p>
                        <p className="text-xs text-[#888]">
                          {team.college || "No college listed"}
                        </p>
                      </div>
                    )}
                    <ItemActions
                      editing={editingId === team.id}
                      onEdit={() => {
                        setEditingId(team.id);
                        setEditForm({
                          rank: String(team.rank),
                          teamName: team.team_name,
                          college: team.college ?? "",
                        });
                      }}
                      onCancel={() => setEditingId(null)}
                      onSave={saveEdit}
                      onDelete={() => remove(team.id)}
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
