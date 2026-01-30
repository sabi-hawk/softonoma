import { NextRequest, NextResponse } from "next/server";
import {
  uploadFileToS3,
  deleteFileFromS3,
  extractKeyFromS3Url,
  getS3Url,
} from "@/lib/s3";
import { isAuthenticated } from "@/lib/auth";

/**
 * Sanitize filename for S3 upload
 * Preserves original filename while making it safe for S3
 * @param originalName - Original filename
 * @param folder - Optional folder path
 * @returns Sanitized filename with folder path
 */
function sanitizeFileName(originalName: string, folder?: string): string {
  // Extract name and extension
  const lastDotIndex = originalName.lastIndexOf(".");
  const nameWithoutExt =
    lastDotIndex > 0
      ? originalName.substring(0, lastDotIndex)
      : originalName;
  const extension =
    lastDotIndex > 0 ? originalName.substring(lastDotIndex) : "";

  // Sanitize the filename: remove/replace special characters
  // Keep alphanumeric, hyphens, underscores, and dots
  let sanitizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-") // Replace invalid chars with hyphens
    .replace(/[-]+/g, "-") // Replace multiple hyphens with single
    .replace(/^[-.]+|[-.]+$/g, ""); // Remove leading/trailing hyphens and dots

  // Ensure filename is not empty
  if (!sanitizedName) {
    sanitizedName = "file";
  }

  // Limit filename length (keep it reasonable for S3)
  if (sanitizedName.length > 100) {
    sanitizedName = sanitizedName.substring(0, 100);
  }

  // Add a short unique identifier to prevent collisions
  const timestamp = Date.now();
  const shortHash = Math.random().toString(36).substring(2, 8);
  const uniqueName = `${sanitizedName}-${timestamp}-${shortHash}${extension}`;

  // Return with folder if provided
  return folder ? `${folder}/${uniqueName}` : uniqueName;
}

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
    const oldFileKey = formData.get("oldFileKey") as string | null;
    const expectedType = formData.get("expectedType") as string | null; // "image" or "video"

    // Delete old file if provided (before uploading new one)
    if (oldFileKey) {
      try {
        // Extract key from URL if it's a full URL, otherwise use as-is
        const keyToDelete = extractKeyFromS3Url(oldFileKey) || oldFileKey;
        await deleteFileFromS3(keyToDelete);
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

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Sanitize and preserve original filename
      const fileName = sanitizeFileName(file.name, folder || undefined);

      // Upload to S3
      const result = await uploadFileToS3(buffer, fileName, file.type);

      if (!result.success || !result.key) {
        return NextResponse.json(
          { success: false, error: result.error || "Upload failed" },
          { status: 400 }
        );
      }

      // Return S3 key (not presigned URL - we'll generate those on-demand)
      // Store the S3 URL format for reference, but the key is what we'll use
      const s3Url = getS3Url(result.key);

      return NextResponse.json({
        success: true,
        key: result.key,
        url: s3Url, // Permanent public URL
      });
    }

    // Handle image URL upload
    if (imageUrl) {
      try {
        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
          return NextResponse.json(
            {
              success: false,
              error: `Failed to fetch image: ${response.statusText}`,
            },
            { status: 400 }
          );
        }

        // Get the image blob
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract filename from URL or use default
        const urlParts = imageUrl.split("/");
        const originalFileName =
          urlParts.at(-1)?.split("?")[0] || "image";

        // Sanitize and preserve original filename
        const fileName = sanitizeFileName(originalFileName, folder || undefined);

        // Upload to S3
        const result = await uploadFileToS3(
          buffer,
          fileName,
          blob.type || "image/jpeg"
        );

        if (!result.success || !result.key) {
          return NextResponse.json(
            { success: false, error: result.error || "Upload failed" },
            { status: 400 }
          );
        }

        const s3Url = getS3Url(result.key);

        return NextResponse.json({
          success: true,
          key: result.key,
          url: s3Url,
        });
      } catch (error) {
        console.error("Error uploading image from URL:", error);
        return NextResponse.json(
          {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to upload image from URL",
          },
          { status: 400 }
        );
      }
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
    const { fileKey, fileId } = body; // Support both fileKey (S3) and fileId (legacy Appwrite)

    // If fileId is provided (legacy Appwrite), we can't delete it anymore
    // But we'll try to extract key from it if it's actually an S3 URL
    let keyToDelete = fileKey;

    if (!keyToDelete && fileId) {
      // Try to extract key from what might be an S3 URL
      keyToDelete = extractKeyFromS3Url(fileId) || fileId;
    }

    if (!keyToDelete) {
      return NextResponse.json(
        { success: false, error: "File key is required" },
        { status: 400 }
      );
    }

    // Extract key from URL if it's a full URL
    const s3Key = extractKeyFromS3Url(keyToDelete) || keyToDelete;

    const result = await deleteFileFromS3(s3Key);

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
