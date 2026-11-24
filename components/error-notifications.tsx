/**
 * Enhanced error handling UI components
 * Persistent notifications for long-running operations
 */

'use client';

import { useCallback } from 'react';
import { useErrorStore, ErrorNotification, ErrorAction } from '@/lib/error-handling';

export { ErrorNotificationComponent, ErrorNotificationList } from './error-notification-ui';

// Hook for managing error notifications in components
export const useErrorNotifications = () => {
  const { state, addNotification, removeNotification, retryOperation } = useErrorStore();

  const showError = useCallback((
    title: string,
    message: string,
    options?: {
      persistent?: boolean;
      actions?: ErrorAction[];
      context?: ErrorNotification['context'];
    }
  ) => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: options?.persistent || false,
      actions: options?.actions,
      context: options?.context,
    });
  }, [addNotification]);

  const showWarning = useCallback((
    title: string,
    message: string,
    options?: {
      persistent?: boolean;
      actions?: ErrorAction[];
      context?: ErrorNotification['context'];
    }
  ) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      persistent: options?.persistent || false,
      actions: options?.actions,
      context: options?.context,
    });
  }, [addNotification]);

  const showInfo = useCallback((
    title: string,
    message: string,
    options?: {
      persistent?: boolean;
      actions?: ErrorAction[];
      context?: ErrorNotification['context'];
    }
  ) => {
    return addNotification({
      type: 'info',
      title,
      message,
      persistent: options?.persistent || false,
      actions: options?.actions,
      context: options?.context,
    });
  }, [addNotification]);

  const clearError = useCallback((id: string) => {
    removeNotification(id);
  }, [removeNotification]);

  const clearAllErrors = useCallback(() => {
    state.notifications.forEach(notification => {
      removeNotification(notification.id);
    });
  }, [state.notifications, removeNotification]);

  return {
    notifications: state.notifications,
    showError,
    showWarning,
    showInfo,
    clearError,
    clearAllErrors,
    retryOperation,
  };
};

