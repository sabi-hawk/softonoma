export const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

