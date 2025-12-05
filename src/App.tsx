// --- Imports dari library ---
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

// --- Imports Halaman (Pages) ---
import Home from "@/pages/info/Home";
import ShippingForm from "@/features/auth/components/ShippingForm";
import Products from "@/pages/shopping/Products";
import ProductDetail from "@/pages/shopping/ProductDetail";
import NotFound from "@/pages/error/NotFound";
import Cart from "@/pages/shopping/Cart";
import Gallery from "@/pages/info/Gallery";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import CaraMemesan from "@/pages/info/CaraMemesan";
import InfoPemesananCetak from "@/pages/info/InfoPemesananCetak";
import ProfilePage from "@/pages/auth/ProfilePage";
import CheckoutPage from "@/pages/shopping/CheckoutPage";
import OrderStatusPage from "@/pages/info/OrderStatusPage";
import OrderConfirmationPage from "@/pages/shopping/OrderConfirmationPage";
import SyaratKetentuan from "@/pages/info/SyaratKetentuan";
import KebijakanPrivasi from "@/pages/info/KebijakanPrivasi";
import PengembalianRefund from "@/pages/info/PengembalianRefund";
import { WishlistPage } from "@/pages/wishlist/WishlistPage";
import { SharedWishlistPage } from "@/pages/wishlist/SharedWishlistPage";
import { MyReviewsPage } from "@/pages/reviews/MyReviewsPage";

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
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <CartProvider>
          <Toaster />

          <Sonner />

          <BrowserRouter>
            <AuthProvider>
              <ScrollToTop />

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

              <FloatingIcons />
            </AuthProvider>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
