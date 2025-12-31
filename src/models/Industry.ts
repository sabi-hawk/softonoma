import mongoose, { Schema, Document } from "mongoose";

export interface IIndustry extends Document {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  content?: string; // JSON string for template data
  isPublished: boolean;
  order: number;
  navOrder?: number; // Order in the main navigation bar
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Industry title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Industry slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    navOrder: {
      type: Number,
      default: null,
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
  },
  {
    timestamps: true,
  }
);

// Delete the model from cache if it exists to ensure fresh schema
if (mongoose.models.Industry) {
  delete mongoose.models.Industry;
}

export default mongoose.model<IIndustry>("Industry", IndustrySchema);
