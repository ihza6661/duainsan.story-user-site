// --- Imports dari library ---
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// --- Imports Provider Konteks ---
import { TooltipProvider } from "@/components/ui/utils/tooltip";
import { CartProvider } from "@/features/cart/hooks/cart/CartProvider";
import { AuthProvider } from "@/features/auth/context/AuthContext";

// --- Imports Komponen UI & Layout ---
import { Toaster } from "@/components/ui/feedback/toaster";
import { Toaster as Sonner } from "@/components/ui/feedback/sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import FloatingIcons from "@/components/ui/WhatsAppFloat";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import PublicOnlyRoute from "@/features/auth/components/PublicOnlyRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

// --- Lazy-loaded Pages (Code Splitting) ---
// Critical pages loaded immediately
import Home from "@/pages/info/Home";
import NotFound from "@/pages/error/NotFound";

// Auth pages - lazy loaded
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ProfilePage = lazy(() => import("@/pages/auth/ProfilePage"));

// Shopping pages - lazy loaded
const Products = lazy(() => import("@/pages/shopping/Products"));
const ProductDetail = lazy(() => import("@/pages/shopping/ProductDetail"));
const Cart = lazy(() => import("@/pages/shopping/Cart"));
const CheckoutPage = lazy(() => import("@/pages/shopping/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("@/pages/shopping/OrderConfirmationPage"));

// Info pages - lazy loaded
const Gallery = lazy(() => import("@/pages/GalleryPage"));
const CaraMemesan = lazy(() => import("@/pages/info/CaraMemesan"));
const InfoPemesananCetak = lazy(() => import("@/pages/info/InfoPemesananCetak"));
const OrderStatusPage = lazy(() => import("@/pages/info/OrderStatusPage"));
const SyaratKetentuan = lazy(() => import("@/pages/info/SyaratKetentuan"));
const KebijakanPrivasi = lazy(() => import("@/pages/info/KebijakanPrivasi"));
const PengembalianRefund = lazy(() => import("@/pages/info/PengembalianRefund"));

// Wishlist & Reviews - lazy loaded
const WishlistPage = lazy(() => import("@/pages/wishlist/WishlistPage").then(module => ({ default: module.WishlistPage })));
const SharedWishlistPage = lazy(() => import("@/pages/wishlist/SharedWishlistPage").then(module => ({ default: module.SharedWishlistPage })));
const MyReviewsPage = lazy(() => import("@/pages/reviews/MyReviewsPage").then(module => ({ default: module.MyReviewsPage })));

// Digital Invitations - lazy loaded
const DigitalTemplatesPage = lazy(() => import("@/pages/digital-invitations/DigitalTemplatesPage"));
const TemplatePreviewPage = lazy(() => import("@/pages/digital-invitations/TemplatePreviewPage"));
const MyInvitationsPage = lazy(() => import("@/pages/digital-invitations/MyInvitationsPage"));
const EditInvitationPage = lazy(() => import("@/pages/digital-invitations/EditInvitationPage"));
const PublicInvitationPage = lazy(() => import("@/pages/digital-invitations/PublicInvitationPage"));

// Notifications - lazy loaded
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));

// UGC - lazy loaded
const MyUGCPage = lazy(() => import("@/pages/MyUGCPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Inisialisasi Query Client
const queryClient = new QueryClient();

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

import { ThemeProvider } from "@/components/ThemeProvider";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <CartProvider>
            <Toaster />

            <Sonner />

            <BrowserRouter>
              <AuthProvider>
                <ScrollToTop />

                <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    {/* Routes only for guests (not logged in) */}

                    <Route element={<PublicOnlyRoute />}>
                      <Route path="login" element={<LoginPage />} />

                      <Route path="register" element={<RegisterPage />} />
                    </Route>

                    {/* Routes only for authenticated users */}

                    <Route element={<ProtectedRoute />}>
                      <Route path="profile" element={<ProfilePage />} />

                      <Route path="checkout" element={<CheckoutPage />} />

                      <Route path="wishlist" element={<WishlistPage />} />

                      <Route path="my-reviews" element={<MyReviewsPage />} />

                      <Route path="my-photos" element={<MyUGCPage />} />

                      <Route path="notifications" element={<NotificationsPage />} />

                      <Route path="my-invitations" element={<MyInvitationsPage />} />

                      <Route path="my-invitations/:id/edit" element={<EditInvitationPage />} />

                      <Route
                        path="status-pesanan"
                        element={<OrderStatusPage />}
                      />

                      <Route
                        path="status-pesanan/:orderId"
                        element={<OrderStatusPage />}
                      />

                      <Route
                        path="order-confirmation/:orderId"
                        element={<OrderConfirmationPage />}
                      />
                    </Route>

                    {/* Public routes */}

                    <Route index element={<Home />} />

                    <Route path="products" element={<Products />} />

                    <Route
                      path="products/category/:category"
                      element={<Products />}
                    />

                    <Route path="product/:slug" element={<ProductDetail />} />

                    <Route path="digital-templates" element={<DigitalTemplatesPage />} />

                    <Route path="digital-templates/:slug" element={<TemplatePreviewPage />} />

                    <Route path="undangan/:slug" element={<PublicInvitationPage />} />

                    <Route path="cart" element={<Cart />} />

                    <Route path="wishlist/shared/:token" element={<SharedWishlistPage />} />

                    <Route path="gallery" element={<Gallery />} />

                    <Route path="CaraPesan" element={<CaraMemesan />} />

                    <Route
                      path="info-pemesanan-cetak"
                      element={<InfoPemesananCetak />}
                    />

                    <Route
                      path="syarat-ketentuan"
                      element={<SyaratKetentuan />}
                    />

                    <Route
                      path="kebijakan-privasi"
                      element={<KebijakanPrivasi />}
                    />

                    <Route
                      path="pengembalian-refund"
                      element={<PengembalianRefund />}
                    />

                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>

                <FloatingIcons />
              </AuthProvider>
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
