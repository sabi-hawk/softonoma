import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";

// GET all pages
export async function GET() {
  try {
    await connectDB();
    const pages = await Page.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST create new page
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      slug,
      content,
      isPublished,
      order,
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImage,
      ogTitle,
      ogDescription,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Get the highest order value to set new page order
    const maxOrderPage = await Page.findOne().sort({ order: -1 });
    const newOrder =
      order !== undefined ? order : (maxOrderPage?.order ?? -1) + 1;

    const page = await Page.create({
      title,
      slug,
      content: content || "",
      isPublished: isPublished !== undefined ? isPublished : true,
      order: newOrder,
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImage,
      ogTitle,
      ogDescription,
    });

    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
