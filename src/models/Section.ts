import mongoose, { Schema, Document } from "mongoose";

// Feature item interface for Features section
export interface IFeature {
  icon?: string;
  title: string;
  description: string;
}

// Contact info interface for Contact section
export interface IContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

// Section content interface that includes all possible fields from all section types
// This allows flexibility while maintaining type safety for known fields
export interface ISectionContent {
  // Common fields (used by all or most sections)
  title?: string;
  description?: string;
  backgroundColor?: string;
  backgroundColorOpacity?: number;
  textColor?: string;

  // Hero section specific fields
  subtitle?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  titleUnderline?: boolean;

  // Services section specific fields
  services?: IFeature[];
  cardBackgroundColor?: string;
  cardTextColor?: string;
  cardBorderColor?: string;

  // Stats section specific fields
  stats?: Array<{
    number: string;
    title: string;
    description: string;
  }>;

  // TwoColumn section specific fields
  leftContent?: string;
  rightContent?: string;

  // Industries section specific fields
  industries?: Array<{
    icon?: string;
    name: string;
  }>;

  // About section specific fields
  aboutImage?: string;
  aboutText?: string;
  aboutLink?: string;
  aboutLinkText?: string;

  // Partnerships section specific fields
  partnerships?: Array<{
    image?: string;
    title: string;
    description: string;
  }>;

  // Partners section specific fields
  partners?: Array<{
    logo?: string;
    name?: string;
  }>;

  // Legacy fields (for backward compatibility)
  features?: IFeature[];
  images?: string[];
  contactInfo?: IContactInfo;

  // Allow additional fields for future extensibility
  [key: string]: unknown;
}

export interface ISection extends Document {
  pageId?: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  type:
    | "hero"
    | "services"
    | "stats"
    | "industries"
    | "about"
    | "partnerships"
    | "cta"
    | "footer"
    | "features"
    | "cards"
    | "portfolio"
    | "technologies"
    | "blog"
    | "process"
    | "faq"
    | "partners";
  content: ISectionContent;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema: Schema = new Schema(
  {
    pageId: {
      type: Schema.Types.ObjectId,
      ref: "Page",
      required: function () {
        return !this.serviceId;
      },
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: function () {
        return !this.pageId;
      },
    },
    type: {
      type: String,
      enum: [
        "hero",
        "services",
        "stats",
        "industries",
        "about",
        "partnerships",
        "cta",
        "footer",
        "features",
        "cards",
        "portfolio",
        "technologies",
        "blog",
        "process",
        "faq",
        "partners",
      ],
      required: [true, "Section type is required"],
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Delete the model from cache if it exists to ensure fresh schema
if (mongoose.models.Section) {
  delete mongoose.models.Section;
}

export default mongoose.model<ISection>("Section", SectionSchema);
