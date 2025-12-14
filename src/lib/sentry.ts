/**
 * Sentry Configuration for Dua Insan Story User Site
 * 
 * This file initializes Sentry for error tracking, performance monitoring, and logging.
 * 
 * @see https://docs.sentry.io/platforms/javascript/guides/react/
 */

import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry
 * 
 * Configured with:
 * - Error tracking and exception capture
 * - Performance monitoring with tracing
 * - Session replay for debugging
 * - Console logging integration
 * - Privacy-first configuration (masked text, blocked media)
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN || 
    'https://3091f4f48b79e4dde5139b3b7e2f362a@o4508587480907776.ingest.de.sentry.io/4510533680037968';
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;
  
  // Only initialize Sentry if not explicitly disabled
  if (import.meta.env.VITE_DISABLE_SENTRY === 'true') {
    console.warn('Sentry is disabled via environment variable.');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    
    // Enable structured logging
    enableLogs: true,
    
    // Integrations
    integrations: [
      // Automatic instrumentation for browser tracing
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
      
      // Console logging integration - automatically sends console logs to Sentry
      // Note: Available in @sentry/react v8+
      ...(Sentry.captureConsoleIntegration ? [
        Sentry.captureConsoleIntegration({
          levels: ['warn', 'error'], // Only capture warnings and errors
        })
      ] : []),
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
          // Remove tokens
          if (breadcrumb.data?.token) {
            breadcrumb.data.token = '[Filtered]';
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
      
      // Network errors (often user connectivity issues)
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      
      // Abort errors (user cancelled)
      'AbortError',
      'The operation was aborted',
      
      // ResizeObserver errors (harmless)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      
      // React hydration errors (common in development)
      'Hydration failed',
      'There was an error while hydrating',
    ],

    // Deny URLs - don't capture errors from these sources
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-extension:\/\//i,
    ],
  });

  console.log(`Sentry initialized in ${environment} mode with DSN: ${dsn.substring(0, 30)}...`);
};

/**
 * Manually capture an error
 * 
 * Use this in try-catch blocks or areas where exceptions are expected.
 * 
 * @example
 * try {
 *   await processPayment();
 * } catch (error) {
 *   captureError(error as Error, { 
 *     checkout: { 
 *       user_id: userId, 
 *       amount: total 
 *     } 
 *   });
 *   throw error;
 * }
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
 * Start a performance span for tracing
 * 
 * Spans should be created for meaningful actions like button clicks, API calls, and function calls.
 * 
 * @example UI Click
 * Sentry.startSpan({
 *   op: 'ui.click',
 *   name: 'Checkout Button Click'
 * }, (span) => {
 *   span.setAttribute('cart_total', total);
 *   span.setAttribute('items_count', itemsCount);
 *   handleCheckout();
 * });
 * 
 * @example API Call
 * async function fetchProducts() {
 *   return Sentry.startSpan({
 *     op: 'http.client',
 *     name: 'GET /api/products'
 *   }, async (span) => {
 *     const response = await fetch('/api/products');
 *     span.setAttribute('status_code', response.status);
 *     return response.json();
 *   });
 * }
 */
export const startSpan = Sentry.startSpan;

/**
 * Sentry Logger
 * 
 * Structured logging with different severity levels.
 * Use logger.fmt template literal for dynamic values.
 * 
 * @example
 * const { logger } = Sentry;
 * 
 * logger.trace('Starting database connection', { database: 'users' });
 * logger.debug(logger.fmt`Cache miss for user: ${userId}`);
 * logger.info('Updated profile', { profileId: 345 });
 * logger.warn('Rate limit reached', { endpoint: '/api/results/' });
 * logger.error('Failed to process payment', { orderId: 'order_123', amount: 99.99 });
 * logger.fatal('Database connection pool exhausted', { database: 'users' });
 */
export const { logger } = Sentry;

/**
 * Create error boundary with Sentry
 */
export const createSentryErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
