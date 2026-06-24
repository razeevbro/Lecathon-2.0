export interface TeamMember {
  name: string;
  email: string;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  phone?: string;
  teamName?: string;
  college?: string;
  theme?: string;
  videoUrl?: string;
  projectDescription?: string;
  teamSize?: number;
  members?: TeamMember[];
}

export interface ValidatedRegistration {
  name: string;
  email: string;
  phone: string;
  teamName: string;
  college: string;
  theme: string;
  videoUrl: string;
  projectDescription: string;
  teamSize: number;
  members: TeamMember[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_PROJECT_DESCRIPTION_WORDS = 500;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

function isValidGoogleDriveUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    return host === "drive.google.com" || host === "docs.google.com";
  } catch {
    return false;
  }
}

export function validateRegistration(
  body: RegistrationPayload
): { ok: true; data: ValidatedRegistration } | { ok: false; message: string } {
  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const teamName = body.teamName?.trim();
  const college = body.college?.trim();
  const theme = body.theme?.trim() ?? "";
  const videoUrl = body.videoUrl?.trim() ?? "";
  const projectDescription = body.projectDescription?.trim() ?? "";

  if (!name) {
    return { ok: false, message: "Team leader name is required." };
  }
  if (!email || !isValidEmail(email)) {
    return { ok: false, message: "A valid team leader email is required." };
  }
  if (!phone) {
    return { ok: false, message: "Phone number is required." };
  }
  if (!teamName) {
    return { ok: false, message: "Team name is required." };
  }
  if (!college) {
    return { ok: false, message: "College / institution is required." };
  }
  if (!projectDescription) {
    return { ok: false, message: "Project description is required." };
  }
  const wordCount = countWords(projectDescription);
  if (wordCount > MAX_PROJECT_DESCRIPTION_WORDS) {
    return {
      ok: false,
      message: `Project description must be ${MAX_PROJECT_DESCRIPTION_WORDS} words or fewer (currently ${wordCount}).`,
    };
  }
  if (!videoUrl) {
    return { ok: false, message: "Google Drive video link is required." };
  }
  if (!isValidGoogleDriveUrl(videoUrl)) {
    return {
      ok: false,
      message:
        "Please paste a valid Google Drive link (https://drive.google.com/...).",
    };
  }

  const teamSize = Number(body.teamSize);
  if (!Number.isInteger(teamSize) || teamSize < 1 || teamSize > 4) {
    return { ok: false, message: "Team size must be between 1 and 4." };
  }

  const members = body.members ?? [];
  if (members.length !== teamSize) {
    return {
      ok: false,
      message: "Member details must match the selected team size.",
    };
  }

  for (let i = 0; i < members.length; i++) {
    const memberName = members[i]?.name?.trim();
    const memberEmail = members[i]?.email?.trim();
    if (!memberName) {
      return { ok: false, message: `Member ${i + 1} name is required.` };
    }
    if (!memberEmail || !isValidEmail(memberEmail)) {
      return { ok: false, message: `Member ${i + 1} must have a valid email.` };
    }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      teamName,
      college,
      theme,
      videoUrl,
      projectDescription,
      teamSize,
      members: members.map((m) => ({
        name: m.name.trim(),
        email: m.email.trim(),
      })),
    },
  };
}
