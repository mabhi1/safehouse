/**
 * Validates if a string is a valid URL with http or https protocol
 */
export const isValidUrl = (url: string): boolean => {
  try {
    // Check if it's a valid URL format
    const parsedUrl = new URL(url);
    // Check if it has http or https protocol
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
};
