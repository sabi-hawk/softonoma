import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";

// POST reorder sections
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sections } = body; // Array of { id, order }

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { success: false, error: "Sections must be an array" },
        { status: 400 }
      );
    }

    // Update all sections with new order
    const updatePromises = sections.map(
      (section: { id: string; order: number }) =>
        Section.findByIdAndUpdate(
          section.id,
          { order: section.order },
          { new: true }
        )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
