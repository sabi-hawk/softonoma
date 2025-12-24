import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";

// POST reorder pages
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { pages } = body; // Array of { id, order }

    if (!Array.isArray(pages)) {
      return NextResponse.json(
        { success: false, error: "Pages must be an array" },
        { status: 400 }
      );
    }

    // Update all pages with new order
    const updatePromises = pages.map(
      (page: { id: string; order: number }) =>
        Page.findByIdAndUpdate(
          page.id,
          { order: page.order },
          { new: true }
        )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

