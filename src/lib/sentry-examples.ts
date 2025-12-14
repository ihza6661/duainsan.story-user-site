/**
 * Sentry Usage Examples for Dua Insan Story
 * 
 * This file demonstrates best practices for using Sentry in the application.
 * These are EXAMPLES ONLY - do not import this file in production code.
 */

import * as Sentry from "@sentry/react";
import { captureError, startSpan, addBreadcrumb } from "./sentry";

// =============================================================================
// Example 1: Exception Tracking in Try-Catch Blocks
// =============================================================================

/**
 * Use Sentry.captureException() in try-catch blocks to log errors
 */
export async function processCheckoutExample(checkoutData: any) {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
    
    if (!response.ok) {
      throw new Error(`Checkout failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Capture exception with context
    captureError(error as Error, {
      checkout: {
        user_id: checkoutData.user_id,
        cart_total: checkoutData.total,
        payment_method: checkoutData.payment_method,
        items_count: checkoutData.items?.length,
      }
    });
    
    throw error; // Re-throw to handle in UI
  }
}

// =============================================================================
// Example 2: Custom Span for UI Interactions
// =============================================================================

/**
 * Track button click performance
 */
export function handleAddToCartButtonClick(productId: number, quantity: number) {
  // Create a span to measure performance
  Sentry.startSpan(
    {
      op: "ui.click",
      name: "Add to Cart Button Click",
    },
    (span) => {
      // Add metadata to the span
      span.setAttribute("product_id", productId);
      span.setAttribute("quantity", quantity);
      span.setAttribute("user_action", "add_to_cart");

      // Add breadcrumb for debugging
      addBreadcrumb({
        message: `User clicked Add to Cart for product ${productId}`,
        category: "user-action",
        level: "info",
        data: { productId, quantity },
      });

      // Execute the actual action
      // addToCart(productId, quantity);
    },
  );
}

/**
 * Track checkout button click with full funnel context
 */
export function handleCheckoutButtonClick(cartTotal: number, itemsCount: number) {
  Sentry.startSpan(
    {
      op: "ui.click",
      name: "Checkout Button Click",
    },
    (span) => {
      span.setAttribute("cart_total", cartTotal);
      span.setAttribute("items_count", itemsCount);
      span.setAttribute("funnel_step", "cart_to_checkout");

      // Add breadcrumb
      addBreadcrumb({
        message: "User initiated checkout",
        category: "checkout-funnel",
        level: "info",
        data: { cartTotal, itemsCount },
      });

      // Navigate to checkout
      // window.location.href = '/checkout';
    },
  );
}

// =============================================================================
// Example 3: Custom Span for API Calls
// =============================================================================

/**
 * Track API call performance with proper spans
 */
export async function fetchUserDataExample(userId: string) {
  return Sentry.startSpan(
    {
      op: "http.client",
      name: `GET /api/users/${userId}`,
    },
    async (span) => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        
        // Add response metadata to span
        span.setAttribute("status_code", response.status);
        span.setAttribute("user_id", userId);
        
        if (!response.ok) {
          span.setAttribute("error", true);
          throw new Error(`Failed to fetch user: ${response.status}`);
        }
        
        const data = await response.json();
        span.setAttribute("data_size", JSON.stringify(data).length);
        
        return data;
      } catch (error) {
        span.setAttribute("error", true);
        Sentry.captureException(error);
        throw error;
      }
    },
  );
}

/**
 * Track product fetch with pagination
 */
export async function fetchProductsExample(page: number, perPage: number) {
  return Sentry.startSpan(
    {
      op: "http.client",
      name: "GET /api/products",
    },
    async (span) => {
      span.setAttribute("page", page);
      span.setAttribute("per_page", perPage);
      
      const response = await fetch(`/api/products?page=${page}&per_page=${perPage}`);
      span.setAttribute("status_code", response.status);
      
      const data = await response.json();
      span.setAttribute("products_count", data.data?.length || 0);
      
      return data;
    },
  );
}

// =============================================================================
// Example 4: Structured Logging with Sentry Logger
// =============================================================================

/**
 * Use Sentry logger for structured logging
 */
export function loggerExamples() {
  const { logger } = Sentry;
  
  // Trace level - most detailed
  logger.trace("Starting database connection", { database: "users" });
  
  // Debug level - debugging information
  const userId = 12345;
  logger.debug(logger.fmt`Cache miss for user: ${userId}`);
  
  // Info level - general information
  logger.info("Updated profile", { profileId: 345, changes: ["name", "email"] });
  
  // Warning level - potential issues
  logger.warn("Rate limit reached for endpoint", {
    endpoint: "/api/results/",
    isEnterprise: false,
    remaining_requests: 0,
  });
  
  // Error level - errors that need attention
  logger.error("Failed to process payment", {
    orderId: "order_123",
    amount: 99.99,
    error_code: "INSUFFICIENT_FUNDS",
  });
  
  // Fatal level - critical failures
  logger.fatal("Database connection pool exhausted", {
    database: "users",
    activeConnections: 100,
    maxConnections: 100,
  });
}

/**
 * Logger in checkout flow
 */
export function checkoutFlowLogging(orderId: string, total: number) {
  const { logger } = Sentry;
  
  logger.info("Checkout started", {
    order_id: orderId,
    total_amount: total,
    step: "payment_selection",
  });
  
  // If error occurs
  logger.error("Payment processing failed", {
    order_id: orderId,
    payment_gateway: "midtrans",
    error: "timeout",
  });
}

// =============================================================================
// Example 5: Child Spans within Parent Spans
// =============================================================================

/**
 * Create nested spans for complex operations
 */
export async function processOrderExample(orderId: string) {
  return Sentry.startSpan(
    {
      op: "task",
      name: "Process Order",
    },
    async (parentSpan) => {
      parentSpan.setAttribute("order_id", orderId);
      
      // Child span 1: Validate order
      await Sentry.startSpan(
        {
          op: "task.validate",
          name: "Validate Order",
        },
        async (validateSpan) => {
          validateSpan.setAttribute("order_id", orderId);
          // await validateOrder(orderId);
          validateSpan.setAttribute("validation_result", "passed");
        }
      );
      
      // Child span 2: Process payment
      await Sentry.startSpan(
        {
          op: "payment.process",
          name: "Process Payment",
        },
        async (paymentSpan) => {
          paymentSpan.setAttribute("order_id", orderId);
          paymentSpan.setAttribute("payment_method", "credit_card");
          // await processPayment(orderId);
          paymentSpan.setAttribute("payment_status", "success");
        }
      );
      
      // Child span 3: Send confirmation email
      await Sentry.startSpan(
        {
          op: "email.send",
          name: "Send Confirmation Email",
        },
        async (emailSpan) => {
          emailSpan.setAttribute("order_id", orderId);
          emailSpan.setAttribute("email_type", "order_confirmation");
          // await sendConfirmationEmail(orderId);
          emailSpan.setAttribute("email_sent", true);
        }
      );
      
      parentSpan.setAttribute("processing_result", "success");
    }
  );
}

// =============================================================================
// Example 6: Breadcrumbs for User Journey Tracking
// =============================================================================

/**
 * Track user journey through the app
 */
export function trackUserJourneyExample() {
  // User visits product page
  addBreadcrumb({
    message: "User viewed product page",
    category: "navigation",
    level: "info",
    data: {
      product_id: 123,
      product_name: "Wedding Invitation Premium",
      page_url: "/products/123",
    },
  });
  
  // User adds to cart
  addBreadcrumb({
    message: "User added item to cart",
    category: "user-action",
    level: "info",
    data: {
      product_id: 123,
      quantity: 2,
      price: 150000,
    },
  });
  
  // User goes to checkout
  addBreadcrumb({
    message: "User navigated to checkout",
    category: "navigation",
    level: "info",
    data: {
      cart_total: 300000,
      items_count: 2,
    },
  });
  
  // User selects payment method
  addBreadcrumb({
    message: "User selected payment method",
    category: "user-action",
    level: "info",
    data: {
      payment_method: "bank_transfer",
    },
  });
}

// =============================================================================
// Example 7: Error Context for Different Scenarios
// =============================================================================

/**
 * Capture error with rich context for API failures
 */
export function captureAPIErrorExample(error: Error, endpoint: string, method: string) {
  captureError(error, {
    api: {
      endpoint,
      method,
      timestamp: new Date().toISOString(),
    },
    user_context: {
      // Add user info if available
    },
  });
}

/**
 * Capture error with context for form validation failures
 */
export function captureFormErrorExample(error: Error, formData: any) {
  captureError(error, {
    form: {
      form_name: "checkout_form",
      fields: Object.keys(formData),
      validation_errors: formData.errors,
    },
  });
}

/**
 * Capture error with context for payment failures
 */
export function capturePaymentErrorExample(error: Error, paymentData: any) {
  captureError(error, {
    payment: {
      order_id: paymentData.order_id,
      amount: paymentData.amount,
      payment_method: paymentData.payment_method,
      gateway: paymentData.gateway,
      error_code: error.message,
    },
  });
}

// =============================================================================
// Note: These are EXAMPLES ONLY
// =============================================================================
// Do not import this file in your actual components.
// Instead, copy the patterns you need into your own code.
