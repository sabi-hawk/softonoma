"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface IconUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  className?: string;
  placeholder?: string;
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

export default function IconUpload({
  label,
  value,
  onChange,
  folder,
  className = "",
  placeholder = "📱 or https://example.com/icon.png or upload image",
}: IconUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string>(value || "");
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set client-side flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update previous value when value prop changes (but not from our own upload)
  useEffect(() => {
    if (!isClient) return; // Only run on client to prevent hydration issues
    setPreviousValue(value || "");
  }, [value, isClient]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type strictly - only images allowed
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

    // Validate file size (max 5MB for icons)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size too large. Maximum size: 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Extract old file key if previous value is an S3 URL
      const oldFileKey = previousValue
        ? extractS3KeyFromUrl(previousValue)
        : null;

      // Upload to S3
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expectedType", "image"); // Icons are always images
      if (folder) {
        formData.append("folder", folder);
      }
      if (oldFileKey && (oldFileKey.includes("/") || oldFileKey.includes("."))) {
        formData.append("oldFileKey", oldFileKey);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (result.success && result.url) {
        // Store the S3 URL (which contains the key)
        onChange(result.url);
        setPreviousValue(result.url);
        setError(null);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during upload"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isUrl = value && (value.startsWith("http") || value.startsWith("/"));
  const isEmoji = value && !isUrl && value.length <= 10;
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  // Get permanent URL for S3 images (only on client to prevent hydration issues)
  useEffect(() => {
    if (!isClient) return; // Only run on client to prevent hydration issues
    
    if (isUrl && value) {
      // Use permanent URL directly (files are public)
      setDisplayUrl(getDisplayUrl(value));
    } else {
      setDisplayUrl(null);
    }
  }, [value, isUrl, isClient]);

  return (
    <div className={className}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>

      {/* Input for Emoji or URL */}
      <div className="mb-2">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;

            // If user is changing from S3 URL to external URL/emoji, delete old file
            if (previousValue && !newValue) {
              const oldFileKey = extractS3KeyFromUrl(previousValue);
              if (oldFileKey && (oldFileKey.includes("/") || oldFileKey.includes("."))) {
                // Delete old file asynchronously
                fetch("/api/upload", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fileKey: oldFileKey }),
                  credentials: "include",
                }).catch((error) => {
                  console.error("Error deleting old file:", error);
                });
              }
            } else if (previousValue && newValue !== previousValue) {
              // If changing from one S3 URL to another or to external URL
              const oldFileKey = extractS3KeyFromUrl(previousValue);
              const newFileKey = extractS3KeyFromUrl(newValue);

              // Only delete if old was S3 URL and new is not the same S3 URL
              if (
                oldFileKey &&
                (oldFileKey.includes("/") || oldFileKey.includes(".")) &&
                oldFileKey !== newFileKey
              ) {
                fetch("/api/upload", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fileKey: oldFileKey }),
                  credentials: "include",
                }).catch((error) => {
                  console.error("Error deleting old file:", error);
                });
              }
            }

            onChange(newValue);
            setPreviousValue(newValue);
          }}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* Upload Button */}
      <div className="mb-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/x-icon"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview - Only render on client to prevent hydration issues */}
      {isClient && value && (
        <div className="mt-2">
          {isUrl && displayUrl ? (
            <div className="relative w-16 h-16 border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Image
                src={displayUrl}
                alt="Icon preview"
                width={64}
                height={64}
                className="object-contain"
                unoptimized
                onError={() => {}}
              />
            </div>
          ) : isEmoji ? (
            <div className="w-16 h-16 border rounded-md bg-white dark:bg-gray-800 flex items-center justify-center">
              <span className="text-3xl">{value}</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Enter an emoji, paste an image URL, or upload an image file (JPG, PNG,
        GIF, WebP)
      </p>
    </div>
  );
}
