import test from "node:test";
import assert from "node:assert/strict";
import {
  getRegistrationExportHeaders,
  registrationToExportRow,
  registrationsToCsv,
} from "../lib/registrations-export.ts";

test("export headers include separate member columns", () => {
  const headers = getRegistrationExportHeaders();
  assert.ok(headers.includes("Member 1 Name"));
  assert.ok(headers.includes("Member 4 Email"));
  assert.equal(headers.length, 19);
});

test("export row splits members into columns", () => {
  const row = registrationToExportRow({
    id: 1,
    teamLeaderName: "Amit",
    teamLeaderEmail: "amit@test.com",
    phone: "9841234567",
    teamName: "Team Alpha",
    college: "LEMSC",
    theme: "Open Theme",
    videoUrl: "https://drive.google.com/file/1",
    projectDescription: "A smart campus app.",
    teamSize: 2,
    members: [
      { name: "Amit", email: "amit@test.com" },
      { name: "Sam", email: "sam@test.com" },
    ],
    registeredAt: "2026-06-27T10:30:00.000Z",
  });

  assert.equal(row[4], "9841234567");
  assert.equal(row[11], "Amit");
  assert.equal(row[12], "amit@test.com");
  assert.equal(row[13], "Sam");
  assert.equal(row[14], "sam@test.com");
});

test("csv prefixes phone with tab and includes utf-8 bom", () => {
  const csv = registrationsToCsv([
    {
      id: 2,
      teamLeaderName: "Leader",
      teamLeaderEmail: "leader@test.com",
      phone: "9800000000",
      teamName: "Beta",
      college: "College",
      theme: null,
      videoUrl: null,
      projectDescription: null,
      teamSize: 1,
      members: [{ name: "Leader", email: "leader@test.com" }],
      registeredAt: "2026-06-27T10:30:00.000Z",
    },
  ]);

  assert.ok(csv.startsWith("\ufeff"));
  assert.match(csv, /"\t9800000000"/);
});
