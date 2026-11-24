'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';

export interface ErrorNotification {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  persistent?: boolean;
  actions?: ErrorAction[];
  retryable?: boolean;
  retryCount?: number;
  maxRetries?: number;
  context?: {
    operation?: string;
    provider?: string;
    errorCode?: string;
    userId?: string;
  };
}

export interface ErrorAction {
  label: string;
  action: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'destructive';
}

interface ErrorState {
  notifications: ErrorNotification[];
}

type ErrorActionType = 
  | { type: 'ADD_NOTIFICATION'; payload: Omit<ErrorNotification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

const errorReducer = (state: ErrorState, action: ErrorActionType): ErrorState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload as ErrorNotification],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { notifications: [] };
    
    default:
      return state;
  }
};

const ErrorContext = createContext<{
  state: ErrorState;
  addNotification: (notification: Omit<ErrorNotification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  retryOperation: (id: string) => void;
  getNotification: (id: string) => ErrorNotification | undefined;
} | null>(null);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, { notifications: [] });
  
  const addNotification = useCallback((notification: Omit<ErrorNotification, 'id' | 'timestamp'>) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullNotification: ErrorNotification = {
      ...notification,
      id,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
    
    if (!notification.persistent) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, 10000);
    }
    
    return id;
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);
  
  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);
  
  const retryOperation = useCallback((id: string) => {
    const notification = state.notifications.find((n) => n.id === id);
    if (notification?.retryable && notification.actions) {
      const retryAction = notification.actions.find(action => action.label.toLowerCase().includes('retry'));
      if (retryAction) {
        retryAction.action();
      }
    }
  }, [state.notifications]);
  
  const getNotification = useCallback((id: string) => {
    return state.notifications.find((n) => n.id === id);
  }, [state.notifications]);
  
  const contextValue = {
    state,
    addNotification,
    removeNotification,
    clearNotifications,
    retryOperation,
    getNotification,
  };
  
  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorStore = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorStore must be used within an ErrorProvider');
  }
  return context;
};
