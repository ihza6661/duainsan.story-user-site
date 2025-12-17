/**
 * Google Analytics 4 Configuration for Dua Insan Story User Site
 * 
 * This file initializes Google Analytics 4 and provides tracking utilities.
 * 
 * @see https://github.com/PriceRunner/react-ga4
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */

import ReactGA from "react-ga4";
import { AnalyticsItem } from "./types";

/**
 * Initialize Google Analytics 4
 * 
 * Note: To enable GA4, you need to:
 * 1. Create a GA4 property at https://analytics.google.com
 * 2. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 3. Add VITE_GA4_MEASUREMENT_ID to your .env file
 */
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  
  // Only initialize GA4 if measurement ID is provided and not in development
  if (!measurementId) {
    console.warn('GA4 Measurement ID not found. Analytics tracking is disabled.');
    return;
  }

  try {
    ReactGA.initialize(measurementId, {
      // GA4 configuration options
      gaOptions: {
        // Anonymize IP addresses for privacy
        anonymizeIp: true,
        
        // Enable debug mode in development
        debug_mode: import.meta.env.DEV,
      },
      
      // gtag configuration options
      gtagOptions: {
        // Send page view automatically (we'll handle it manually)
        send_page_view: false,
      },
    });

    console.log(`GA4 initialized with ID: ${measurementId}`);
  } catch (error) {
    console.error('Failed to initialize GA4:', error);
  }
};

/**
 * Track page view
 */
export const trackPageView = (path?: string, title?: string) => {
  try {
    ReactGA.send({
      hitType: "pageview",
      page: path || window.location.pathname + window.location.search,
      title: title || document.title,
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

/**
 * Track custom event
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

/**
 * E-commerce tracking utilities
 */

// Track when user views a product
export const trackProductView = (product: {
  id: string | number;
  name: string;
  category?: string;
  price: number;
  brand?: string;
}) => {
  try {
    ReactGA.event("view_item", {
      currency: "IDR",
      value: product.price,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.category,
          item_brand: product.brand || "Dua Insan Story",
          price: product.price,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to track product view:', error);
  }
};

// Track when user adds item to cart
export const trackAddToCart = (product: {
  id: string | number;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  variant?: string;
}) => {
  try {
    ReactGA.event("add_to_cart", {
      currency: "IDR",
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.category,
          item_variant: product.variant,
          quantity: product.quantity,
          price: product.price,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to track add to cart:', error);
  }
};

// Track when user removes item from cart
export const trackRemoveFromCart = (product: {
  id: string | number;
  name: string;
  category?: string;
  price: number;
  quantity: number;
}) => {
  try {
    ReactGA.event("remove_from_cart", {
      currency: "IDR",
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.category,
          quantity: product.quantity,
          price: product.price,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to track remove from cart:', error);
  }
};

// Track when user views cart
export const trackViewCart = (cartValue: number, itemCount: number) => {
  try {
    ReactGA.event("view_cart", {
      currency: "IDR",
      value: cartValue,
      items_count: itemCount,
    });
  } catch (error) {
    console.error('Failed to track view cart:', error);
  }
};

// Track when user initiates checkout
export const trackBeginCheckout = (cartValue: number, items: AnalyticsItem[]) => {
  try {
    ReactGA.event("begin_checkout", {
      currency: "IDR",
      value: cartValue,
      items: items.map((item) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        item_category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error('Failed to track begin checkout:', error);
  }
};

// Track when user adds shipping info
export const trackAddShippingInfo = (
  cartValue: number,
  shippingTier?: string,
  shippingCost?: number
) => {
  try {
    ReactGA.event("add_shipping_info", {
      currency: "IDR",
      value: cartValue,
      shipping_tier: shippingTier,
      shipping_cost: shippingCost,
    });
  } catch (error) {
    console.error('Failed to track add shipping info:', error);
  }
};

// Track when user adds payment info
export const trackAddPaymentInfo = (
  cartValue: number,
  paymentType?: string
) => {
  try {
    ReactGA.event("add_payment_info", {
      currency: "IDR",
      value: cartValue,
      payment_type: paymentType,
    });
  } catch (error) {
    console.error('Failed to track add payment info:', error);
  }
};

// Track purchase completion
export const trackPurchase = (order: {
  id: string | number;
  value: number;
  tax?: number;
  shipping?: number;
  items: AnalyticsItem[];
  coupon?: string;
}) => {
  try {
    ReactGA.event("purchase", {
      transaction_id: order.id.toString(),
      currency: "IDR",
      value: order.value,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      coupon: order.coupon,
      items: order.items.map((item) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        item_category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error('Failed to track purchase:', error);
  }
};

// Track when user searches
export const trackSearch = (searchTerm: string) => {
  try {
    ReactGA.event("search", {
      search_term: searchTerm,
    });
  } catch (error) {
    console.error('Failed to track search:', error);
  }
};

// Track when user views product list
export const trackViewItemList = (
  listName: string,
  items: AnalyticsItem[]
) => {
  try {
    ReactGA.event("view_item_list", {
      item_list_name: listName,
      items: items.slice(0, 10).map((item, index) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        item_category: item.category,
        index: index,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error('Failed to track view item list:', error);
  }
};

// Track when user selects item from list
export const trackSelectItem = (
  listName: string,
  item: AnalyticsItem,
  index: number
) => {
  try {
    ReactGA.event("select_item", {
      item_list_name: listName,
      items: [
        {
          item_id: item.id.toString(),
          item_name: item.name,
          item_category: item.category,
          index: index,
          price: item.price,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to track select item:', error);
  }
};

// Track user sign up
export const trackSignUp = (method?: string) => {
  try {
    ReactGA.event("sign_up", {
      method: method || "email",
    });
  } catch (error) {
    console.error('Failed to track sign up:', error);
  }
};

// Track user login
export const trackLogin = (method?: string) => {
  try {
    ReactGA.event("login", {
      method: method || "email",
    });
  } catch (error) {
    console.error('Failed to track login:', error);
  }
};

// Track when user shares content
export const trackShare = (
  contentType: string,
  contentId: string,
  method: string
) => {
  try {
    ReactGA.event("share", {
      content_type: contentType,
      content_id: contentId,
      method: method,
    });
  } catch (error) {
    console.error('Failed to track share:', error);
  }
};

// Track when user submits review
export const trackReview = (
  productId: string | number,
  rating: number
) => {
  try {
    ReactGA.event("review_submitted", {
      product_id: productId.toString(),
      rating: rating,
    });
  } catch (error) {
    console.error('Failed to track review:', error);
  }
};

// Track when user adds to wishlist
export const trackAddToWishlist = (product: {
  id: string | number;
  name: string;
  category?: string;
  price: number;
}) => {
  try {
    ReactGA.event("add_to_wishlist", {
      currency: "IDR",
      value: product.price,
      items: [
        {
          item_id: product.id.toString(),
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    });
  } catch (error) {
    console.error('Failed to track add to wishlist:', error);
  }
};

export default ReactGA;
