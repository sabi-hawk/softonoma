import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";

// PUT update section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const section = await Section.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }

    // Serialize ObjectIds
    const serializedSection = {
      ...section,
      _id: section._id.toString(),
      pageId: section.pageId ? section.pageId.toString() : undefined,
      serviceId: section.serviceId ? section.serviceId.toString() : undefined,
    };

    return NextResponse.json({ success: true, data: serializedSection });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const section = await Section.findByIdAndDelete(id);

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }

    // Serialize ObjectIds
    const serializedSection = {
      ...section.toObject(),
      _id: section._id.toString(),
      pageId: section.pageId ? section.pageId.toString() : undefined,
      serviceId: section.serviceId ? section.serviceId.toString() : undefined,
    };

    return NextResponse.json({ success: true, data: serializedSection });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
