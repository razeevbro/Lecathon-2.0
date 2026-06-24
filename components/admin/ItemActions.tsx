import { AdminButton } from "@/components/admin/admin-ui";

export function ItemActions({
  editing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  saving,
}: {
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  saving?: boolean;
}) {
  if (editing) {
    return (
      <div className="flex flex-wrap gap-2 shrink-0">
        <AdminButton type="button" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </AdminButton>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 shrink-0">
      <AdminButton type="button" variant="ghost" onClick={onEdit}>
        Edit
      </AdminButton>
      <AdminButton type="button" variant="danger" onClick={onDelete}>
        Delete
      </AdminButton>
    </div>
  );
}
