import { NextRequest, NextResponse } from "next/server";
import { saveRegistration } from "@/lib/db";
import { getEmailProviderLabel, sendRegistrationEmails } from "@/lib/email";
import { assertCanRegister } from "@/lib/registration-guards";
import {
  validateRegistration,
  type RegistrationPayload,
} from "@/lib/registration";
import { revalidatePublicSite } from "@/lib/revalidate-site";

export async function POST(req: NextRequest) {
  try {
    const body: RegistrationPayload = await req.json();
    const result = validateRegistration(body);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    const { data } = result;

    const guard = await assertCanRegister(req, data);
    if (!guard.ok) {
      return NextResponse.json(
        { success: false, message: guard.message },
        { status: guard.status }
      );
    }

    let id: string;

    try {
      const dbId = await saveRegistration(data);
      if (dbId != null) {
        id = `REG-${dbId}`;
      } else {
        console.log("New registration (no DATABASE_URL):", {
          ...data,
          registeredAt: new Date().toISOString(),
        });
        id = `REG-${Date.now()}`;
      }
    } catch (dbError) {
      console.error("Registration DB error:", dbError);
      return NextResponse.json(
        {
          success: false,
          message: "Could not save registration. Please try again later.",
        },
        { status: 503 }
      );
    }

    revalidatePublicSite();

    sendRegistrationEmails(data, id)
      .then((results) => {
        if (!results.admin.ok) {
          console.error("Admin notification email failed:", results.admin.error);
        }
        if (results.confirmation && !results.confirmation.ok) {
          console.error(
            "Confirmation email failed:",
            results.confirmation.error
          );
        }
      })
      .catch((err) => console.error("Registration email error:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! Check your email for a confirmation.",
        data: {
          id,
          name: data.name,
          email: data.email,
          teamName: data.teamName,
          registeredAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Lecathon 2.0 Registration API",
    endpoints: {
      POST: "/api/register — Submit team registration",
    },
    requiredFields: [
      "name",
      "email",
      "phone",
      "teamName",
      "college",
      "videoUrl",
      "teamSize",
      "members",
    ],
    optionalFields: ["theme"],
    persistence: process.env.DATABASE_URL
      ? "Neon Postgres (DATABASE_URL)"
      : "console log only — set DATABASE_URL to persist",
    email: getEmailProviderLabel(),
    emailSetup:
      "Gmail (no domain): SMTP_USER, SMTP_PASS, EMAIL_FROM, ADMIN_NOTIFICATION_EMAIL",
  });
}
