/**
 * Sanitize filename to be URL-safe and storage-compatible
 * Removes non-ASCII characters, special characters, and limits length
 */
export function sanitizeFilename(filename: string): string {
  // Get file extension
  const lastDotIndex = filename.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  const nameWithoutExt = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
  
  // Replace non-ASCII and special characters with safe alternatives
  const sanitized = nameWithoutExt
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters (Cyrillic, Chinese, etc.)
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Trim underscores from start/end
    .substring(0, 100); // Limit length to 100 chars
  
  // If sanitization removed everything, use a default name
  const finalName = sanitized || 'file';
  
  return finalName + extension.toLowerCase();
}

/**
 * Generate a safe storage path for uploaded files
 */
export function generateStoragePath(
  userId: string,
  prefix: string,
  originalFilename: string
): string {
  const sanitized = sanitizeFilename(originalFilename);
  const timestamp = Date.now();
  return `${userId}/${prefix}-${timestamp}-${sanitized}`;
}
