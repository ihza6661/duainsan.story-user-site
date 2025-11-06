#!/bin/bash

# Script untuk reorganisasi struktur folder Duainsan Story User Site
# Jalankan dengan: bash reorganize-project.sh

set -e  # Exit on error

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
SRC_DIR="./src"

echo "🔄 Memulai reorganisasi struktur proyek..."
echo "📦 Backup akan disimpan di: $BACKUP_DIR"

# Buat backup
mkdir -p "$BACKUP_DIR"
cp -r "$SRC_DIR" "$BACKUP_DIR/src_backup"
echo "✅ Backup dibuat"

# Buat struktur folder baru
echo "📁 Membuat struktur folder baru..."

# Components structure
mkdir -p "$SRC_DIR/components/auth"
mkdir -p "$SRC_DIR/components/layout/sections"
mkdir -p "$SRC_DIR/components/product/ProductDetail"
mkdir -p "$SRC_DIR/components/product/ProductCard"
mkdir -p "$SRC_DIR/components/product/selectors"
mkdir -p "$SRC_DIR/components/product/categories"
mkdir -p "$SRC_DIR/components/product/banners"
mkdir -p "$SRC_DIR/components/ui/buttons"
mkdir -p "$SRC_DIR/components/ui/forms"
mkdir -p "$SRC_DIR/components/ui/dialogs"
mkdir -p "$SRC_DIR/components/ui/menus"
mkdir -p "$SRC_DIR/components/ui/feedback"
mkdir -p "$SRC_DIR/components/ui/data"
mkdir -p "$SRC_DIR/components/ui/layout-ui"
mkdir -p "$SRC_DIR/components/ui/utils"
mkdir -p "$SRC_DIR/components/ui/feature"
mkdir -p "$SRC_DIR/components/modals"
mkdir -p "$SRC_DIR/components/context-providers"

# Pages structure
mkdir -p "$SRC_DIR/pages/auth"
mkdir -p "$SRC_DIR/pages/shopping"
mkdir -p "$SRC_DIR/pages/info"
mkdir -p "$SRC_DIR/pages/error"

# Services structure
mkdir -p "$SRC_DIR/services/auth"
mkdir -p "$SRC_DIR/services/ecommerce"
mkdir -p "$SRC_DIR/services/shipping"
mkdir -p "$SRC_DIR/services/options"
mkdir -p "$SRC_DIR/services/admin"

# Hooks structure
mkdir -p "$SRC_DIR/hooks/cart"
mkdir -p "$SRC_DIR/hooks/auth"
mkdir -p "$SRC_DIR/hooks/ui"
mkdir -p "$SRC_DIR/hooks/navigation"

# Styles folder
mkdir -p "$SRC_DIR/styles"

echo "✅ Struktur folder dibuat"

# Pindahkan file-file (HATI-HATI: Sesuaikan dengan file aktual Anda)
echo "🚚 Memindahkan file-file..."

# Auth components
mv -f "$SRC_DIR/components/ProtectedRoute.tsx" "$SRC_DIR/components/auth/" 2>/dev/null || true
mv -f "$SRC_DIR/components/PublicOnlyRoute.tsx" "$SRC_DIR/components/auth/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ShippingForm.tsx" "$SRC_DIR/components/auth/" 2>/dev/null || true

# Layout sections
mv -f "$SRC_DIR/components/layout/ExploreTheNewestTrend.tsx" "$SRC_DIR/components/layout/sections/" 2>/dev/null || true
mv -f "$SRC_DIR/components/layout/ExtraItemSelector.tsx" "$SRC_DIR/components/layout/sections/" 2>/dev/null || true
mv -f "$SRC_DIR/components/layout/DuaInsanQuotes.tsx" "$SRC_DIR/components/layout/sections/" 2>/dev/null || true
mv -f "$SRC_DIR/components/layout/WhyDuaInsan.tsx" "$SRC_DIR/components/layout/sections/" 2>/dev/null || true
mv -f "$SRC_DIR/components/layout/ProductVariantSelect.tsx" "$SRC_DIR/components/layout/" 2>/dev/null || true

# Product detail components
mv -f "$SRC_DIR/components/product/ProductGallery.tsx" "$SRC_DIR/components/product/ProductDetail/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/ProductHero.tsx" "$SRC_DIR/components/product/ProductDetail/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/ProductServices.tsx" "$SRC_DIR/components/product/ProductDetail/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/ProductQuantitySelector.tsx" "$SRC_DIR/components/product/ProductDetail/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/RelatedProducts.tsx" "$SRC_DIR/components/product/ProductDetail/" 2>/dev/null || true

# Product selectors
mv -f "$SRC_DIR/components/product/AddOnSelector.tsx" "$SRC_DIR/components/product/selectors/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/OptionSelector.tsx" "$SRC_DIR/components/product/selectors/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/GuestbookTypeSelect.tsx" "$SRC_DIR/components/product/selectors/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/ProductVariantSelect.tsx" "$SRC_DIR/components/product/selectors/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/PaperTypeSelect.jsx" "$SRC_DIR/components/product/selectors/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/PaperSizeInput.jsx" "$SRC_DIR/components/product/selectors/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/InvitationSizeSelect.jsx" "$SRC_DIR/components/product/selectors/" 2>/dev/null || true

# Product categories
mv -f "$SRC_DIR/components/product/BestSeller.tsx" "$SRC_DIR/components/product/categories/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/CategoryGrid.tsx" "$SRC_DIR/components/product/categories/" 2>/dev/null || true
mv -f "$SRC_DIR/components/product/FeaturedProducts.tsx" "$SRC_DIR/components/product/categories/" 2>/dev/null || true

# Product banners
mv -f "$SRC_DIR/components/product/SustainabilityBanner.tsx" "$SRC_DIR/components/product/banners/" 2>/dev/null || true

# Pages
mv -f "$SRC_DIR/pages/LoginPage.tsx" "$SRC_DIR/pages/auth/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/RegisterPage.tsx" "$SRC_DIR/pages/auth/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/ProfilePage.tsx" "$SRC_DIR/pages/auth/" 2>/dev/null || true

mv -f "$SRC_DIR/pages/Products.tsx" "$SRC_DIR/pages/shopping/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/ProductDetail.tsx" "$SRC_DIR/pages/shopping/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/Cart.tsx" "$SRC_DIR/pages/shopping/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/CheckoutPage.tsx" "$SRC_DIR/pages/shopping/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/OrderConfirmationPage.tsx" "$SRC_DIR/pages/shopping/" 2>/dev/null || true

mv -f "$SRC_DIR/pages/Home.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/Gallery.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/OrderStatusPage.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/CaraMemesan.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/CaraPembayaran.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/KebijakanPrivasi.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/SyaratKetentuan.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/PengembalianRefund.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true
mv -f "$SRC_DIR/pages/InfoPemesananCetak.tsx" "$SRC_DIR/pages/info/" 2>/dev/null || true

mv -f "$SRC_DIR/pages/NotFound.tsx" "$SRC_DIR/pages/error/" 2>/dev/null || true

# Services
mv -f "$SRC_DIR/services/authService.ts" "$SRC_DIR/services/auth/" 2>/dev/null || true
mv -f "$SRC_DIR/services/useLogin.ts" "$SRC_DIR/services/auth/" 2>/dev/null || true
mv -f "$SRC_DIR/services/useRegister.ts" "$SRC_DIR/services/auth/" 2>/dev/null || true

mv -f "$SRC_DIR/services/cartService.ts" "$SRC_DIR/services/ecommerce/" 2>/dev/null || true
mv -f "$SRC_DIR/services/productService.ts" "$SRC_DIR/services/ecommerce/" 2>/dev/null || true
mv -f "$SRC_DIR/services/orderService.ts" "$SRC_DIR/services/ecommerce/" 2>/dev/null || true
mv -f "$SRC_DIR/services/checkoutService.ts" "$SRC_DIR/services/ecommerce/" 2>/dev/null || true
mv -f "$SRC_DIR/services/galleryService.ts" "$SRC_DIR/services/ecommerce/" 2>/dev/null || true

mv -f "$SRC_DIR/services/rajaOngkirService.ts" "$SRC_DIR/services/shipping/" 2>/dev/null || true
mv -f "$SRC_DIR/services/optionService.ts" "$SRC_DIR/services/options/" 2>/dev/null || true
mv -f "$SRC_DIR/services/adminService.ts" "$SRC_DIR/services/admin/" 2>/dev/null || true

# Hooks
mv -f "$SRC_DIR/hooks/useCart.tsx" "$SRC_DIR/hooks/cart/" 2>/dev/null || true
mv -f "$SRC_DIR/hooks/use-cart.ts" "$SRC_DIR/hooks/cart/" 2>/dev/null || true
mv -f "$SRC_DIR/hooks/cart-context.ts" "$SRC_DIR/hooks/cart/" 2>/dev/null || true

mv -f "$SRC_DIR/hooks/useLogin.ts" "$SRC_DIR/hooks/auth/" 2>/dev/null || true
mv -f "$SRC_DIR/hooks/useRegister.ts" "$SRC_DIR/hooks/auth/" 2>/dev/null || true

mv -f "$SRC_DIR/hooks/use-mobile.tsx" "$SRC_DIR/hooks/ui/" 2>/dev/null || true
mv -f "$SRC_DIR/hooks/use-toast.ts" "$SRC_DIR/hooks/ui/" 2>/dev/null || true

mv -f "$SRC_DIR/hooks/useScrollDirection.ts" "$SRC_DIR/hooks/navigation/" 2>/dev/null || true

# Styles
mv -f "$SRC_DIR/index.css" "$SRC_DIR/styles/" 2>/dev/null || true
mv -f "$SRC_DIR/theme-enhancements.css" "$SRC_DIR/styles/" 2>/dev/null || true
mv -f "$SRC_DIR/App.css" "$SRC_DIR/styles/" 2>/dev/null || true

# UI Components - Buttons
mv -f "$SRC_DIR/components/ui/button.tsx" "$SRC_DIR/components/ui/buttons/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/button-variants.ts" "$SRC_DIR/components/ui/buttons/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/toggle.tsx" "$SRC_DIR/components/ui/buttons/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/toggle-variants.ts" "$SRC_DIR/components/ui/buttons/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/toggle-group.tsx" "$SRC_DIR/components/ui/buttons/" 2>/dev/null || true

# UI Components - Forms
mv -f "$SRC_DIR/components/ui/form.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/form-hooks.ts" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/input.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/textarea.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/checkbox.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/radio-group.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/select.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/switch.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/label.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/input-otp.tsx" "$SRC_DIR/components/ui/forms/" 2>/dev/null || true

# UI Components - Dialogs
mv -f "$SRC_DIR/components/ui/dialog.tsx" "$SRC_DIR/components/ui/dialogs/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/alert-dialog.tsx" "$SRC_DIR/components/ui/dialogs/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/drawer.tsx" "$SRC_DIR/components/ui/dialogs/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/popover.tsx" "$SRC_DIR/components/ui/dialogs/" 2>/dev/null || true

# UI Components - Menus
mv -f "$SRC_DIR/components/ui/dropdown-menu.tsx" "$SRC_DIR/components/ui/menus/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/context-menu.tsx" "$SRC_DIR/components/ui/menus/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/menubar.tsx" "$SRC_DIR/components/ui/menus/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/navigation-menu.tsx" "$SRC_DIR/components/ui/menus/" 2>/dev/null || true

# UI Components - Feedback
mv -f "$SRC_DIR/components/ui/toast.tsx" "$SRC_DIR/components/ui/feedback/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/toaster.tsx" "$SRC_DIR/components/ui/feedback/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/sonner.tsx" "$SRC_DIR/components/ui/feedback/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/progress.tsx" "$SRC_DIR/components/ui/feedback/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/carousel.tsx" "$SRC_DIR/components/ui/feedback/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/alert.tsx" "$SRC_DIR/components/ui/feedback/" 2>/dev/null || true

# UI Components - Data
mv -f "$SRC_DIR/components/ui/table.tsx" "$SRC_DIR/components/ui/data/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/pagination.tsx" "$SRC_DIR/components/ui/data/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/scroll-area.tsx" "$SRC_DIR/components/ui/data/" 2>/dev/null || true

# UI Components - Layout UI
mv -f "$SRC_DIR/components/ui/accordion.tsx" "$SRC_DIR/components/ui/layout-ui/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/tabs.tsx" "$SRC_DIR/components/ui/layout-ui/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/collapsible.tsx" "$SRC_DIR/components/ui/layout-ui/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/separator.tsx" "$SRC_DIR/components/ui/layout-ui/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/sidebar.tsx" "$SRC_DIR/components/ui/layout-ui/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/sidebar-variants.ts" "$SRC_DIR/components/ui/layout-ui/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/sidebar-hooks.ts" "$SRC_DIR/components/ui/layout-ui/" 2>/dev/null || true

# UI Components - Utils
mv -f "$SRC_DIR/components/ui/badge.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/badge-variants.ts" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/card.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/avatar.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/aspect-ratio.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/breadcrumb.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/calendar.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/chart.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/command.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/hover-card.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/navigation-menu-trigger-style.ts" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/resizable.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/sheet.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/skeleton.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/slider.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/tooltip.tsx" "$SRC_DIR/components/ui/utils/" 2>/dev/null || true

# UI Components - Feature
mv -f "$SRC_DIR/components/ui/CartItem.tsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/ThemeSwitcher.tsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/WhatsAppFloat.tsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/Newsletter.tsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/SocialShare.tsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/ActualBrandSlider.tsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/CenterModeSlider.jsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/ProductCard.tsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true
mv -f "$SRC_DIR/components/ui/ProductCardSkeleton.tsx" "$SRC_DIR/components/ui/feature/" 2>/dev/null || true

echo "✅ File-file dipindahkan"

echo ""
echo "✨ Reorganisasi selesai!"
echo ""
echo "📌 Langkah selanjutnya:"
echo "1. Review struktur folder baru dengan 'tree -d src/'"
echo "2. Jalankan 'npm run build' untuk memastikan tidak ada error import"
echo "3. Jika ada error, gunakan backup di: $BACKUP_DIR"
echo ""
echo "💡 Untuk restore dari backup, jalankan:"
echo "   cp -r $BACKUP_DIR/src_backup ./src"
echo ""
