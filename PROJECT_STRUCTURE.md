# 📁 Struktur Proyek - Duainsan Story User Site

## Organisasi Folder yang Direkomendasikan

```
src/
├── components/                  # Komponen React
│   ├── auth/                   # Komponen autentikasi
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicOnlyRoute.tsx
│   │   └── ShippingForm.tsx
│   │
│   ├── layout/                 # Komponen tata letak
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── sections/           # Bagian halaman besar
│   │       ├── DuaInsanQuotes.tsx
│   │       ├── ExploreTheNewestTrend.tsx
│   │       ├── WhyDuaInsan.tsx
│   │       └── ExtraItemSelector.tsx
│   │
│   ├── product/                # Komponen produk
│   │   ├── ProductDetail/      # Detail produk
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductHero.tsx
│   │   │   ├── ProductServices.tsx
│   │   │   ├── ProductQuantitySelector.tsx
│   │   │   └── RelatedProducts.tsx
│   │   │
│   │   ├── ProductCard/        # Kartu produk
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductCardSkeleton.tsx
│   │   │
│   │   ├── selectors/          # Selector produk
│   │   │   ├── AddOnSelector.tsx
│   │   │   ├── OptionSelector.tsx
│   │   │   ├── ProductQuantitySelector.tsx
│   │   │   ├── ProductVariantSelect.tsx
│   │   │   ├── GuestbookTypeSelect.tsx
│   │   │   ├── PaperTypeSelect.jsx
│   │   │   ├── PaperSizeInput.jsx
│   │   │   └── InvitationSizeSelect.jsx
│   │   │
│   │   ├── categories/         # Kategori produk
│   │   │   ├── BestSeller.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   └── FeaturedProducts.tsx
│   │   │
│   │   └── banners/            # Banner produk
│   │       ├── SustainabilityBanner.tsx
│   │
│   ├── ui/                     # Komponen UI murni (shadcn-ui)
│   │   ├── buttons/            # Komponen tombol
│   │   │   ├── button.tsx
│   │   │   ├── button-variants.ts
│   │   │   ├── toggle.tsx
│   │   │   ├── toggle-variants.ts
│   │   │   └── toggle-group.tsx
│   │   │
│   │   ├── forms/              # Komponen form
│   │   │   ├── form.tsx
│   │   │   ├── form-hooks.ts
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── label.tsx
│   │   │   └── input-otp.tsx
│   │   │
│   │   ├── dialogs/            # Komponen dialog
│   │   │   ├── dialog.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   └── popover.tsx
│   │   │
│   │   ├── menus/              # Komponen menu
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── menubar.tsx
│   │   │   └── navigation-menu.tsx
│   │   │
│   │   ├── feedback/           # Komponen umpan balik
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── carousel.tsx
│   │   │   └── alert.tsx
│   │   │
│   │   ├── data/               # Komponen tabel & data
│   │   │   ├── table.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── scroll-area.tsx
│   │   │
│   │   ├── layout-ui/          # Komponen layout
│   │   │   ├── accordion.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── sidebar-variants.ts
│   │   │   └── sidebar-hooks.ts
│   │   │
│   │   ├── utils/              # Komponen utility
│   │   │   ├── badge.tsx
│   │   │   ├── badge-variants.ts
│   │   │   ├── card.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── command.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── navigation-menu-trigger-style.ts
│   │   │   ├── resizable.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   └── feature/            # Komponen fitur custom
│   │       ├── CartItem.tsx
│   │       ├── ThemeSwitcher.tsx
│   │       ├── WhatsAppFloat.tsx
│   │       ├── Newsletter.tsx
│   │       ├── SocialShare.tsx
│   │       ├── ActualBrandSlider.tsx
│   │       └── CenterModeSlider.jsx
│   │
│   ├── modals/                 # Modal komponen
│   │   └── InvitationForm.tsx
│   │
│   ├── context-providers/      # Context provider komponen
│   │   ├── ThemeProvider.tsx
│   │   └── other-providers.tsx
│   │
│   └── root/                   # Root level komponen
│       ├── App.css
│       └── App.tsx
│
├── pages/                      # Halaman (page components)
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── shopping/
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── CheckoutPage.tsx
│   │   └── OrderConfirmationPage.tsx
│   │
│   ├── info/
│   │   ├── Home.tsx
│   │   ├── Gallery.tsx
│   │   ├── OrderStatusPage.tsx
│   │   ├── CaraMemesan.tsx
│   │   ├── CaraPembayaran.tsx
│   │   ├── KebijakanPrivasi.tsx
│   │   ├── SyaratKetentuan.tsx
│   │   ├── PengembalianRefund.tsx
│   │   └── InfoPemesananCetak.tsx
│   │
│   └── error/
│       └── NotFound.tsx
│
├── services/                   # API & business logic services
│   ├── auth/
│   │   ├── authService.ts
│   │   ├── useLogin.ts
│   │   └── useRegister.ts
│   │
│   ├── ecommerce/
│   │   ├── cartService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── checkoutService.ts
│   │   └── galleryService.ts
│   │
│   ├── shipping/
│   │   ├── rajaOngkirService.ts
│   │
│   ├── options/
│   │   └── optionService.ts
│   │
│   ├── admin/
│   │   └── adminService.ts
│   │
│   ├── api.ts                  # Base API setup
│   ├── homeService.ts
│   └── index.ts                # Export semua services
│
├── context/                    # React Context
│   ├── AuthContext.tsx
│   ├── AuthContext-definition.ts
│   ├── useAuth.ts
│   └── other-contexts.ts
│
├── hooks/                      # Custom React Hooks
│   ├── cart/
│   │   ├── useCart.tsx
│   │   ├── use-cart.ts
│   │   └── cart-context.ts
│   │
│   ├── auth/
│   │   ├── useLogin.ts
│   │   └── useRegister.ts
│   │
│   ├── ui/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   └── navigation/
│       └── useScrollDirection.ts
│
├── lib/                        # Utility libraries
│   ├── api.ts                  # API client configuration
│   ├── data.ts                 # Static data & constants
│   ├── utils.ts                # Utility functions
│   └── constants.ts            # (recommended) App constants
│
├── types/                      # TypeScript type definitions
│   └── midtrans.d.ts
│
├── assets/                     # Static assets
│   └── logo/
│
├── styles/                     # Global styles (recommended)
│   ├── index.css
│   ├── theme-enhancements.css
│   └── variables.css           # (recommended) CSS variables
│
├── svg/                        # SVG assets
│   └── socialmedia.txt
│
├── main.tsx                    # Entry point
├── App.tsx                     # Root component
├── App.css
├── index.css
└── vite-env.d.ts
```

## Penjelasan Struktur

### 📦 `components/`
Menyimpan komponen React yang dapat digunakan kembali, diorganisir berdasarkan:
- **auth/**: Komponen terkait autentikasi
- **layout/**: Header, Footer, Sidebar, dan section besar
- **product/**: Semua komponen terkait produk
- **ui/**: Komponen UI base (shadcn-ui) terorganisir per kategori
- **modals/**: Modal khusus
- **context-providers/**: Provider komponen

### 📄 `pages/`
Halaman lengkap yang sesuai dengan routes aplikasi:
- **auth/**: Login, Register, Profile
- **shopping/**: Produk, Cart, Checkout
- **info/**: Home, Gallery, Terms, Privacy
- **error/**: 404 dan error pages

### 🔧 `services/`
API calls dan business logic terorganisir per domain:
- **auth/**: Autentikasi & user management
- **ecommerce/**: Produk, Cart, Order
- **shipping/**: Pengiriman & logistics
- **options/**: Product options & selections
- **admin/**: Admin operations

### 🪝 `hooks/`
Custom React hooks dikelompokkan per fungsi:
- **cart/**: Cart management
- **auth/**: Authentication
- **ui/**: UI interactions
- **navigation/**: Navigation related

### 🔗 `context/`
React Context untuk state management:
- Auth context
- Cart context (jika ada)
- Tema context

### 📚 `lib/`
Utility functions dan helpers:
- API client base configuration
- Utility functions
- Static data constants

### 🎨 `types/`
TypeScript definitions:
- Type definitions
- Interface declarations

## Panduan Migrasi

1. **Backup proyek** sebelum melakukan reorganisasi
2. **Update imports** di semua file yang menggunakan path lama
3. **Test aplikasi** untuk memastikan semua berfungsi dengan baik
4. **Update dokumentasi** jika ada

## Best Practices

- ✅ Gunakan folder untuk group related items
- ✅ Gunakan `index.ts` untuk barrel exports
- ✅ Jaga components tetap single-responsibility
- ✅ Gunakan relative paths (`../`) atau path aliases (`@/`)
- ✅ Organize by feature/domain, bukan by type
- ✅ Pindahkan komponen ke `shared/` jika digunakan di banyak tempat

## Path Aliases (Recommended)

Di `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

Ini memudahkan imports:
```typescript
// Sebelum (relative paths)
import { Button } from "../../../components/ui/button"

// Sesudah (dengan path aliases)
import { Button } from "@/components/ui/button"
```

