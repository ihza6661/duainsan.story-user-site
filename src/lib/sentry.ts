/**
 * Sentry Configuration for Dua Insan Story User Site
 * 
 * This file initializes Sentry for error tracking and performance monitoring.
 * 
 * @see https://docs.sentry.io/platforms/javascript/guides/react/
 */

import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry
 * 
 * Note: To enable Sentry, you need to:
 * 1. Create a project at https://sentry.io
 * 2. Get your DSN (Data Source Name)
 * 3. Add VITE_SENTRY_DSN to your .env file
 * 4. Add VITE_SENTRY_ENVIRONMENT to your .env file (optional)
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;
  
  // Only initialize Sentry if DSN is provided
  if (!dsn) {
    console.warn('Sentry DSN not found. Error tracking is disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    
    // Integrations
    integrations: [
      // Automatic instrumentation
      Sentry.browserTracingIntegration(),
      
      // Replay integration (session recording for debugging)
      Sentry.replayIntegration({
        // Capture 10% of all sessions
        sessionSampleRate: 0.1,
        
        // Capture 100% of sessions with errors
        errorSampleRate: 1.0,
        
        // Mask all text content by default (privacy)
        maskAllText: true,
        
        // Block all media (images, videos) by default (privacy)
        blockAllMedia: true,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in production, 100% in development
    
    // Set sample rate for profiling
    profilesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Capture unhandled promise rejections
    autoSessionTracking: true,

    // Release tracking (optional - requires build step configuration)
    release: import.meta.env.VITE_APP_VERSION || undefined,

    // Before send hook - filter sensitive data
    beforeSend(event, hint) {
      // Filter out localhost errors in production
      if (import.meta.env.PROD && event.request?.url?.includes('localhost')) {
        return null;
      }

      // Remove sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
          // Remove authorization headers
          if (breadcrumb.data?.headers?.Authorization) {
            breadcrumb.data.headers.Authorization = '[Filtered]';
          }
          return breadcrumb;
        });
      }

      // Log errors in development
      if (import.meta.env.DEV) {
        console.error('Sentry captured error:', event, hint);
      }

      return event;
    },

    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'atomicFindClose',
      
      // Random plugins/extensions
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      
      // Network errors
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      
      // Abort errors (user cancelled)
      'AbortError',
      'The operation was aborted',
      
      // ResizeObserver errors (harmless)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],

    // Deny URLs - don't capture errors from these sources
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
    ],
  });

  console.log(`Sentry initialized in ${environment} mode`);
};

/**
 * Manually capture an error
 */
export const captureError = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key]);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

/**
 * Manually capture a message
 */
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Set user context
 */
export const setUser = (user: { id: string; email?: string; username?: string } | null) => {
  Sentry.setUser(user);
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) => {
  Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Create error boundary with Sentry
 */
export const createSentryErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
