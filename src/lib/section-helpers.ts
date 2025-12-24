// Helper functions for section rendering

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

// Check if backgroundColor is a Tailwind gradient class
export const isGradientClass = (bgColor?: string): boolean => {
  if (!bgColor) return false;
  return bgColor.startsWith("bg-gradient");
};

// Get background style and className for sections
export const getBackgroundStyle = (
  bgColor?: string,
  bgOpacity?: number
): { className?: string; style?: React.CSSProperties } => {
  if (!bgColor) {
    return {};
  }

  // If it's a gradient class, return className
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

