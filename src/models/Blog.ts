import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  publishedAt?: Date;
  isPublished: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  allowIndexing?: boolean;
  metaHeaderTags?: string;
  templateConfig?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9\-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    content: {
      type: String,
      default: "",
    },
    excerpt: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    seoKeywords: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
      trim: true,
    },
    ogTitle: {
      type: String,
      trim: true,
    },
    ogDescription: {
      type: String,
      trim: true,
    },
    allowIndexing: {
      type: Boolean,
      default: true,
    },
    metaHeaderTags: {
      type: String,
      trim: true,
    },
    templateConfig: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

export default mongoose.model<IBlog>("Blog", BlogSchema);
