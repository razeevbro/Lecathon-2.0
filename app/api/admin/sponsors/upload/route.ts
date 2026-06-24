import { NextRequest, NextResponse } from "next/server";
import { saveSponsorLogo, validateSponsorLogoFile } from "@/lib/sponsor-logo-upload";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "Please choose a logo image to upload." },
        { status: 400 }
      );
    }

    const validation = validateSponsorLogoFile(file);
    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    const url = await saveSponsorLogo(file);
    return NextResponse.json({ success: true, url });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to upload logo.",
      },
      { status: 500 }
    );
  }
}
