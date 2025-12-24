import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

// POST reorder services
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { services } = body;

    if (!Array.isArray(services)) {
      return NextResponse.json(
        { success: false, error: "Services array is required" },
        { status: 400 }
      );
    }

    // Update order for each service
    const updatePromises = services.map(
      ({ id, order }: { id: string; order: number }) =>
        Service.findByIdAndUpdate(id, { order }, { new: true })
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
