// Helper functions for section rendering

// Get default background color for section type
export const getDefaultBackground = (sectionType: string): string => {
  const defaults: Record<string, string> = {
    about: "white",
    services: "theme-bg-white-green-gradient",
    stats: "white",
    partnerships: "theme-bg-white-green-gradient",
    portfolio: "white",
    technologies: "theme-bg-white-green-gradient",
    partners: "white",
    cards: "white",
    cta: "theme-bg-white-green-gradient",
    faq: "white",
    industries: "white",
    features: "theme-bg-white-green-gradient",
    blog: "white",
    process: "white",
  };
  return defaults[sectionType] || "white";
};

// Helper function to convert hex to rgba
export const hexToRgba = (hex: string, opacity: number = 1): string => {
  if (!hex || !hex.startsWith("#")) {
    return hex;
  }
  // Handle 3-digit hex codes
  let r: number, g: number, b: number;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Check if backgroundColor is a Tailwind gradient class or theme class
export const isGradientClass = (bgColor?: string): boolean => {
  if (!bgColor) return false;
  return bgColor.startsWith("bg-gradient") || bgColor.startsWith("theme-bg-");
};

// Get background style and className for sections
export const getBackgroundStyle = (
  bgColor?: string,
  bgOpacity?: number
): { className?: string; style?: React.CSSProperties } => {
  if (!bgColor) {
    return {};
  }

  // Handle special theme classes
  if (bgColor === "white") {
    return { className: "theme-bg-white" };
  }

  if (bgColor === "theme-bg-white-green-gradient") {
    return { className: "theme-bg-white-green-gradient" };
  }

  // If it's a gradient class or theme class, return className
  if (isGradientClass(bgColor)) {
    return { className: bgColor };
  }

  // Otherwise, return inline style with hex color
  return {
    style: {
      backgroundColor: hexToRgba(bgColor, bgOpacity ?? 1),
    },
  };
};
