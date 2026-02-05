import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";

// GET industries listing page config
export async function GET() {
  try {
    await connectDB();
    const page = await Page.findOne({ slug: "industries" })
      .select("_id title slug templateType pageConfig seoTitle seoDescription seoKeywords ogImage ogTitle ogDescription metaHeaderTags allowIndexing isPublished")
      .lean();

    if (!page) {
      return NextResponse.json({
        success: true,
        data: {
          title: "Industries",
          slug: "industries",
          templateType: "industries-listing",
          pageConfig: {
            hero: {
              title: "",
              description: "",
              backgroundImage: "",
              backgroundColor: "",
              showHero: true,
            },
            display: {
              cardsPerRow: 4,
              cardStyle: "minimal",
              showDescriptions: false,
              showIcons: true,
            },
          },
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          ogImage: "",
          ogTitle: "",
          ogDescription: "",
          metaHeaderTags: "",
          allowIndexing: true,
          isPublished: true,
        },
      });
    }

    // Serialize ObjectId
    const serializedPage = {
      ...page,
      _id: page._id.toString(),
    };

    return NextResponse.json({ success: true, data: serializedPage });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT update industries listing page config
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Find or create the industries page
    let page = await Page.findOne({ slug: "industries" });

    if (!page) {
      // Get the highest order value to set new page order
      const maxOrderPage = await Page.findOne().sort({ order: -1 });
      const newOrder =
        maxOrderPage?.order !== undefined ? (maxOrderPage.order + 1) : 0;

      page = await Page.create({
        title: body.title || "Industries",
        slug: "industries",
        content: "",
        templateType: "industries-listing",
        pageConfig: body.pageConfig || {},
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
        order: newOrder,
        seoTitle: body.seoTitle || "",
        seoDescription: body.seoDescription || "",
        seoKeywords: body.seoKeywords || "",
        ogImage: body.ogImage || "",
        ogTitle: body.ogTitle || "",
        ogDescription: body.ogDescription || "",
        metaHeaderTags: body.metaHeaderTags || "",
        allowIndexing: body.allowIndexing !== undefined ? body.allowIndexing : true,
      });
    } else {
      // Update existing page
      page.title = body.title || page.title;
      page.templateType = "industries-listing";
      page.pageConfig = body.pageConfig || page.pageConfig || {};
      page.isPublished = body.isPublished !== undefined ? body.isPublished : page.isPublished;
      page.seoTitle = body.seoTitle !== undefined ? body.seoTitle : page.seoTitle;
      page.seoDescription = body.seoDescription !== undefined ? body.seoDescription : page.seoDescription;
      page.seoKeywords = body.seoKeywords !== undefined ? body.seoKeywords : page.seoKeywords;
      page.ogImage = body.ogImage !== undefined ? body.ogImage : page.ogImage;
      page.ogTitle = body.ogTitle !== undefined ? body.ogTitle : page.ogTitle;
      page.ogDescription = body.ogDescription !== undefined ? body.ogDescription : page.ogDescription;
      page.metaHeaderTags = body.metaHeaderTags !== undefined ? body.metaHeaderTags : page.metaHeaderTags;
      page.allowIndexing = body.allowIndexing !== undefined ? body.allowIndexing : page.allowIndexing;
      
      await page.save();
    }

    const serializedPage = {
      ...page.toObject(),
      _id: page._id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: serializedPage,
      message: "Industries listing page updated successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating industries listing page:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

