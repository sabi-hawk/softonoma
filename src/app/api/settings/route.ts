import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { verifyAuthToken } from "@/lib/auth";

function requireAdmin(request: NextRequest) {
  const payload = verifyAuthToken(request);
  if (!payload?.isAdmin) {
    return null;
  }
  return payload;
}

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  settings ??= await SiteSettings.create({ gtmId: "" });
  return settings;
}

/** GET site settings (admin only). */
export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    return NextResponse.json({
      success: true,
      data: { gtmId: settings.gtmId ?? "" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/** PUT update site settings (admin only). */
export async function PUT(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const body = await request.json();
    const gtmId = typeof body.gtmId === "string" ? body.gtmId.trim() : "";

    const settings = await getOrCreateSettings();
    settings.gtmId = gtmId;
    await settings.save();

    return NextResponse.json({
      success: true,
      data: { gtmId: settings.gtmId ?? "" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
