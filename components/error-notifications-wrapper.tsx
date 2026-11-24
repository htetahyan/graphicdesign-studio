/**
 * Client-side wrapper for error notifications
 * Separates client components from server-side layout
 */

'use client';

import { ErrorProvider, useErrorStore } from '@/lib/error-handling';
import { ErrorNotificationList } from '@/components/error-notifications';

function ErrorNotificationContent() {
  const { state, removeNotification, retryOperation } = useErrorStore();
  
  return (
    <ErrorNotificationList
      notifications={state.notifications}
      onClose={removeNotification}
      onRetry={retryOperation}
    />
  );
}

export function ErrorNotificationWrapper() {
  return (
    <ErrorProvider>
      <ErrorNotificationContent />
    </ErrorProvider>
  );
}
