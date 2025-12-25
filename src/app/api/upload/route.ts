import { NextRequest, NextResponse } from "next/server";
import { uploadFile, uploadImageFromUrl } from "@/lib/appwrite-upload";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const imageUrl = formData.get("imageUrl") as string | null;
    const folder = formData.get("folder") as string | null;
    const oldFileId = formData.get("oldFileId") as string | null;
    const expectedType = formData.get("expectedType") as string | null; // "image" or "video"

    // Delete old file if provided (before uploading new one)
    if (oldFileId) {
      try {
        const { deleteFile } = await import("@/lib/appwrite-upload");
        await deleteFile(oldFileId);
        // Don't fail if deletion fails, just log it
      } catch (error) {
        console.error("Error deleting old file:", error);
        // Continue with upload even if deletion fails
      }
    }

    // Handle file upload
    if (file) {
      // Server-side validation: Check file type matches expected type
      if (expectedType === "image" && !file.type.startsWith("image/")) {
        return NextResponse.json(
          { success: false, error: "Only image files are allowed" },
          { status: 400 }
        );
      }
      if (expectedType === "video" && !file.type.startsWith("video/")) {
        return NextResponse.json(
          { success: false, error: "Only video files are allowed" },
          { status: 400 }
        );
      }

      const result = await uploadFile(file, folder || undefined);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        fileId: result.fileId,
        url: result.url,
      });
    }

    // Handle image URL upload
    if (imageUrl) {
      const result = await uploadImageFromUrl(imageUrl, folder || undefined);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        fileId: result.fileId,
        url: result.url,
      });
    }

    return NextResponse.json(
      { success: false, error: "No file or image URL provided" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "File ID is required" },
        { status: 400 }
      );
    }

    const { deleteFile } = await import("@/lib/appwrite-upload");
    const result = await deleteFile(fileId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
