// Predefined theme for sections - aligned with homepage theme

export const sectionTheme = {
  // Dark sections (hero, services, stats, twoColumn, partnerships) use gradient
  dark: {
    background: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
    textColor: "#ffffff", // white
  },
  // Light sections (industries, about) use white background
  light: {
    background: "#ffffff",
    textColor: "#0f172a", // slate-900
  },
} as const;

// Get theme for section type
export const getSectionTheme = (
  sectionType: string
): {
  background: string;
  textColor: string;
} => {
  // Light sections (white background)
  if (
    sectionType === "industries" ||
    sectionType === "about" ||
    sectionType === "services" ||
    sectionType === "features" ||
    sectionType === "cards" ||
    sectionType === "stats" ||
    sectionType === "portfolio" ||
    sectionType === "technologies" ||
    sectionType === "blog" ||
    sectionType === "process" ||
    sectionType === "faq"
  ) {
    return sectionTheme.light;
  }
  // Dark sections (gradient background): hero, stats, partnerships, cta
  // Footer uses its own dark theme
  if (sectionType === "footer") {
    return { background: "#111827", textColor: "#ffffff" }; // gray-900
  }
  // All other sections use dark gradient theme
  return sectionTheme.dark;
};
