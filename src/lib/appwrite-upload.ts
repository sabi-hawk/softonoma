import { storage, getBucketId } from "./appwrite";
import { ID } from "appwrite";

export interface UploadResult {
  success: boolean;
  fileId?: string;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Appwrite Storage
 * @param file - File object to upload
 * @param folder - Optional folder path within the bucket
 * @returns Upload result with file ID and URL
 */
export async function uploadFile(
  file: File,
  folder?: string
): Promise<UploadResult> {
  try {
    const bucketId = getBucketId();

    if (!bucketId) {
      return {
        success: false,
        error:
          "Appwrite bucket ID is not configured. Please set APPWRITE_BUCKET_ID in your environment variables.",
      };
    }

    // Generate unique file name for the File object
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = folder
      ? `${folder}/${timestamp}-${randomString}.${fileExtension}`
      : `${timestamp}-${randomString}.${fileExtension}`;

    // Create a new File object with the desired name
    const renamedFile = new File([file], fileName, { type: file.type });

    // Upload file
    const uploadedFile = await storage.createFile(
      bucketId,
      ID.unique(),
      renamedFile
    );

    // Get file URL
    const fileUrl = storage.getFileView(bucketId, uploadedFile.$id);

    return {
      success: true,
      fileId: uploadedFile.$id,
      url: fileUrl.toString(),
    };
  } catch (error) {
    console.error("Error uploading file to Appwrite:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}

/**
 * Delete a file from Appwrite Storage
 * @param fileId - ID of the file to delete
 * @returns Success status
 */
export async function deleteFile(fileId: string): Promise<UploadResult> {
  try {
    const bucketId = getBucketId();

    if (!bucketId) {
      return {
        success: false,
        error: "Appwrite bucket ID is not configured.",
      };
    }

    await storage.deleteFile(bucketId, fileId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting file from Appwrite:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
}

/**
 * Get file URL from Appwrite Storage
 * @param fileId - ID of the file
 * @returns File URL
 */
export function getFileUrl(fileId: string): string {
  const bucketId = getBucketId();
  if (!bucketId) {
    return "";
  }
  return storage.getFileView(bucketId, fileId).toString();
}

/**
 * Extract file ID from Appwrite file URL
 * @param url - Appwrite file URL
 * @returns File ID or null if URL is not from Appwrite
 */
export function extractFileIdFromUrl(url: string): string | null {
  try {
    // Appwrite file URLs typically look like:
    // https://cloud.appwrite.io/v1/storage/buckets/{bucketId}/files/{fileId}/view
    // or http://localhost/v1/storage/buckets/{bucketId}/files/{fileId}/view

    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Find the index of "files" in the path
    const filesIndex = pathParts.indexOf("files");

    if (filesIndex !== -1 && filesIndex + 1 < pathParts.length) {
      const fileId = pathParts[filesIndex + 1];
      // Verify it's a valid file ID (Appwrite IDs are typically 20+ characters)
      if (fileId && fileId.length > 10) {
        return fileId;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Upload image from URL (downloads and uploads to Appwrite)
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

    // Extract filename from URL or use default
    const urlParts = imageUrl.split("/");
    const originalFileName =
      urlParts[urlParts.length - 1].split("?")[0] || "image";

    // Create a File object from the blob
    const file = new File([blob], originalFileName, { type: blob.type });

    // Upload to Appwrite
    return await uploadFile(file, folder);
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
