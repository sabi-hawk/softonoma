"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  folder?: string;
  type?: "image" | "video";
  className?: string;
}

// Helper function to extract S3 key from URL or return the key if it's already a key
function extractS3KeyFromUrl(url: string): string | null {
  try {
    // If it's already a key (no http/https), return as-is
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return url;
    }

    const urlObj = new URL(url);
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "";
    const region = process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1";

    // Check if it's an S3 URL
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
    // If URL parsing fails, might be a key already
    return url.includes("/") || url.includes(".") ? url : null;
  }
}

function getDisplayUrl(urlOrKey: string): string {
  return getImageUrl(urlOrKey);
}

export default function FileUpload({
  label,
  value,
  onChange,
  accept,
  folder,
  type = "image",
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string>(value || "");
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set client-side flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update previous value and preview when value prop changes (but not from our own upload)
  useEffect(() => {
    if (!isClient) return; // Only run on client to prevent hydration issues
    
    if (value !== previousValue) {
      setPreviousValue(value || "");
      // Use permanent URL directly (files are public)
      if (value) {
        setPreview(getDisplayUrl(value));
      } else {
        setPreview(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isClient]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type strictly
    if (type === "image") {
      // Check MIME type
      if (!file.type.startsWith("image/")) {
        setError(
          "Only image files are allowed. Please select an image file (JPG, PNG, GIF, WebP, etc.)"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      // Also check file extension as backup
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
        ".bmp",
        ".ico",
      ];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!imageExtensions.includes(fileExtension)) {
        setError(
          "Invalid image format. Please select a valid image file (JPG, PNG, GIF, WebP, etc.)"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
    }

    if (type === "video") {
      // Check MIME type
      if (!file.type.startsWith("video/")) {
        setError(
          "Only video files are allowed. Please select a video file (MP4, WebM, OGG, etc.)"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      // Also check file extension as backup
      const videoExtensions = [
        ".mp4",
        ".webm",
        ".ogg",
        ".ogv",
        ".mov",
        ".avi",
        ".wmv",
        ".flv",
      ];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!videoExtensions.includes(fileExtension)) {
        setError(
          "Invalid video format. Please select a valid video file (MP4, WebM, OGG, etc.)"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
    }

    // Validate file size (max 10MB for images, 50MB for videos)
    const maxSize = type === "image" ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `File size too large. Maximum size: ${
          type === "image" ? "10MB" : "50MB"
        }`
      );
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Extract old file key if previous value is an S3 URL
      const oldFileKey = previousValue
        ? extractS3KeyFromUrl(previousValue)
        : null;

      // Upload to S3
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expectedType", type); // Send expected type for server-side validation
      if (folder) {
        formData.append("folder", folder);
      }
      if (oldFileKey) {
        formData.append("oldFileKey", oldFileKey);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.url) {
        // Store the S3 URL (which contains the key)
        onChange(result.url);
        setPreviousValue(result.url);
        setError(null);
        // Use permanent URL for preview
        setPreview(getDisplayUrl(result.url));
      } else {
        setError(result.error || "Upload failed");
        setPreview(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during upload"
      );
      setPreview(null);
    } finally {
      setUploading(false);
      // Clean up preview URL
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    }
  };

  const handleRemove = async () => {
    // Delete old file from S3 if it's an S3 URL
    if (value) {
      const fileKey = extractS3KeyFromUrl(value);
      if (fileKey && (fileKey.includes("/") || fileKey.includes("."))) {
        try {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileKey }),
          });
        } catch (error) {
          console.error("Error deleting file:", error);
          // Continue with removal even if deletion fails
        }
      }
    }

    setPreview(null);
    onChange("");
    setPreviousValue("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;

    // If user is changing from S3 URL to external URL, delete old file
    if (previousValue && !url) {
      const oldFileKey = extractS3KeyFromUrl(previousValue);
      if (oldFileKey && (oldFileKey.includes("/") || oldFileKey.includes("."))) {
        // Delete old file asynchronously
        fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileKey: oldFileKey }),
        }).catch((error) => {
          console.error("Error deleting old file:", error);
        });
      }
    }

    onChange(url);
    
    // Update preview - use permanent URL directly
    if (url) {
      setPreview(getDisplayUrl(url));
    } else {
      setPreview(null);
    }
    
    setPreviousValue(url || "");
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>

      {/* URL Input */}
      <div className="mb-2">
        <input
          type="text"
          value={value}
          onChange={handleUrlChange}
          placeholder={`Enter ${type} URL or upload a file`}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* Upload Button */}
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {uploading
            ? "Uploading..."
            : `Upload ${type === "image" ? "Image" : "Video"}`}
        </button>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Remove
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={
          accept ||
          (type === "image"
            ? "image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/x-icon"
            : "video/mp4,video/webm,video/ogg,video/ogv,video/quicktime,video/x-msvideo")
        }
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview - Only render on client to prevent hydration issues */}
      {isClient && preview && (
        <div className="mt-3">
          {type === "image" ? (
            <div className="relative w-full h-48 border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
                unoptimized
                onError={() => setPreview(null)}
              />
            </div>
          ) : (
            <div className="w-full">
              <video
                src={preview}
                controls
                className="w-full max-h-64 rounded-md"
                onError={() => setPreview(null)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <p className="text-xs text-gray-500 mt-1">
        {type === "image"
          ? "Upload an image file (JPG, PNG, GIF, WebP) or paste an image URL"
          : "Upload a video file (MP4, WebM, OGG) or paste a video URL"}
      </p>
    </div>
  );
}
