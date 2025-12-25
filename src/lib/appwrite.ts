import { Client, Storage } from "appwrite";

// Initialize Appwrite client
const client = new Client();

// Set endpoint and project (will be set from environment variables)
if (typeof window !== "undefined") {
  // Client-side initialization
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");
} else {
  // Server-side initialization
  client
    .setEndpoint(
      process.env.APPWRITE_ENDPOINT ||
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
        ""
    )
    .setProject(
      process.env.APPWRITE_PROJECT_ID ||
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
        ""
    );
}

// Initialize Storage
export const storage = new Storage(client);

// Get bucket ID from environment
export const getBucketId = (): string => {
  return (
    process.env.APPWRITE_BUCKET_ID ||
    process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ||
    ""
  );
};

export { client };
