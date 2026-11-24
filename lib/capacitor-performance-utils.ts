/**
 * Capacitor-specific performance utility functions and adaptive controllers
 */

import { Capacitor } from '@capacitor/core';

export interface PerformanceThresholds {
  maxCompressionTime: number; // ms
  maxUploadTime: number; // ms
  maxMemoryUsage: number; // MB
}

// Detect low-end devices
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    navigator.hardwareConcurrency <= 4 ||
    (navigator as any).deviceMemory <= 4 ||
    /android.*mobile/i.test(navigator.userAgent)
  );
};

// Platform-specific performance thresholds
export const getPerformanceThresholds = (): PerformanceThresholds => {
  const isMobile = Capacitor.isNativePlatform();
  const isLowEnd = isLowEndDevice();
  
  return {
    maxCompressionTime: isLowEnd ? 3000 : 2000, // More lenient for low-end
    maxUploadTime: isLowEnd ? 10000 : 8000,
    maxMemoryUsage: isLowEnd ? 150 : 250, // MB
  };
};

/**
 * Adaptive quality adjustment based on performance feedback
 */
export class AdaptiveQualityController {
  private currentQuality: number = 0.8;
  private performanceHistory: number[] = [];
  private readonly maxHistorySize = 5;
  
  adjustQualityBasedOnPerformance(compressionTime: number): number {
    this.performanceHistory.push(compressionTime);
    
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift();
    }
    
    const avgTime = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length;
    const thresholds = getPerformanceThresholds();
    
    if (avgTime > thresholds.maxCompressionTime) {
      // Performance is poor, reduce quality
      this.currentQuality = Math.max(0.5, this.currentQuality - 0.1);
    } else if (avgTime < thresholds.maxCompressionTime * 0.7) {
      // Performance is good, can increase quality
      this.currentQuality = Math.min(0.9, this.currentQuality + 0.05);
    }
    
    return this.currentQuality;
  }
  
  getCurrentQuality(): number {
    return this.currentQuality;
  }
  
  reset() {
    this.currentQuality = 0.8;
    this.performanceHistory = [];
  }
}

export const adaptiveQuality = new AdaptiveQualityController();

/**
 * Network-aware optimization
 */
export const getNetworkOptimizationSettings = () => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return {
      maxSizeMB: 0.8,
      quality: 0.8,
      enableWebP: true,
    };
  }
  
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g';
  
  const settings: Record<string, { maxSizeMB: number; quality: number; enableWebP: boolean }> = {
    'slow-2g': { maxSizeMB: 0.3, quality: 0.6, enableWebP: true },
    '2g': { maxSizeMB: 0.4, quality: 0.7, enableWebP: true },
    '3g': { maxSizeMB: 0.6, quality: 0.75, enableWebP: true },
    '4g': { maxSizeMB: 0.8, quality: 0.8, enableWebP: true },
  };
  
  return settings[effectiveType] || settings['4g'];
};

/**
 * Memory usage monitoring for mobile
 */
export const getMemoryUsage = (): number | null => {
  if (typeof window === 'undefined') return null;
  
  // Chrome-based browsers
  if ((performance as any).memory) {
    return Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
  }
  
  return null;
};

/**
 * Cleanup utilities for mobile memory management
 */
export const cleanupResources = () => {
  // Clear any pending object URLs
  if ((window as any)._capacitorObjectUrls) {
    (window as any)._capacitorObjectUrls.forEach((url: string) => URL.revokeObjectURL(url));
    (window as any)._capacitorObjectUrls = [];
  }
  
  // Clear any image caches
  if ((window as any)._imageCache) {
    (window as any)._imageCache.clear();
  }
  
  // Suggest garbage collection
  if ((window as any).gc) {
    (window as any).gc();
  }
};
