import ExcelJS from "exceljs";
import type { RegistrationRow } from "@/lib/types/site";

const MAX_MEMBER_COLUMNS = 4;

const SUMMARY_HEADERS = [
  "ID",
  "Registered At",
  "Team Leader",
  "Leader Email",
  "Phone",
  "Team Name",
  "College",
  "Theme",
  "Team Size",
  "Video",
] as const;

const FULL_HEADERS = [
  ...SUMMARY_HEADERS.slice(0, 8),
  "Video URL",
  "Project Description",
  "Team Size",
] as const;

function memberHeaders(): string[] {
  const headers: string[] = [];
  for (let i = 1; i <= MAX_MEMBER_COLUMNS; i += 1) {
    headers.push(`Member ${i} Name`, `Member ${i} Email`);
  }
  return headers;
}

export function getRegistrationExportHeaders(): string[] {
  return [...FULL_HEADERS, ...memberHeaders()];
}

function formatRegisteredAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kathmandu",
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Keeps Excel from turning phone numbers into scientific notation. */
function excelText(value: string): string {
  return value ? `\t${value}` : "";
}

function videoLabel(url: string | null): string {
  return url?.trim() ? "Provided" : "—";
}

export function registrationToSummaryRow(row: RegistrationRow): string[] {
  const values: string[] = [
    String(row.id),
    formatRegisteredAt(row.registeredAt),
    row.teamLeaderName,
    row.teamLeaderEmail,
    row.phone,
    row.teamName,
    row.college,
    row.theme ?? "",
    String(row.teamSize),
    videoLabel(row.videoUrl),
  ];

  for (let i = 0; i < MAX_MEMBER_COLUMNS; i += 1) {
    const member = row.members[i];
    values.push(member?.name ?? "", member?.email ?? "");
  }

  return values;
}

export function registrationToExportRow(row: RegistrationRow): string[] {
  const values: string[] = [
    String(row.id),
    formatRegisteredAt(row.registeredAt),
    row.teamLeaderName,
    row.teamLeaderEmail,
    row.phone,
    row.teamName,
    row.college,
    row.theme ?? "",
    row.videoUrl ?? "",
    row.projectDescription ?? "",
    String(row.teamSize),
  ];

  for (let i = 0; i < MAX_MEMBER_COLUMNS; i += 1) {
    const member = row.members[i];
    values.push(member?.name ?? "", member?.email ?? "");
  }

  return values;
}

export function registrationsToCsv(rows: RegistrationRow[]): string {
  const headers = getRegistrationExportHeaders();
  const lines = rows.map((row) => {
    const values = registrationToExportRow(row).map((value, index) => {
      if (index === 4) {
        return escapeCsvCell(excelText(value));
      }
      return escapeCsvCell(value);
    });
    return values.join(",");
  });

  const csv = [headers.join(","), ...lines].join("\r\n");
  return `\ufeff${csv}`;
}

function registrationCardHtml(row: RegistrationRow): string {
  const members = row.members
    .map(
      (member) =>
        `<li><strong>${escapeHtml(member.name)}</strong> — ${escapeHtml(member.email)}</li>`
    )
    .join("");

  const videoBlock = row.videoUrl?.trim()
    ? `<p><span class="label">Video pitch</span><br /><a href="${escapeHtml(row.videoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.videoUrl)}</a></p>`
    : `<p><span class="label">Video pitch</span><br />—</p>`;

  const projectBlock = row.projectDescription?.trim()
    ? `<div class="project"><span class="label">Project description</span><p>${escapeHtml(row.projectDescription).replace(/\n/g, "<br />")}</p></div>`
    : `<div class="project"><span class="label">Project description</span><p>—</p></div>`;

  return `
    <article class="card">
      <header class="card-header">
        <div>
          <h2>${escapeHtml(row.teamName)}</h2>
          <p class="meta">REG-${row.id} · ${escapeHtml(formatRegisteredAt(row.registeredAt))}</p>
        </div>
        <span class="badge">${escapeHtml(row.theme || "No theme")}</span>
      </header>
      <div class="grid">
        <div>
          <p><span class="label">Team leader</span><br />${escapeHtml(row.teamLeaderName)}</p>
          <p><span class="label">Email</span><br /><a href="mailto:${escapeHtml(row.teamLeaderEmail)}">${escapeHtml(row.teamLeaderEmail)}</a></p>
          <p><span class="label">Phone</span><br />${escapeHtml(row.phone)}</p>
        </div>
        <div>
          <p><span class="label">College</span><br />${escapeHtml(row.college)}</p>
          <p><span class="label">Team size</span><br />${row.teamSize}</p>
        </div>
      </div>
      <div>
        <span class="label">Members</span>
        <ul>${members}</ul>
      </div>
      ${videoBlock}
      ${projectBlock}
    </article>
  `;
}

export function registrationsToHtml(rows: RegistrationRow[]): string {
  const generatedAt = formatRegisteredAt(new Date().toISOString());
  const cards =
    rows.length > 0
      ? rows.map(registrationCardHtml).join("\n")
      : `<p class="empty">No registrations match the current export filters.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lecathon 2.0 Registrations</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: #f3f3f3;
      color: #111;
      line-height: 1.5;
    }
    .page {
      max-width: 920px;
      margin: 0 auto;
      padding: 32px 20px 48px;
    }
    .hero {
      background: #111;
      color: #fff;
      border-radius: 16px;
      padding: 24px 28px;
      margin-bottom: 24px;
    }
    .hero h1 {
      margin: 0 0 8px;
      font-size: 1.75rem;
    }
    .hero p {
      margin: 0;
      color: #d4d4d4;
      font-size: 0.95rem;
    }
    .hero .count {
      color: #facc15;
      font-weight: 700;
    }
    .card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 14px;
      padding: 22px 24px;
      margin-bottom: 18px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid #eee;
    }
    .card-header h2 {
      margin: 0 0 4px;
      font-size: 1.25rem;
    }
    .meta {
      margin: 0;
      color: #666;
      font-size: 0.85rem;
    }
    .badge {
      background: #fef9c3;
      color: #854d0e;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 6px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    .label {
      display: block;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 4px;
    }
    ul {
      margin: 8px 0 0;
      padding-left: 20px;
    }
    li { margin-bottom: 4px; }
    a { color: #2563eb; word-break: break-all; }
    .project {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    .project p {
      margin: 8px 0 0;
      white-space: pre-wrap;
    }
    .empty {
      background: #fff;
      border-radius: 14px;
      padding: 24px;
      text-align: center;
      color: #666;
    }
    @media print {
      body { background: #fff; }
      .page { max-width: none; padding: 0; }
      .hero { border-radius: 0; }
      .card {
        border: 1px solid #ccc;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="hero">
      <h1>Lecathon 2.0 — Registration Report</h1>
      <p><span class="count">${rows.length}</span> team${rows.length === 1 ? "" : "s"} · Generated ${escapeHtml(generatedAt)} (Nepal time)</p>
    </header>
    ${cards}
  </div>
</body>
</html>`;
}

const SUMMARY_COLUMN_WIDTHS = [
  8, 22, 20, 28, 16, 22, 28, 14, 10, 12,
  18, 28, 18, 28, 18, 28, 18, 28,
];

export async function registrationsToXlsx(
  rows: RegistrationRow[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Lecathon 2.0";
  workbook.created = new Date();

  const summaryHeaders = [...SUMMARY_HEADERS, ...memberHeaders()];
  const summarySheet = workbook.addWorksheet("Summary", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  summarySheet.addRow(summaryHeaders);
  const summaryHeaderRow = summarySheet.getRow(1);
  summaryHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  summaryHeaderRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1A1A1A" },
  };
  summaryHeaderRow.alignment = { vertical: "middle" };

  for (const row of rows) {
    const values = registrationToSummaryRow(row);
    const added = summarySheet.addRow(values);

    added.getCell(5).numFmt = "@";
    added.getCell(5).value = row.phone;
    added.alignment = { vertical: "middle", wrapText: false };
  }

  summaryHeaders.forEach((_, index) => {
    summarySheet.getColumn(index + 1).width =
      SUMMARY_COLUMN_WIDTHS[index] ?? 18;
  });

  summarySheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: summaryHeaders.length },
  };

  const detailsSheet = workbook.addWorksheet("Project Details");
  detailsSheet.addRow([
    "ID",
    "Team Name",
    "Team Leader",
    "Video URL",
    "Project Description",
  ]);

  const detailsHeaderRow = detailsSheet.getRow(1);
  detailsHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  detailsHeaderRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1A1A1A" },
  };

  for (const row of rows) {
    const added = detailsSheet.addRow([
      row.id,
      row.teamName,
      row.teamLeaderName,
      row.videoUrl ?? "",
      row.projectDescription ?? "",
    ]);
    added.getCell(5).alignment = { vertical: "top", wrapText: true };
    added.getCell(4).alignment = { vertical: "top", wrapText: false };
  }

  detailsSheet.getColumn(1).width = 8;
  detailsSheet.getColumn(2).width = 22;
  detailsSheet.getColumn(3).width = 20;
  detailsSheet.getColumn(4).width = 36;
  detailsSheet.getColumn(5).width = 64;

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
