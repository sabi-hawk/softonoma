import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Service from "@/models/Service";
import Industry from "@/models/Industry";

export async function getMetaHeaderTagsBySlug(slug: string): Promise<string | null> {
  try {
    await connectDB();
    
    let page;
    if (slug === "home" || slug === "") {
      page = await Page.findOne({
        $or: [{ slug: "home" }, { slug: "" }],
      }).select("metaHeaderTags").lean();
    } else {
      page = await Page.findOne({ slug }).select("metaHeaderTags").lean();
    }
    
    return page?.metaHeaderTags?.trim() || null;
  } catch (error) {
    console.error("Error fetching meta header tags by slug:", error);
    return null;
  }
}

export async function getMetaHeaderTagsByService(slug: string): Promise<string | null> {
  try {
    await connectDB();
    const service = await Service.findOne({ slug, isPublished: true })
      .select("metaHeaderTags")
      .lean();
    return service?.metaHeaderTags?.trim() || null;
  } catch (error) {
    console.error("Error fetching meta header tags by service:", error);
    return null;
  }
}

export async function getMetaHeaderTagsByIndustry(slug: string): Promise<string | null> {
  try {
    await connectDB();
    const industry = await Industry.findOne({ slug, isPublished: true })
      .select("metaHeaderTags")
      .lean();
    return industry?.metaHeaderTags?.trim() || null;
  } catch (error) {
    console.error("Error fetching meta header tags by industry:", error);
    return null;
  }
}

