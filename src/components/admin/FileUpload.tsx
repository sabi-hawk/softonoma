"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  folder?: string;
  type?: "image" | "video";
  className?: string;
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
  const [preview, setPreview] = useState<string | null>(value || null);
  const [previousValue, setPreviousValue] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update previous value and preview when value prop changes (but not from our own upload)
  useEffect(() => {
    if (value !== preview) {
      setPreviousValue(value || "");
      setPreview(value || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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

      // Extract old file ID if previous value is an Appwrite URL
      const oldFileId = previousValue
        ? extractFileIdFromUrl(previousValue)
        : null;

      // Upload to Appwrite
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expectedType", type); // Send expected type for server-side validation
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
    // Delete old file from Appwrite if it's an Appwrite URL
    if (value) {
      const fileId = extractFileIdFromUrl(value);
      if (fileId) {
        try {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId }),
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;

    // If user is changing from Appwrite URL to external URL, delete old file
    if (previousValue && !url) {
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
    }

    onChange(url);
    setPreview(url || null);
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

      {/* Preview */}
      {preview && (
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
