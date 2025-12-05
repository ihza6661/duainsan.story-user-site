import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// --- Impor Aset & Komponen Anak ---
import Sidebar from "@/components/layout/Sidebar";
import { Menu, User, ShoppingBag, Heart, Package, MessageSquare, LogOut } from "lucide-react";

import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

// --- Impor Hook Kustom & Konteks ---
import { useCart } from "@/features/cart/hooks/cart/use-cart";
import { useScrollDirection } from "@/hooks/navigation/useScrollDirection";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/buttons/button";

const Header = () => {
  // --- State Lokal untuk UI ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Menggunakan Hook dari Konteks dan Kustom ---
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const { cart } = useCart(); // Ambil objek cart dari hook
  const { isVisible } = useScrollDirection();
  const location = useLocation();

  // --- Logika Internal Komponen ---
  const path = location.pathname;
  const isProductDetailPage = path.startsWith("/product/");

  // Perbaikan: Lakukan pengecekan keamanan sebelum mengakses properti.
  // Jika 'cart' atau 'cart.items' belum ada, anggap totalnya 0.
  const totalItems = cart?.items?.length || 0;

  // --- Efek Samping (Side Effects) ---
  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY === 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Fungsi Handler ---
  const handleLogout = async () => {
    setShowUserDropdown(false);
    await logout();
  };

  // --- Kalkulasi Class untuk Styling Dinamis ---
  const baseHeaderClasses =
    "fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300";
  const showHideClass = isVisible ? "translate-y-0" : "-translate-y-full";
  const pageStyle = isProductDetailPage
    ? isAtTop
      ? "bg-background/50 text-foreground"
      : "bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    : "bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b";

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className={`${baseHeaderClasses} ${showHideClass} ${pageStyle}`}>
        <div className="px-0 sm:px-8 flex items-center justify-between h-16 md:h-20">
          {/* ================== Sisi Kiri (Navigasi) ================== */}
          <div className="flex items-center pl-3">
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-foreground" />

              {/* <MenuIcon className="text-foreground" /> */}
            </Button>
            {/* Theme Switcher beside Menu on Mobile */}
            <div className="md:hidden">
              <ThemeSwitcher />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Button
                variant="ghost"
                className=""
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-foreground" />

                {/* <MenuIcon className="text-foreground" /> */}
              </Button>
              <nav className="hidden tablet-custom:flex items-center space-x-6 tracking-normal">
                <Link
                  to="/products"
                  className="text-sm uppercase link-underline-animation"
                >
                  Produk
                </Link>
                <Link
                  to="/gallery"
                  className="text-sm uppercase link-underline-animation"
                >
                  Galeri
                </Link>
              </nav>
            </div>
          </div>

          {/* ================== Logo Tengah ================== */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-md md:text-4xl font-semibold font-fancy tracking-widest text-start text-nowrap italic text-foreground"
            >
              DuaInsan.Story
            </Link>
          </div>

          {/* ================== Sisi Kanan (Aksi Pengguna) ================== */}
          <div className="flex items-center">
            <div className="flex items-center justify-center pr-2 gap-0 sm:gap-1">
              {/* Theme Switcher - Hidden on mobile, visible on desktop */}
              <div className="hidden md:block">
                <ThemeSwitcher />
              </div>
              {/* Ikon User */}
              {isAuthLoading ? (
                <div className="relative flex items-center justify-center w-8 h-10">
                  <div className="w-5 h-5 rounded-full animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="relative flex items-center justify-center w-8 h-10"
                  >
                    <User className="w-6 h-6 text-foreground" />
                  </Button>
                  {showUserDropdown && (
                    <div className="bg-popover absolute right-0 mt-2 w-48 border rounded-lg shadow-xl z-50 py-2 text-sm">
                      <div className="px-4 py-2 border-b font-medium text-foreground truncate">
                        {user.full_name}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full text-left px-4 py-2 hover:bg-muted text-foreground flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profil Saya
                      </Link>
                      <Link
                        to="/status-pesanan"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full text-left px-4 py-2 hover:bg-muted text-foreground flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        Status Pesanan
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full text-left px-4 py-2 hover:bg-muted text-foreground flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Wishlist Saya
                      </Link>
                      <Link
                        to="/my-reviews"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full text-left px-4 py-2 hover:bg-muted text-foreground flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Ulasan Saya
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full text-left hover:bg-accent/30 text-destructive font-medium flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="relative flex items-center justify-center w-10 h-10"
                >
                  <p>Masuk</p>
                </Link>
              )}

              {/* Notification Bell (only for logged in users) */}
              {user && <NotificationBell />}

              {/* Ikon Keranjang Belanja */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  className="relative flex items-center justify-center"
                >
                  <ShoppingBag className="text-foreground" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 sm:-top-2 -right-1 bg-secondary text-[10px] md:text-xs rounded-full h-4 w-3 md:h-5 md:w-4 flex items-center justify-center min-w-[30px] px-[2px]">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
