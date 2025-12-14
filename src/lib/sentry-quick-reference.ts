/**
 * SENTRY QUICK REFERENCE CARD
 * 
 * Quick copy-paste snippets for common Sentry usage patterns.
 * Keep this file open when coding for easy reference.
 */

import * as Sentry from '@sentry/react';
import { captureError, addBreadcrumb, logger } from '@/lib/sentry';

// =============================================================================
// 1. EXCEPTION TRACKING (Most Common Use Case)
// =============================================================================

// Basic error capture
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}

// Error capture with context (RECOMMENDED)
try {
  await processPayment(orderId);
} catch (error) {
  captureError(error as Error, {
    payment: {
      order_id: orderId,
      amount: total,
      method: 'bank_transfer',
    }
  });
  throw error;
}

// =============================================================================
// 2. TRACKING BUTTON CLICKS
// =============================================================================

const handleButtonClick = () => {
  Sentry.startSpan(
    { op: 'ui.click', name: 'Add to Cart Button' },
    (span) => {
      span.setAttribute('product_id', productId);
      span.setAttribute('quantity', quantity);
      addToCart(productId, quantity);
    }
  );
};

// =============================================================================
// 3. TRACKING API CALLS
// =============================================================================

async function fetchData(userId: string) {
  return Sentry.startSpan(
    { op: 'http.client', name: `GET /api/users/${userId}` },
    async (span) => {
      const response = await fetch(`/api/users/${userId}`);
      span.setAttribute('status_code', response.status);
      return response.json();
    }
  );
}

// =============================================================================
// 4. LOGGING IMPORTANT EVENTS
// =============================================================================

// Info level - normal operations
logger.info('Order created', { order_id: 'ORD-123', total: 500000 });

// Warning level - potential issues
logger.warn('Rate limit approaching', { requests_remaining: 10 });

// Error level - errors
logger.error('Payment failed', { order_id: 'ORD-123', error: 'timeout' });

// Using template literals
logger.debug(logger.fmt`Processing order ${orderId}`);

// =============================================================================
// 5. TRACKING USER JOURNEY
// =============================================================================

addBreadcrumb({
  message: 'User viewed product',
  category: 'navigation',
  level: 'info',
  data: { product_id: 123, product_name: 'Wedding Invitation' },
});

// =============================================================================
// 6. SETTING USER CONTEXT (Usually in AuthContext)
// =============================================================================

// On login
Sentry.setUser({
  id: user.id.toString(),
  email: user.email,
  username: user.name,
});

// On logout
Sentry.setUser(null);

// =============================================================================
// WHEN TO USE WHAT?
// =============================================================================

/*
USE SENTRY.CAPTUCEEXCEPTION():
  ✅ In try-catch blocks for API calls
  ✅ Payment processing
  ✅ Form submissions
  ✅ File uploads
  ✅ Critical business logic

USE SENTRY.STARTSPAN():
  ✅ Button clicks (checkout, add to cart)
  ✅ API calls
  ✅ Complex operations (image processing)
  ✅ Multi-step flows

USE LOGGER:
  ✅ Important events (order created, payment completed)
  ✅ Warnings (rate limits, deprecations)
  ✅ Errors that need logging

USE BREADCRUMBS:
  ✅ User navigation
  ✅ Important actions (add to cart, wishlist)
  ✅ State changes (login, logout)
*/

// =============================================================================
// COMMON PATTERNS
// =============================================================================

// Pattern 1: API call with error handling and tracking
async function apiCallPattern() {
  return Sentry.startSpan(
    { op: 'http.client', name: 'POST /api/checkout' },
    async (span) => {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        
        span.setAttribute('status_code', response.status);
        
        if (!response.ok) {
          throw new Error(`Checkout failed: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        span.setAttribute('error', true);
        captureError(error as Error, {
          checkout: { user_id: userId, total },
        });
        throw error;
      }
    }
  );
}

// Pattern 2: Button click with breadcrumb
function buttonClickPattern() {
  Sentry.startSpan(
    { op: 'ui.click', name: 'Checkout Button' },
    (span) => {
      span.setAttribute('cart_total', cartTotal);
      
      addBreadcrumb({
        message: 'User clicked checkout',
        category: 'user-action',
        data: { cartTotal },
      });
      
      navigateToCheckout();
    }
  );
}

// Pattern 3: Multi-step operation with child spans
async function complexOperationPattern() {
  return Sentry.startSpan(
    { op: 'task', name: 'Process Order' },
    async (parentSpan) => {
      // Step 1
      await Sentry.startSpan(
        { op: 'task.validate', name: 'Validate Order' },
        async () => { /* validate */ }
      );
      
      // Step 2
      await Sentry.startSpan(
        { op: 'payment.process', name: 'Process Payment' },
        async () => { /* process payment */ }
      );
      
      // Step 3
      await Sentry.startSpan(
        { op: 'email.send', name: 'Send Confirmation' },
        async () => { /* send email */ }
      );
      
      parentSpan.setAttribute('result', 'success');
    }
  );
}
