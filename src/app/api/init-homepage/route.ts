import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";

// GET - Initialize empty homepage page
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Check if home page already exists
    const homePage = await Page.findOne({
      $or: [{ slug: "home" }, { slug: "" }],
    });

    if (homePage) {
      // If homepage already exists, redirect to admin panel
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Create empty home page - user will add sections themselves
    await Page.create({
      title: "Home",
      slug: "home",
      content: "",
      isPublished: true,
      order: 0,
    });

    // Redirect to admin panel after successful creation
    return NextResponse.redirect(new URL("/admin", request.url));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

