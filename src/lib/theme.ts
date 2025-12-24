/**
 * Global Theme Colors
 * These colors are used throughout the application
 */

export const theme = {
  colors: {
    // Primary gradient colors
    primary: {
      start: "#5c8c24", // Dark green
      end: "#ced430", // Yellow-green
      gradient: "linear-gradient(99.01deg, #5c8c24 -0.67%, #ced430)",
      gradientDirection: "99.01deg",
    },
    // Base colors
    black: "#000000",
    white: "#ffffff",
    // Semantic colors
    text: {
      primary: "#000000",
      secondary: "#ffffff",
      muted: "#666666",
    },
    background: {
      primary: "#ffffff",
      secondary: "#000000",
      overlay: "rgba(0, 0, 0, 0.8)",
  },
  },
} as const;

/**
 * Get gradient as CSS string
 */
export function getGradient(direction?: number): string {
  const dir = direction ?? 99.01;
  return `linear-gradient(${dir}deg, ${theme.colors.primary.start} -0.67%, ${theme.colors.primary.end})`;
}

/**
 * Get gradient as Tailwind classes
 */
export const gradientClasses = {
  bg: "bg-gradient-to-br from-[#5c8c24] to-[#ced430]",
  text: "bg-gradient-to-br from-[#5c8c24] to-[#ced430] bg-clip-text text-transparent",
  border: "border-gradient-to-br from-[#5c8c24] to-[#ced430]",
};
