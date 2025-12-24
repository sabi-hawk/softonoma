import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

// GET service by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const service = await Service.findById(id).lean();

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Serialize ObjectId to string
    const serializedService = {
      ...service,
      _id: service._id.toString(),
    };

    return NextResponse.json({ success: true, data: serializedService });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT update service by id
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
      "Updating service:",
      id,
      "with content length:",
      body.content?.length || 0
    );

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Verify content was saved - reload to ensure we get the latest
    const updatedService = await Service.findById(id).lean();
    console.log(
      "Service updated. Content length:",
      updatedService?.content?.length || 0,
      "Content preview:",
      updatedService?.content?.substring(0, 100) || "none"
    );

    // Serialize ObjectId to string
    const serializedService = {
      ...service.toObject(),
      _id: service._id.toString(),
    };

    return NextResponse.json({ success: true, data: serializedService });
  } catch (error) {
    console.error("Error updating service:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE service by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Service deletion - no sections to clean up anymore

    // Serialize ObjectId to string
    const serializedService = {
      ...service.toObject(),
      _id: service._id.toString(),
    };

    return NextResponse.json({ success: true, data: serializedService });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
