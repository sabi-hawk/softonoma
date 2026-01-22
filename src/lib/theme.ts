/**
 * Global Theme Colors
 * These colors are used throughout the application
 */

// Get CSS variable values (for use in JavaScript/TypeScript)
// Note: These should match the values in globals.css
// In most cases, use CSS variables directly in components instead of this object
export const theme = {
  colors: {
    // Primary gradient colors - use CSS variables instead
    primary: {
      start: "var(--color-primary-start)", // Dark blue-grey
      end: "var(--color-primary-end)", // Orange-yellow
      gradient: "var(--color-primary-gradient)",
      gradientDirection: "99.01deg",
    },
    // Base colors - use CSS variables instead
    black: "var(--color-black)",
    white: "var(--color-white)",
    // Semantic colors - use CSS variables instead
    text: {
      primary: "var(--color-text-primary)", // Dark text
      secondary: "var(--color-text-secondary)", // White text
      muted: "var(--color-text-muted)",
    },
    background: {
      primary: "var(--color-bg-primary)", // White
      secondary: "var(--color-bg-secondary)", // Light grey
      overlay: "var(--color-bg-overlay)",
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
// Use theme utility classes from globals.css instead
export const gradientClasses = {
  bg: "theme-bg-gradient-to-br",
  text: "theme-gradient-text",
  border: "theme-border-primary",
};
