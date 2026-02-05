import mongoose, { Schema, Document } from "mongoose";

export interface IPageConfig {
  hero?: {
    title?: string;
    description?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    showHero?: boolean;
  };
  display?: {
    cardsPerRow?: number; // 2, 3, or 4
    cardStyle?: string; // "minimal", "elevated", "outlined"
    showDescriptions?: boolean;
    showIcons?: boolean;
  };
  [key: string]: unknown;
}

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  order: number;
  templateType?: "homepage" | "standard" | "services-listing" | "industries-listing" | string; // "standard" = uses sections, "homepage" = uses full page template, "services-listing" and "industries-listing" = custom listing pages
  pageConfig?: IPageConfig;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  metaHeaderTags?: string;
  allowIndexing?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Page slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9\-\/]+$/,
        "Slug can only contain lowercase letters, numbers, hyphens, and forward slashes",
      ],
    },
    content: {
      type: String,
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
    templateType: {
      type: String,
      enum: ["homepage", "standard", "services-listing", "industries-listing"],
      default: "standard",
    },
    pageConfig: {
      type: Schema.Types.Mixed,
      default: {},
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
    metaHeaderTags: {
      type: String,
      trim: true,
    },
    allowIndexing: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Delete the model from cache if it exists to ensure fresh schema
if (mongoose.models.Page) {
  delete mongoose.models.Page;
}

export default mongoose.model<IPage>("Page", PageSchema);
