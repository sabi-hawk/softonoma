import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";

// POST - Fix existing homepage to set templateType
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Find homepage by slug
    const homePage = await Page.findOne({
      $or: [{ slug: "home" }, { slug: "" }],
    });

    if (!homePage) {
      return NextResponse.json(
        {
          success: false,
          message: "Homepage not found",
        },
        { status: 404 }
      );
    }

    // Update templateType to homepage
    homePage.templateType = "homepage";
    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Homepage templateType updated successfully",
      page: {
        id: homePage._id.toString(),
        title: homePage.title,
        slug: homePage.slug,
        templateType: homePage.templateType,
      },
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
