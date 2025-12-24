import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service, { IService } from "@/models/Service";
import { getDefaultServiceTemplateForTitle } from "@/lib/service-template";

// GET all services
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Serialize ObjectIds to strings
    const serializedServices = services.map((service) => ({
      ...service,
      _id: service._id.toString(),
    }));

    return NextResponse.json({ success: true, data: serializedServices });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST create new service
export async function POST(request: NextRequest) {
  let service: IService | null = null;
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

    // Get the highest order value to set new service order
    const maxOrderService = await Service.findOne().sort({ order: -1 });
    const newOrder =
      order !== undefined ? order : (maxOrderService?.order ?? -1) + 1;

    // Initialize default template content
    const defaultTemplate = getDefaultServiceTemplateForTitle(title);
    const templateContent = JSON.stringify(defaultTemplate);

    // Create the service
    try {
      service = await Service.create({
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
    } catch (serviceError) {
      // If service creation fails, throw it up to outer catch
      throw serviceError;
    }

    if (!service || !service._id) {
      return NextResponse.json(
        { success: false, error: "Service creation failed" },
        { status: 500 }
      );
    }

    // Serialize the service document
    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service creation failed" },
        { status: 500 }
      );
    }

    const serializedService = {
      ...service.toObject(),
      _id: service._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: serializedService,
        message: `Service created successfully. Service page available at /services/${slug}`,
      },
      { status: 201 }
    );
  } catch (error) {
    // If service was created but page creation failed, clean up the service
    if (typeof service !== "undefined" && service && service._id) {
      try {
        await Service.findByIdAndDelete(service._id);
      } catch (cleanupError) {
        console.error("Error cleaning up service:", cleanupError);
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
    console.error("Service creation error:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
