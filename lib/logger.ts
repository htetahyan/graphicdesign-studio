/**
 * Structured logging system for production and development
 * Replaces console.log statements with proper logging
 */

import { LogLevel, LogEntry } from './logger-types';
export { LogLevel } from './logger-types';
export type { LogEntry } from './logger-types';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  constructor() {
    this.logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private createLogEntry(level: LogLevel, message: string, context?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    };
  }

  private log(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    const timestamp = entry.timestamp;
    const contextStr = entry.context ? ` [${JSON.stringify(entry.context)}]` : '';
    const message = `${timestamp} - ${entry.message}${contextStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`[DEBUG] ${message}`, entry.error);
        break;
      case LogLevel.INFO:
        console.info(`[INFO] ${message}`, entry.error);
        break;
      case LogLevel.WARN:
        console.warn(`[WARN] ${message}`, entry.error);
        break;
      case LogLevel.ERROR:
        console.error(`[ERROR] ${message}`, entry.error);
        if (process.env.NODE_ENV === 'production') {
          this.sendToErrorService(entry);
        }
        break;
    }
  }

  private async sendToErrorService(entry: LogEntry) {
    try {
      const errors = JSON.parse(localStorage.getItem('error_logs') || '[]');
      errors.push(entry);
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      localStorage.setItem('error_logs', JSON.stringify(errors));
    } catch (e) {
      // Fail silently
    }
  }

  debug(message: string, context?: any) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    this.log(this.createLogEntry(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: any) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    this.log(this.createLogEntry(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: any) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    this.log(this.createLogEntry(LogLevel.WARN, message, context));
  }

  error(message: string, error?: Error, context?: any) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    this.log(this.createLogEntry(LogLevel.ERROR, message, context, error));
  }

  performance(operation: string, duration: number, context?: any) {
    this.log(this.createLogEntry(LogLevel.INFO, `Performance: ${operation}`, {
      ...context,
      performance: { duration }
    }));
  }

  database(query: string, duration: number, context?: any) {
    this.log(this.createLogEntry(LogLevel.DEBUG, `Database: ${query}`, {
      ...context,
      performance: { duration }
    }));
  }

  api(method: string, url: string, status: number, duration: number, context?: any) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(this.createLogEntry(level, `API: ${method} ${url} - ${status}`, {
      ...context,
      performance: { duration }
    }));
  }

  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  clearLogs() {
    this.logs = [];
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }
}

export const logger = Logger.getInstance();

export const logError = (message: string, error?: Error, context?: any) => {
  logger.error(message, error, context);
};

export const logInfo = (message: string, context?: any) => {
  logger.info(message, context);
};

export const logWarn = (message: string, context?: any) => {
  logger.warn(message, context);
};

export const logDebug = (message: string, context?: any) => {
  logger.debug(message, context);
};

export const logPerformance = (operation: string, duration: number, context?: any) => {
  logger.performance(operation, duration, context);
};

export const logDatabase = (query: string, duration: number, context?: any) => {
  logger.database(query, duration, context);
};

export const logApi = (method: string, url: string, status: number, duration: number, context?: any) => {
  logger.api(method, url, status, duration, context);
};
