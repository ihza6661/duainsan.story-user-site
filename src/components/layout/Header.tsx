import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// --- Impor Aset & Komponen Anak ---
import ShoppingBag from "@/svg/shopping-bag.svg?react";
import UserIcon from "@/svg/user.svg?react";
import SearchIcon from "@/svg/search.svg?react";
import MenuIcon from "@/svg/menu.svg?react";
import Sidebar from "@/components/layout/Sidebar";
import { ThemeSwitcher } from "@/components/ui/feature/ThemeSwitcher";

// --- Impor Hook Kustom & Konteks ---
import { useCart } from "@/hooks/cart/use-cart";
import { useScrollDirection } from "@/hooks/navigation/useScrollDirection";
import { useAuth } from "@/context/useAuth";

const Header = () => {
  // --- State Lokal untuk UI ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Menggunakan Hook dari Konteks dan Kustom ---
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const { cart, isLoading: isCartLoading } = useCart(); // Ambil seluruh objek cart dan status loading-nya
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
  const baseHeaderClasses = "fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300";
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
            <button
              className="text-shop-text md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-6 h-6 text-foreground" />
            </button>
            <div className="hidden md:flex items-center space-x-8">
              <button
                className="text-shop-text"
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon className="w-6 h-6 text-foreground" />
              </button>
              <nav className="hidden tablet-custom:flex items-center space-x-6 tracking-normal">
                <Link to="/products" className="text-sm uppercase link-underline-animation">
                  All Products
                </Link>
                <Link to="/gallery" className="text-sm uppercase link-underline-animation">
                  Gallery
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
              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Ikon User */}
              {isAuthLoading ? (
                <div className="relative flex items-center justify-center w-8 h-10">
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="relative flex items-center justify-center w-8 h-10"
                  >
                    <UserIcon className="w-6 h-6 text-foreground" />
                  </button>
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-xl z-50 py-2 text-sm">
                      <div className="px-4 py-2 border-b font-medium text-foreground truncate">
                        {user.full_name}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="block w-full text-left px-4 py-2 hover:bg-muted text-foreground"
                      >
                        Profil Saya
                      </Link>
                      <Link
                        to="/status-pesanan"
                        onClick={() => setShowUserDropdown(false)}
                        className="block w-full text-left px-4 py-2 hover:bg-muted text-foreground"
                      >
                        Status Pesanan
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-muted text-destructive font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="relative flex items-center justify-center w-10 h-10">
                  <p>Login</p>
                </Link>
              )}

              {/* Ikon Keranjang Belanja */}
              <Link to="/cart">
                <button className="relative flex items-center justify-center w-8 h-10">
                  <ShoppingBag className="w-6 h-6 text-foreground" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 sm:-top-3 -right-1 bg-popover text-[10px] md:text-xs rounded-full h-4 w-3 md:h-5 md:w-4 flex items-center justify-center min-w-[30px] px-[2px]">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
