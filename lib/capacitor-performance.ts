/**
 * Capacitor-specific performance monitoring and optimization utilities
 * Implements mobile-specific performance tracking and optimization strategies
 */

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { logger } from './logger';
import {
  isLowEndDevice,
  getPerformanceThresholds,
} from './capacitor-performance-utils';

export {
  isLowEndDevice,
  getPerformanceThresholds,
  AdaptiveQualityController,
  adaptiveQuality,
  getNetworkOptimizationSettings,
  getMemoryUsage,
  cleanupResources,
} from './capacitor-performance-utils';

export interface PerformanceMetrics {
  imageCompressionTime: number;
  uploadTime: number;
  memoryUsage?: number;
  deviceInfo: {
    platform: string;
    isMobile: boolean;
    isLowEnd: boolean;
    model?: string;
  };
}

// Performance monitoring class
export class CapacitorPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;
  
  constructor() {
    this.setupPerformanceListeners();
  }
  
  private setupPerformanceListeners() {
    if (Capacitor.isNativePlatform()) {
      // Monitor app state changes for memory management
      App.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          // App went to background, cleanup if needed
          this.performMemoryCleanup();
        }
      });
    }
  }
  
  private performMemoryCleanup() {
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    // Clear object URLs to free memory
    const objectUrls = (window as any)._capacitorObjectUrls || [];
    objectUrls.forEach((url: string) => URL.revokeObjectURL(url));
    (window as any)._capacitorObjectUrls = [];
  }
  
  startImageCompression() {
    this.startTime = performance.now();
  }
  
  endImageCompression(fileSize: number): PerformanceMetrics {
    const endTime = performance.now();
    const compressionTime = endTime - this.startTime;
    
    const metrics: PerformanceMetrics = {
      imageCompressionTime: compressionTime,
      uploadTime: 0, // Will be set separately
      deviceInfo: {
        platform: Capacitor.getPlatform(),
        isMobile: Capacitor.isNativePlatform(),
        isLowEnd: isLowEndDevice(),
        model: (navigator as any).userAgentData?.platform || 'unknown',
      },
    };
    
    this.metrics.push(metrics);
    this.checkPerformanceThresholds(metrics);
    
    return metrics;
  }
  
  recordUploadTime(uploadTime: number) {
    if (this.metrics.length > 0) {
      const lastMetric = this.metrics[this.metrics.length - 1];
      lastMetric.uploadTime = uploadTime;
      this.checkPerformanceThresholds(lastMetric);
    }
  }
  
  private checkPerformanceThresholds(metrics: PerformanceMetrics) {
    const thresholds = getPerformanceThresholds();
    
    if (metrics.imageCompressionTime > thresholds.maxCompressionTime) {
      logger.warn(`Slow image compression detected: ${metrics.imageCompressionTime}ms`, { metrics });
      this.suggestOptimizations('compression');
    }
    
    if (metrics.uploadTime > thresholds.maxUploadTime) {
      logger.warn(`Slow upload detected: ${metrics.uploadTime}ms`, { metrics });
      this.suggestOptimizations('upload');
    }
  }
  
  private suggestOptimizations(type: 'compression' | 'upload') {
    const suggestions = {
      compression: [
        'Consider reducing image quality further',
        'Use smaller maximum dimensions',
        'Enable WebP format if supported',
        'Process images in smaller batches',
      ],
      upload: [
        'Check network connection quality',
        'Consider progressive upload',
        'Implement retry mechanism',
        'Use smaller file sizes',
      ],
    };
    
    logger.info('Optimization suggestions', { type, suggestions: suggestions[type] });
  }
  
  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {};
    
    const total = this.metrics.reduce(
      (acc, metric) => ({
        imageCompressionTime: acc.imageCompressionTime + metric.imageCompressionTime,
        uploadTime: acc.uploadTime + metric.uploadTime,
      }),
      { imageCompressionTime: 0, uploadTime: 0 }
    );
    
    return {
      imageCompressionTime: total.imageCompressionTime / this.metrics.length,
      uploadTime: total.uploadTime / this.metrics.length,
    };
  }
  
  // Export metrics for analytics
  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      averages: this.getAverageMetrics(),
      deviceInfo: {
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        isLowEnd: isLowEndDevice(),
      },
      timestamp: new Date().toISOString(),
    });
  }
}

// Singleton instance
export const performanceMonitor = new CapacitorPerformanceMonitor();

