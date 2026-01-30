import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";
import { getImageUrl } from "@/lib/image-utils";

/** Returns the hero background image URL for the homepage (for preload). Cached per request. */
export async function getHomeHeroImageUrl(): Promise<string | null> {
  try {
    await connectDB();
    const page = await Page.findOne({
      $or: [{ slug: "home" }, { slug: "" }],
      isPublished: true,
    })
      .select("_id")
      .lean();
    if (!page) return null;
    const hero = await Section.findOne({
      pageId: page._id,
      type: "hero",
      isActive: true,
    })
      .select("content.backgroundImage")
      .sort({ order: 1 })
      .lean();
    const bg = hero?.content?.backgroundImage as string | undefined;
    if (!bg?.trim()) return null;
    return getImageUrl(bg.trim());
  } catch {
    return null;
  }
}
