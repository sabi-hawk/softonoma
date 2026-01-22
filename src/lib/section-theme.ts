// Predefined theme for sections - aligned with homepage theme

export const sectionTheme = {
  // Dark sections (hero, services, stats, twoColumn, partnerships) use gradient
  dark: {
    background: "theme-bg-gradient-to-br",
    textColor: "var(--color-text-secondary)", // white
  },
  // Light sections (industries, about) use white or light grey background
  light: {
    background: "var(--color-bg-primary)",
    textColor: "var(--color-text-primary)", // Dark text
  },
  // Light grey background sections
  lightGrey: {
    background: "var(--color-bg-secondary)",
    textColor: "var(--color-text-primary)", // Dark text
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
    sectionType === "faq" ||
    sectionType === "partnerships"
  ) {
    return sectionTheme.light;
  }
  // Dark sections (gradient background): hero, stats, partnerships, cta
  // Footer uses its own dark theme
  if (sectionType === "footer") {
    return { background: "var(--color-black)", textColor: "var(--color-text-secondary)" };
  }
  // All other sections use dark gradient theme
  return sectionTheme.dark;
};
