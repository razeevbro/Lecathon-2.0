import ExcelJS from "exceljs";
import type { RegistrationRow } from "@/lib/types/site";

const MAX_MEMBER_COLUMNS = 4;

const BASE_HEADERS = [
  "ID",
  "Registered At",
  "Team Leader",
  "Leader Email",
  "Phone",
  "Team Name",
  "College",
  "Theme",
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
  return [...BASE_HEADERS, ...memberHeaders()];
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

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Keeps Excel from turning phone numbers into scientific notation. */
function excelText(value: string): string {
  return value ? `\t${value}` : "";
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

const COLUMN_WIDTHS = [
  8, 22, 20, 28, 16, 22, 28, 14, 36, 48, 10,
  18, 28, 18, 28, 18, 28, 18, 28,
];

export async function registrationsToXlsx(
  rows: RegistrationRow[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Lecathon 2.0";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Registrations", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  const headers = getRegistrationExportHeaders();
  sheet.addRow(headers);

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1A1A1A" },
  };
  headerRow.alignment = { vertical: "middle", wrapText: true };

  for (const row of rows) {
    const values = registrationToExportRow(row);
    const added = sheet.addRow(values);

    added.getCell(5).numFmt = "@";
    added.getCell(5).value = row.phone;

    added.alignment = { vertical: "top", wrapText: true };
  }

  headers.forEach((_, index) => {
    const column = sheet.getColumn(index + 1);
    column.width = COLUMN_WIDTHS[index] ?? 18;
  });

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
