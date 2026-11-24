import { ErrorAction } from "./store";

export class ErrorClassifier {
  static classify(error: any, context?: {
    operation?: string;
    provider?: string;
  }): {
    type: 'error' | 'warning' | 'info';
    severity: 'low' | 'medium' | 'high' | 'critical';
    userMessage: string;
    technicalMessage: string;
    retryable: boolean;
    persistent: boolean;
    suggestedActions: ErrorAction[];
  } {
    const errorMessage = error?.message || String(error);
    
    // Service busy errors (like the Replicate E003 error)
    if (errorMessage.includes('high demand') || errorMessage.includes('unavailable') || errorMessage.includes('E003')) {
      return {
        type: 'error',
        severity: 'medium',
        userMessage: 'AI service is currently busy. Please try again later.',
        technicalMessage: `Service unavailable: ${errorMessage}`,
        retryable: false,
        persistent: true,
        suggestedActions: [
          { label: 'Try Again Later', action: () => console.log('User will retry manually'), variant: 'primary' },
          { label: 'Try Different Style', action: () => console.log('Navigate to style settings'), variant: 'secondary' },
        ],
      };
    }
    
    // Rate limiting
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return {
        type: 'warning',
        severity: 'medium',
        userMessage: 'Too many requests. Please wait a moment before generating more images.',
        technicalMessage: `Rate limit exceeded: ${errorMessage}`,
        retryable: false,
        persistent: true,
        suggestedActions: [
          { label: 'Try Again Later', action: () => console.log('User will retry manually'), variant: 'primary' },
        ],
      };
    }
    
    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return {
        type: 'error',
        severity: 'medium',
        userMessage: 'Request timed out. The AI service is taking longer than expected.',
        technicalMessage: `Timeout: ${errorMessage}`,
        retryable: false,
        persistent: true,
        suggestedActions: [
          { label: 'Try Again Manually', action: () => console.log('User will retry manually'), variant: 'primary' },
          { label: 'Try Different Style', action: () => console.log('Simplify prompt'), variant: 'secondary' },
        ],
      };
    }
    
    // Credit/insufficient balance errors
    if (errorMessage.includes('credits') || errorMessage.includes('insufficient')) {
      return {
        type: 'error',
        severity: 'high',
        userMessage: 'Insufficient credits. Please purchase more credits to continue generating images.',
        technicalMessage: `Insufficient credits: ${errorMessage}`,
        retryable: false,
        persistent: true,
        suggestedActions: [
          { label: 'Buy Credits', action: () => console.log('Navigate to purchase'), variant: 'primary' },
          { label: 'View Pricing', action: () => console.log('View pricing plans'), variant: 'secondary' },
        ],
      };
    }
    
    // Authentication errors
    if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
      return {
        type: 'error',
        severity: 'critical',
        userMessage: 'Authentication error. Please log in again to continue.',
        technicalMessage: `Auth error: ${errorMessage}`,
        retryable: false,
        persistent: true,
        suggestedActions: [
          { label: 'Log In Again', action: () => console.log('Navigate to login'), variant: 'primary' },
        ],
      };
    }
    
    // Network/connectivity errors
    if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('fetch')) {
      return {
        type: 'error',
        severity: 'medium',
        userMessage: 'Network connection issue. Please check your internet connection and try again.',
        technicalMessage: `Network error: ${errorMessage}`,
        retryable: false,
        persistent: true,
        suggestedActions: [
          { label: 'Check Connection', action: () => console.log('Test network connectivity'), variant: 'primary' },
        ],
      };
    }
    
    // Generic errors
    return {
      type: 'error',
      severity: 'medium',
      userMessage: 'Something went wrong while generating your image. Please try again.',
      technicalMessage: `Generic error: ${errorMessage}`,
      retryable: false,
      persistent: false,
      suggestedActions: [
        { label: 'Try Again', action: () => console.log('Retry generic operation'), variant: 'primary' },
      ],
    };
  }
}
