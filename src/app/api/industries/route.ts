import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Industry, { IIndustry } from "@/models/Industry";
import { getDefaultIndustryTemplateForTitle } from "@/lib/industry-template";

// GET all industries
export async function GET() {
  try {
    await connectDB();
    const industries = await Industry.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Serialize ObjectIds to strings
    const serializedIndustries = industries.map((industry) => ({
      ...industry,
      _id: industry._id.toString(),
    }));

    return NextResponse.json({ success: true, data: serializedIndustries });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST create new industry
export async function POST(request: NextRequest) {
  let industry: IIndustry | null = null;
  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      slug,
      description,
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

    // Get the highest order value to set new industry order
    const maxOrderIndustry = await Industry.findOne().sort({ order: -1 });
    const newOrder =
      order !== undefined ? order : (maxOrderIndustry?.order ?? -1) + 1;

    // Initialize default template content
    const defaultTemplate = getDefaultIndustryTemplateForTitle(title);
    const templateContent = JSON.stringify(defaultTemplate);

    // Create the industry
    try {
      industry = await Industry.create({
        title,
        slug,
        description: description || "",
        content: templateContent,
        isPublished: isPublished !== undefined ? isPublished : true,
        order: newOrder,
        seoTitle,
        seoDescription,
        seoKeywords,
        ogImage,
        ogTitle,
        ogDescription,
      });
    } catch (industryError) {
      // If industry creation fails, throw it up to outer catch
      throw industryError;
    }

    if (!industry || !industry._id) {
      return NextResponse.json(
        { success: false, error: "Industry creation failed" },
        { status: 500 }
      );
    }

    // Serialize the industry document
    const serializedIndustry = {
      ...industry.toObject(),
      _id: industry._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: serializedIndustry,
        message: `Industry created successfully. Industry page available at /industries/${slug}`,
      },
      { status: 201 }
    );
  } catch (error) {
    // If industry was created but something else failed, clean up the industry
    if (industry && industry._id) {
      try {
        await Industry.findByIdAndDelete(industry._id);
      } catch (cleanupError) {
        console.error("Error cleaning up industry:", cleanupError);
      }
    }

    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Handle Mongoose validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const mongooseError = error as {
        errors?: Record<string, { message: string }>;
      };
      const errorMessages = Object.values(mongooseError.errors || {}).map(
        (err) => err.message
      );
      return NextResponse.json(
        { success: false, error: errorMessages.join(", ") },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Industry creation error:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

