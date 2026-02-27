import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  gtmId?: string; // Google Tag Manager container ID (e.g. GTM-XXXXXXX)
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    gtmId: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "site_settings",
  }
);

// Single-document collection: we always use the first (and only) doc
if (mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}

export default mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
