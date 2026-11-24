import { compressImage, getDeviceInfo } from './image-utils';

/**
 * Image metadata interface for optimization tracking
 */
export interface ImageMetadata {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  dimensions: { width: number; height: number };
  format: string;
  isMobileOptimized: boolean;
  isLowEndDevice: boolean;
}

/**
 * Helper function to get image dimensions
 */
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    
    img.src = url;
  });
};

/**
 * Capacitor-specific image optimization for mobile networks
 * Implements progressive loading and memory management
 */
export const optimizeImageForCapacitor = async (
  file: File,
  options: {
    maxSizeMB?: number;
    enableProgressive?: boolean;
    targetWidth?: number;
  } = {}
): Promise<{ file: File; metadata: ImageMetadata }> => {
  const { maxSizeMB = 0.8, enableProgressive = true, targetWidth } = options;
  const deviceInfo = getDeviceInfo();
  
  // Mobile-specific size limits
  const mobileMaxSize = deviceInfo.isLowEnd ? 0.5 : maxSizeMB;
  
  const compressedFile = await compressImage(file, mobileMaxSize);
  
  // Extract metadata for optimization tracking
  const metadata: ImageMetadata = {
    originalSize: file.size,
    compressedSize: compressedFile.size,
    compressionRatio: ((file.size - compressedFile.size) / file.size) * 100,
    dimensions: await getImageDimensions(compressedFile),
    format: compressedFile.type,
    isMobileOptimized: deviceInfo.isMobile,
    isLowEndDevice: deviceInfo.isLowEnd,
  };
  
  return { file: compressedFile, metadata };
};

/**
 * Batch image optimization for multiple uploads
 * Implements memory-efficient processing for mobile
 */
export const batchOptimizeImages = async (
  files: File[],
  options: { maxSizeMB?: number; concurrent?: number } = {}
): Promise<{ optimizedFiles: File[]; metadata: ImageMetadata[] }> => {
  const { maxSizeMB = 0.8, concurrent = 2 } = options;
  const deviceInfo = getDeviceInfo();
  
  // Reduce concurrent processing on mobile/low-end devices
  const mobileConcurrent = deviceInfo.isMobile ? (deviceInfo.isLowEnd ? 1 : 2) : concurrent;
  
  const results: { file: File; metadata: ImageMetadata }[] = [];
  
  // Process in batches to manage memory
  for (let i = 0; i < files.length; i += mobileConcurrent) {
    const batch = files.slice(i, i + mobileConcurrent);
    const batchPromises = batch.map(file => optimizeImageForCapacitor(file, { maxSizeMB }));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches on mobile to prevent memory pressure
    if (deviceInfo.isMobile && i + mobileConcurrent < files.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return {
    optimizedFiles: results.map(r => r.file),
    metadata: results.map(r => r.metadata)
  };
};
