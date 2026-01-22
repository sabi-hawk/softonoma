import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrl, extractKeyFromS3Url } from "@/lib/s3";
import { isAuthenticated } from "@/lib/auth";

/**
 * GET /api/s3/presigned-url
 * Generate a presigned URL for accessing a file from S3
 * Query params: url (S3 URL) or key (S3 key), expiresIn (optional, default: 3600 seconds)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");
    const key = searchParams.get("key");
    const expiresIn = parseInt(searchParams.get("expiresIn") || "3600", 10);

    if (!url && !key) {
      return NextResponse.json(
        { success: false, error: "Either 'url' or 'key' parameter is required" },
        { status: 400 }
      );
    }

    // Extract key from URL if URL is provided
    let s3Key = key;
    if (url && !s3Key) {
      const extractedKey = extractKeyFromS3Url(url);
      if (!extractedKey) {
        return NextResponse.json(
          { success: false, error: "Invalid S3 URL" },
          { status: 400 }
        );
      }
      s3Key = extractedKey;
    }

    if (!s3Key) {
      return NextResponse.json(
        { success: false, error: "Could not determine S3 key" },
        { status: 400 }
      );
    }

    const result = await getPresignedUrl(s3Key, expiresIn);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error("Presigned URL error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
