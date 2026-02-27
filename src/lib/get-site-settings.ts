import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export interface SiteSettingsResult {
  gtmId: string | null;
}

/**
 * Get site-wide settings (e.g. GTM ID) for use in layout/server components.
 * Returns null for gtmId if not set or on error.
 */
export async function getSiteSettings(): Promise<SiteSettingsResult> {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne();
    const gtmId = doc?.gtmId?.trim() ?? null;
    return { gtmId };
  } catch {
    return { gtmId: null };
  }
}
