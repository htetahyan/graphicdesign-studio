'use client';

import { useErrorStore, ErrorNotification, ErrorAction } from './error-handling/store';
import { ErrorClassifier } from './error-handling/classifier';
import { RetryManager } from './error-handling/retry';

export {
  ErrorProvider,
  useErrorStore,
} from './error-handling/store';

export type { ErrorNotification, ErrorAction };
export { ErrorClassifier };
export { RetryManager };

export interface ErrorNotificationProps {
  notification: ErrorNotification;
  onClose: () => void;
  onRetry?: () => void;
}

export const useErrorHandler = () => {
  const { addNotification, removeNotification } = useErrorStore();
  
  const handleError = (error: any, context?: {
    operation?: string;
    provider?: string;
    userId?: string;
  }) => {
    console.error('Error occurred:', error, context);
    const classification = ErrorClassifier.classify(error, context);
    
    return addNotification({
      type: classification.type,
      title: getErrorTitle(classification.severity),
      message: classification.userMessage,
      persistent: classification.persistent,
      retryable: classification.retryable,
      actions: classification.suggestedActions,
      context: {
        operation: context?.operation,
        provider: context?.provider,
        errorCode: extractErrorCode(error),
        userId: context?.userId,
      },
    });
  };
  
  const clearError = (id: string) => {
    removeNotification(id);
  };
  
  return { handleError, clearError };
};

function getErrorTitle(severity: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (severity) {
    case 'critical': return 'Critical Error';
    case 'high': return 'Error';
    case 'medium': return 'Issue';
    case 'low': return 'Notice';
    default: return 'Message';
  }
}

function extractErrorCode(error: any): string | undefined {
  if (error?.code) return error.code;
  const match = error?.message?.match(/\(([A-Z0-9]+)\)/);
  return match ? match[1] : undefined;
}
