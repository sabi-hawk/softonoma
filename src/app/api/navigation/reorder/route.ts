import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Service from "@/models/Service";
import Industry from "@/models/Industry";

// POST reorder navigation items (pages, services dropdown, industries dropdown)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { items } = body; // Array of { type: 'page' | 'services' | 'industries', id?: string, navOrder: number }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Items must be an array" },
        { status: 400 }
      );
    }

    // Update all navigation items with new navOrder
    const updatePromises = items.map(
      async (item: {
        type: "page" | "services" | "industries";
        id?: string;
        navOrder: number;
      }) => {
        if (item.type === "page" && item.id) {
          return Page.findByIdAndUpdate(
            item.id,
            { order: item.navOrder },
            { new: true }
          );
        } else if (item.type === "services") {
          // Update all published services with the same navOrder
          return Service.updateMany(
            { isPublished: true },
            { navOrder: item.navOrder }
          );
        } else if (item.type === "industries") {
          // Update all published industries with the same navOrder
          return Industry.updateMany(
            { isPublished: true },
            { navOrder: item.navOrder }
          );
        }
      }
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
