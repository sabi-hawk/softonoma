"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface IconUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  className?: string;
  placeholder?: string;
}

// Helper function to extract file ID from Appwrite URL
function extractFileIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const filesIndex = pathParts.indexOf("files");

    if (filesIndex !== -1 && filesIndex + 1 < pathParts.length) {
      const fileId = pathParts[filesIndex + 1];
      if (fileId && fileId.length > 10) {
        return fileId;
      }
    }

    return null;
  } catch {
    return null;
  }
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update previous value when value prop changes (but not from our own upload)
  useEffect(() => {
    setPreviousValue(value || "");
  }, [value]);

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
      // Extract old file ID if previous value is an Appwrite URL
      const oldFileId = previousValue
        ? extractFileIdFromUrl(previousValue)
        : null;

      // Upload to Appwrite
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expectedType", "image"); // Icons are always images
      if (folder) {
        formData.append("folder", folder);
      }
      if (oldFileId) {
        formData.append("oldFileId", oldFileId);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.url) {
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

            // If user is changing from Appwrite URL to external URL/emoji, delete old file
            if (previousValue && !newValue) {
              const oldFileId = extractFileIdFromUrl(previousValue);
              if (oldFileId) {
                // Delete old file asynchronously
                fetch("/api/upload", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fileId: oldFileId }),
                }).catch((error) => {
                  console.error("Error deleting old file:", error);
                });
              }
            } else if (previousValue && newValue !== previousValue) {
              // If changing from one Appwrite URL to another or to external URL
              const oldFileId = extractFileIdFromUrl(previousValue);
              const newFileId = extractFileIdFromUrl(newValue);

              // Only delete if old was Appwrite URL and new is not the same Appwrite URL
              if (oldFileId && oldFileId !== newFileId) {
                fetch("/api/upload", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fileId: oldFileId }),
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

      {/* Preview */}
      {value && (
        <div className="mt-2">
          {isUrl ? (
            <div className="relative w-16 h-16 border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Image
                src={value}
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
