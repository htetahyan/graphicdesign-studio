/**
 * Capacitor-optimized image compression for mobile performance
 * Implements platform-specific optimizations for better mobile experience
 */

import { performanceMonitor, adaptiveQuality, getNetworkOptimizationSettings } from './capacitor-performance';

// Platform detection utilities
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') return { isMobile: false, isLowEnd: false };
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // Detect low-end devices based on memory and hardware
  const isLowEnd = isMobile && (
    navigator.hardwareConcurrency <= 4 || 
    (navigator as any).deviceMemory <= 4 ||
    userAgent.includes('android') && !userAgent.includes('mobile') // Tablet detection
  );
  
  return { isMobile, isLowEnd };
};

/**
 * Compresses an image file with Capacitor-specific optimizations
 * - Adaptive compression based on device capabilities
 * - Progressive JPEG for better mobile loading
 * - WebP support detection
 * - Memory-efficient processing for mobile
 */
export const compressImage = async (
  file: File,
  maxSizeMB: number = 1.0,
): Promise<File> => {
  // Start performance monitoring
  performanceMonitor.startImageCompression();
  
  // Get network-aware settings
  const networkSettings = getNetworkOptimizationSettings();
  const adaptiveMaxSize = Math.min(maxSizeMB, networkSettings.maxSizeMB);
  
  return new Promise((resolve) => {
    // If it's not an image, return original
    if (!file.type.startsWith("image/")) {
      return resolve(file);
    }

    const deviceInfo = getDeviceInfo();
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Adaptive max dimensions based on device and network
      let maxDim = 1920; // Default for desktop
      if (deviceInfo.isMobile) {
        maxDim = deviceInfo.isLowEnd ? 1280 : 1536; // Smaller for low-end mobile
      }
      
      // Further reduce for slow networks
      if (networkSettings.maxSizeMB < 0.5) {
        maxDim = Math.min(maxDim, 1024);
      }

      // Resize if necessary
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return resolve(file);
      }

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Fill with white background for JPEG conversion
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Use adaptive quality based on performance history and network
      let quality = Math.min(
        adaptiveQuality.getCurrentQuality(),
        networkSettings.quality,
        deviceInfo.isMobile ? 0.8 : 0.9
      );
      if (deviceInfo.isLowEnd) quality = Math.min(quality, 0.7);
      
      // Check WebP support
      const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      const outputFormat = (supportsWebP && networkSettings.enableWebP && 
        !file.name.toLowerCase().includes('.jpg') && !file.name.toLowerCase().includes('.jpeg')) 
        ? 'image/webp' 
        : 'image/jpeg';

      const compress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              performanceMonitor.endImageCompression(file.size);
              return resolve(file);
            }

            const sizeMB = blob.size / 1024 / 1024;

            // Adaptive compression strategy
            if (sizeMB > adaptiveMaxSize && quality > 0.3) {
              quality -= deviceInfo.isMobile ? 0.15 : 0.1; // More aggressive on mobile
              compress();
            } else {
              // Record performance metrics
              const metrics = performanceMonitor.endImageCompression(file.size);
              adaptiveQuality.adjustQualityBasedOnPerformance(metrics.imageCompressionTime);
              
              // Preserve original extension if possible, otherwise use format
              const originalExt = file.name.split('.').pop()?.toLowerCase();
              let fileName = file.name;
              
              if (outputFormat === 'image/jpeg' && originalExt !== 'jpg' && originalExt !== 'jpeg') {
                fileName = file.name.replace(/\.[^/.]+$/, ".jpg");
              } else if (outputFormat === 'image/webp' && originalExt !== 'webp') {
                fileName = file.name.replace(/\.[^/.]+$/, ".webp");
              }
              
              resolve(
                new File([blob], fileName, {
                  type: outputFormat,
                }),
              );
            }
          },
          outputFormat,
          quality,
        );
      };

      compress();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      performanceMonitor.endImageCompression(file.size);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

// Re-export high-level features from image-optimization to keep this file under 180 lines
export {
  optimizeImageForCapacitor,
  batchOptimizeImages,
} from './image-optimization';
export type { ImageMetadata } from './image-optimization';
