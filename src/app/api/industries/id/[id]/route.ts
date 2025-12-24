import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Industry from "@/models/Industry";

// GET industry by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const industry = await Industry.findById(id).lean();

    if (!industry) {
      return NextResponse.json(
        { success: false, error: "Industry not found" },
        { status: 404 }
      );
    }

    // Serialize ObjectId to string
    const serializedIndustry = {
      ...industry,
      _id: industry._id.toString(),
    };

    return NextResponse.json({ success: true, data: serializedIndustry });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT update industry by id
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Log the update for debugging
    console.log(
      "Updating industry:",
      id,
      "with content length:",
      body.content?.length || 0
    );

    const industry = await Industry.findByIdAndUpdate(
      id,
      { $set: body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!industry) {
      return NextResponse.json(
        { success: false, error: "Industry not found" },
        { status: 404 }
      );
    }

    // Verify content was saved - reload to ensure we get the latest
    const updatedIndustry = await Industry.findById(id).lean();
    console.log(
      "Industry updated. Content length:",
      updatedIndustry?.content?.length || 0,
      "Content preview:",
      updatedIndustry?.content?.substring(0, 100) || "none"
    );

    // Serialize ObjectId to string
    const serializedIndustry = {
      ...industry.toObject(),
      _id: industry._id.toString(),
    };

    return NextResponse.json({ success: true, data: serializedIndustry });
  } catch (error) {
    console.error("Error updating industry:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE industry by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const industry = await Industry.findByIdAndDelete(id);

    if (!industry) {
      return NextResponse.json(
        { success: false, error: "Industry not found" },
        { status: 404 }
      );
    }

    // Industry deletion - no sections to clean up anymore

    // Serialize ObjectId to string
    const serializedIndustry = {
      ...industry.toObject(),
      _id: industry._id.toString(),
    };

    return NextResponse.json({ success: true, data: serializedIndustry });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

