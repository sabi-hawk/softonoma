import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Industry from "@/models/Industry";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { industries } = body;

    if (!Array.isArray(industries)) {
      return NextResponse.json(
        { success: false, error: "Industries array is required" },
        { status: 400 }
      );
    }

    // Update order for each industry
    const updatePromises = industries.map((item: { id: string; order: number }) =>
      Industry.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

