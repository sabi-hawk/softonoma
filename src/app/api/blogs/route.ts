import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog, { IBlog } from "@/models/Blog";

// GET all blogs
export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const serialized = blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST create new blog
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author,
      publishedAt,
      isPublished,
      order,
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImage,
      ogTitle,
      ogDescription,
      allowIndexing,
      metaHeaderTags,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const maxOrderBlog = await Blog.findOne().sort({ order: -1 });
    const newOrder =
      order === undefined ? (maxOrderBlog?.order ?? -1) + 1 : order;

    const blog: IBlog = await Blog.create({
      title,
      slug,
      content: content ?? "",
      excerpt: excerpt ?? "",
      coverImage: coverImage ?? "",
      author: author ?? "",
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      isPublished: isPublished === undefined ? true : isPublished,
      order: newOrder,
      seoTitle: seoTitle ?? "",
      seoDescription: seoDescription ?? "",
      seoKeywords: seoKeywords ?? "",
      ogImage: ogImage ?? "",
      ogTitle: ogTitle ?? "",
      ogDescription: ogDescription ?? "",
      allowIndexing: allowIndexing === undefined ? true : allowIndexing,
      metaHeaderTags: metaHeaderTags ?? "",
    });

    const serializedBlog = {
      ...blog.toObject(),
      _id: blog._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: serializedBlog,
        message: `Blog created. Edit at /admin/blog/${blog._id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name: string }).name === "ValidationError"
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
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
