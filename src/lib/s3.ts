import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client with credentials from environment variables
// These should be set in your .env.local file (server-side only)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Get bucket name from environment
export const getBucketName = (): string => {
  return process.env.AWS_S3_BUCKET_NAME || "";
};

// Get S3 base URL (for constructing file URLs)
export const getS3BaseUrl = (): string => {
  const bucketName = getBucketName();
  const region = process.env.AWS_REGION || "us-east-1";
  return `https://${bucketName}.s3.${region}.amazonaws.com`;
};

/**
 * Upload a file to S3
 * @param file - File buffer or stream
 * @param key - S3 object key (path/filename)
 * @param contentType - MIME type of the file
 * @returns Success status and file key
 */
export async function uploadFileToS3(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<{ success: boolean; key?: string; error?: string }> {
  try {
    const bucketName = getBucketName();

    if (!bucketName) {
      return {
        success: false,
        error:
          "AWS S3 bucket name is not configured. Please set AWS_S3_BUCKET_NAME in your environment variables.",
      };
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      // Note: ACL is not used - bucket policies handle public access
      // Make sure your bucket policy allows public read access
    });

    await s3Client.send(command);

    return {
      success: true,
      key,
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
 * @param key - S3 object key (path/filename)
 * @returns Success status
 */
export async function deleteFileFromS3(
  key: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const bucketName = getBucketName();

    if (!bucketName) {
      return {
        success: false,
        error: "AWS S3 bucket name is not configured.",
      };
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);

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
 * Generate a presigned URL for reading a file from S3
 * Presigned URLs are temporary and expire after the specified duration
 * @param key - S3 object key (path/filename)
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const bucketName = getBucketName();

    if (!bucketName) {
      return {
        success: false,
        error: "AWS S3 bucket name is not configured.",
      };
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate presigned URL",
    };
  }
}

/**
 * Extract S3 key from S3 URL
 * @param url - S3 file URL
 * @returns S3 key or null if URL is not from S3
 */
export function extractKeyFromS3Url(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const bucketName = getBucketName();
    const region = process.env.AWS_REGION || "us-east-1";

    // Check if it's an S3 URL format: https://bucket.s3.region.amazonaws.com/key
    if (
      urlObj.hostname === `${bucketName}.s3.${region}.amazonaws.com` ||
      urlObj.hostname === `s3.${region}.amazonaws.com` ||
      urlObj.hostname.includes("s3")
    ) {
      // Remove leading slash from pathname
      return urlObj.pathname.substring(1);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get permanent public URL for an S3 object
 * Files are publicly accessible via bucket policy (not ACLs)
 * @param key - S3 object key
 * @returns Permanent public URL
 */
export function getS3Url(key: string): string {
  const bucketName = getBucketName();
  const region = process.env.AWS_REGION || "us-east-1";
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * Check if a URL is an S3 URL from our bucket
 * @param url - URL to check
 * @returns true if it's an S3 URL from our bucket
 */
export function isS3Url(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const bucketName = getBucketName();
    const region = process.env.AWS_REGION || "us-east-1";
    return (
      urlObj.hostname === `${bucketName}.s3.${region}.amazonaws.com` ||
      urlObj.hostname === `s3.${region}.amazonaws.com` ||
      (urlObj.hostname.includes("s3") && urlObj.hostname.includes(region))
    );
  } catch {
    return false;
  }
}