import {
  uploadFileToS3,
  deleteFileFromS3,
  getS3Url,
  extractKeyFromS3Url,
} from "./s3";

export interface UploadResult {
  success: boolean;
  key?: string;
  url?: string;
  error?: string;
}

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

/**
 * Upload a file to S3
 * @param file - File object to upload
 * @param folder - Optional folder path within the bucket
 * @returns Upload result with key and URL
 */
export async function uploadFile(
  file: File,
  folder?: string
): Promise<UploadResult> {
  try {
    // Sanitize and preserve original filename
    const fileName = sanitizeFileName(file.name, folder);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const result = await uploadFileToS3(buffer, fileName, file.type);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to upload file",
      };
    }

    // Return permanent S3 URL (files are uploaded with public-read ACL)
    const url = getS3Url(result.key!);

    return {
      success: true,
      key: result.key,
      url,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}

/**
 * Delete a file from S3
 * @param key - S3 object key or URL
 * @returns Success status
 */
export async function deleteFile(keyOrUrl: string): Promise<UploadResult> {
  try {
    // Extract key from URL if it's a URL
    let key = keyOrUrl;
    const extractedKey = extractKeyFromS3Url(keyOrUrl);
    if (extractedKey) {
      key = extractedKey;
    }

    const result = await deleteFileFromS3(key);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to delete file",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
}

/**
 * Upload image from URL (downloads and uploads to S3)
 * @param imageUrl - URL of the image to download
 * @param folder - Optional folder path within the bucket
 * @returns Upload result
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  folder?: string
): Promise<UploadResult> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch image: ${response.statusText}`,
      };
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
    const fileName = sanitizeFileName(originalFileName, folder);

    // Upload to S3
    const result = await uploadFileToS3(buffer, fileName, blob.type);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to upload image",
      };
    }

    // Return S3 URL
    const url = getS3Url(result.key!);

    return {
      success: true,
      key: result.key,
      url,
    };
  } catch (error) {
    console.error("Error uploading image from URL:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload image from URL",
    };
  }
}

/**
 * Extract S3 key from URL
 * @param url - S3 file URL
 * @returns S3 key or null if URL is not from S3
 */
export function extractKeyFromUrl(url: string): string | null {
  return extractKeyFromS3Url(url);
}
