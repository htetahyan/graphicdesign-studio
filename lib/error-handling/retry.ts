import { logger } from "../logger";

export class RetryManager {
  private static retryAttempts = new Map<string, number>();
  
  static shouldRetry(errorId: string, maxRetries = 3): boolean {
    const attempts = this.retryAttempts.get(errorId) || 0;
    return attempts < maxRetries;
  }
  
  static incrementRetry(errorId: string): number {
    const current = this.retryAttempts.get(errorId) || 0;
    const next = current + 1;
    this.retryAttempts.set(errorId, next);
    return next;
  }
  
  static resetRetry(errorId: string): void {
    this.retryAttempts.delete(errorId);
  }
  
  static getRetryDelay(attemptNumber: number): number {
    return Math.min(1000 * Math.pow(2, attemptNumber - 1), 30000);
  }
  
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    errorId: string,
    maxRetries = 3
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        this.resetRetry(errorId);
        return result;
      } catch (error) {
        lastError = error;
        this.incrementRetry(errorId);
        
        if (attempt < maxRetries) {
          const delay = this.getRetryDelay(attempt);
          logger.info(`Retry attempt ${attempt}/${maxRetries} in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}
