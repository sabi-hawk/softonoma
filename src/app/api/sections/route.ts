import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Section, { ISectionContent, ISection } from "@/models/Section";
import mongoose from "mongoose";

// GET all sections, optionally filtered by pageId or serviceId
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");
    const serviceId = searchParams.get("serviceId");

    const query: { pageId?: string; serviceId?: string } = {};
    if (pageId) query.pageId = pageId;
    if (serviceId) query.serviceId = serviceId;

    const sections = await Section.find(query).sort({ order: 1 }).lean();

    // Convert ObjectIds to strings
    const serializedSections = sections.map((section) => ({
      ...section,
      _id: section._id.toString(),
      pageId: section.pageId ? section.pageId.toString() : undefined,
      serviceId: section.serviceId ? section.serviceId.toString() : undefined,
    }));

    return NextResponse.json({ success: true, data: serializedSections });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST create new section
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { pageId, serviceId, type, content, order, isActive } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Section type is required" },
        { status: 400 }
      );
    }

    if (!pageId && !serviceId) {
      return NextResponse.json(
        { success: false, error: "Either Page ID or Service ID is required" },
        { status: 400 }
      );
    }

    const sectionData: {
      pageId?: string | mongoose.Types.ObjectId;
      serviceId?: string | mongoose.Types.ObjectId;
      type: string;
      content: ISectionContent;
      order: number;
      isActive: boolean;
    } = {
      type,
      content: (content || {}) as ISectionContent,
      order: order ?? 0,
      isActive: isActive !== undefined ? isActive : true,
    };

    if (pageId) sectionData.pageId = pageId;
    if (serviceId) sectionData.serviceId = serviceId;

    // Create section - Mongoose will handle ObjectId conversion from strings
    // Using type assertion to tell TypeScript this is a single document creation
    const section = (await Section.create([sectionData]))[0] as ISection & {
      _id: mongoose.Types.ObjectId;
    };

    // Convert to plain object and serialize ObjectIds
    const serializedSection = {
      ...section.toObject(),
      _id: section._id.toString(),
      pageId: section.pageId ? section.pageId.toString() : undefined,
      serviceId: section.serviceId ? section.serviceId.toString() : undefined,
    };

    return NextResponse.json(
      { success: true, data: serializedSection },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
