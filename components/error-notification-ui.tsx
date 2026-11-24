'use client';

import React from 'react';
import { X, AlertTriangle, Info, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorNotification, ErrorAction } from '@/lib/error-handling';

interface ErrorNotificationProps {
  notification: ErrorNotification;
  onClose: (id: string) => void;
  onRetry?: (id: string) => void;
}

export const ErrorNotificationComponent: React.FC<ErrorNotificationProps> = ({
  notification,
  onClose,
  onRetry,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'error':
        return 'border-red-500/30 bg-card';
      case 'warning':
        return 'border-amber-500/30 bg-card';
      case 'info':
        return 'border-blue-500/30 bg-card';
      default:
        return 'border-border bg-card';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className={`mb-3 ${getBorderColor()} border shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {notification.title}
                </h4>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                  {formatTime(notification.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {notification.message}
              </p>
              
              {notification.context && (
                <div className="text-xs text-muted-foreground mb-3 space-y-1">
                  {notification.context.operation && (
                    <div>Operation: <span className="font-mono">{notification.context.operation}</span></div>
                  )}
                  {notification.context.provider && (
                    <div>Provider: <span className="font-mono">{notification.context.provider}</span></div>
                  )}
                  {notification.context.errorCode && (
                    <div>Error Code: <span className="font-mono">{notification.context.errorCode}</span></div>
                  )}
                </div>
              )}
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {notification.actions.map((action: ErrorAction, index: number) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={
                        action.variant === 'primary' ? 'default' :
                        action.variant === 'destructive' ? 'destructive' : 'outline'
                      }
                      onClick={() => action.action()}
                      className="text-xs h-8"
                    >
                      {action.label.toLowerCase().includes('retry') && (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              
              {notification.retryable && !notification.actions?.find((a: ErrorAction) => a.label.toLowerCase().includes('retry')) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRetry?.(notification.id)}
                  className="text-xs h-8 mt-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          </div>
          
          {!notification.persistent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose(notification.id)}
              className="flex-shrink-0 ml-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ErrorNotificationListProps {
  notifications: ErrorNotification[];
  onClose: (id: string) => void;
  onRetry?: (id: string) => void;
  maxVisible?: number;
}

export const ErrorNotificationList: React.FC<ErrorNotificationListProps> = ({
  notifications,
  onClose,
  onRetry,
  maxVisible = 5,
}) => {
  if (notifications.length === 0) return null;

  const visibleNotifications = notifications.slice(-maxVisible).reverse();
  const hasMore = notifications.length > maxVisible;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      {hasMore && (
        <div className="mb-2 text-center">
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full shadow-sm border border-border">
            {notifications.length - maxVisible} more notifications
          </span>
        </div>
      )}
      
      <div className="space-y-2">
        {visibleNotifications.map((notification) => (
          <ErrorNotificationComponent
            key={notification.id}
            notification={notification}
            onClose={onClose}
            onRetry={onRetry}
          />
        ))}
      </div>
    </div>
  );
};
