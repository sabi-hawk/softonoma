import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";
import { getTemplate } from "@/lib/about-page-templates";

// POST apply template to a page
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { pageId, templateName } = body;

    if (!pageId) {
      return NextResponse.json(
        { success: false, error: "Page ID is required" },
        { status: 400 }
      );
    }

    // Get template
    const template = templateName ? getTemplate(templateName) : null;

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    // Delete existing sections for this page
    await Section.deleteMany({ pageId });

    // Create new sections from template
    const createdSections = [];
    for (const sectionData of template.sections) {
      const section = await Section.create({
        ...sectionData,
        pageId,
      });
      createdSections.push({
        ...section.toObject(),
        _id: section._id.toString(),
        pageId: pageId.toString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: createdSections,
      message: `Template "${template.name}" applied successfully`,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
