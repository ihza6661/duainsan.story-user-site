# 📐 Visual Structure Diagram

## Current vs Recommended

### ❌ SEBELUM (Current Structure)

```
src/
├── components/              ← 60+ files campur aduk
│   ├── CartItem.tsx
│   ├── ProtectedRoute.tsx
│   ├── PublicOnlyRoute.tsx
│   ├── ShippingForm.tsx
│   ├── ThemeExamples.tsx
│   ├── ThemeProvider.tsx
│   ├── hero/
│   ├── layout/              ← 9 files, butuh organize
│   ├── modal/               ← 1 file
│   ├── product/             ← 14 files campur
│   └── ui/                  ← 60+ files flat
│
├── pages/                   ← 13 files flat
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProfilePage.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── CheckoutPage.tsx
│   ├── Gallery.tsx
│   ├── Home.tsx
│   ├── CaraMemesan.tsx
│   ├── NotFound.tsx
│   └── ... (13 files total)
│
├── services/                ← 10 files flat
│   ├── authService.ts
│   ├── cartService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── ... (10 files)
│
├── hooks/                   ← 7 files flat
│   ├── useCart.tsx
│   ├── use-cart.ts
│   ├── useLogin.ts
│   └── ... (7 files)
│
├── context/                 ← 4 files
│   ├── AuthContext.tsx
│   ├── AuthContext-definition.ts
│   └── useAuth.ts
│
└── ...

MASALAH:
❌ Sulit mencari file (60+ files di components/ui/)
❌ Tidak clear separation of concerns
❌ Hard to maintain
❌ Confusing structure untuk new developers
```

### ✅ SESUDAH (Recommended Structure)

```
src/
├── components/
│   ├── auth/                     ← Auth specific
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicOnlyRoute.tsx
│   │   └── ShippingForm.tsx
│   │
│   ├── layout/                   ← Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── sections/            ← Large sections
│   │       ├── DuaInsanQuotes.tsx
│   │       ├── ExploreTheNewestTrend.tsx
│   │       └── WhyDuaInsan.tsx
│   │
│   ├── product/                  ← Product components
│   │   ├── ProductDetail/       ← Detail page components
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductHero.tsx
│   │   │   ├── ProductServices.tsx
│   │   │   ├── ProductQuantitySelector.tsx
│   │   │   └── RelatedProducts.tsx
│   │   │
│   │   ├── ProductCard/         ← Card components
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductCardSkeleton.tsx
│   │   │
│   │   ├── selectors/           ← Product selections
│   │   │   ├── AddOnSelector.tsx
│   │   │   ├── OptionSelector.tsx
│   │   │   ├── ProductVariantSelect.tsx
│   │   │   ├── GuestbookTypeSelect.tsx
│   │   │   ├── PaperTypeSelect.jsx
│   │   │   ├── PaperSizeInput.jsx
│   │   │   └── InvitationSizeSelect.jsx
│   │   │
│   │   ├── categories/          ← Category displays
│   │   │   ├── BestSeller.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   └── FeaturedProducts.tsx
│   │   │
│   │   └── banners/             ← Product banners
│   │       └── SustainabilityBanner.tsx
│   │
│   ├── ui/                       ← Reusable UI components
│   │   ├── buttons/             ← Button components
│   │   │   ├── button.tsx
│   │   │   ├── button-variants.ts
│   │   │   ├── toggle.tsx
│   │   │   ├── toggle-variants.ts
│   │   │   └── toggle-group.tsx
│   │   │
│   │   ├── forms/               ← Form components
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
│   │   ├── dialogs/             ← Dialog components
│   │   │   ├── dialog.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   └── popover.tsx
│   │   │
│   │   ├── menus/               ← Menu components
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── menubar.tsx
│   │   │   └── navigation-menu.tsx
│   │   │
│   │   ├── feedback/            ← Feedback components
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── carousel.tsx
│   │   │   └── alert.tsx
│   │   │
│   │   ├── data/                ← Data display
│   │   │   ├── table.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── scroll-area.tsx
│   │   │
│   │   ├── layout-ui/           ← Layout utilities
│   │   │   ├── accordion.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── sidebar-variants.ts
│   │   │   └── sidebar-hooks.ts
│   │   │
│   │   ├── utils/               ← Utility components
│   │   │   ├── badge.tsx
│   │   │   ├── badge-variants.ts
│   │   │   ├── card.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── command.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   └── feature/             ← Custom features
│   │       ├── CartItem.tsx
│   │       ├── ThemeSwitcher.tsx
│   │       ├── WhatsAppFloat.tsx
│   │       ├── Newsletter.tsx
│   │       ├── SocialShare.tsx
│   │       ├── ActualBrandSlider.tsx
│   │       └── CenterModeSlider.jsx
│   │
│   ├── modals/
│   │   └── InvitationForm.tsx
│   │
│   ├── context-providers/
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeExamples.tsx
│   │
│   └── hero/
│       └── Hero.tsx
│
├── pages/
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
├── services/
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
│   │   └── rajaOngkirService.ts
│   │
│   ├── options/
│   │   └── optionService.ts
│   │
│   ├── admin/
│   │   └── adminService.ts
│   │
│   ├── api.ts
│   ├── homeService.ts
│   └── index.ts
│
├── hooks/
│   ├── cart/
│   │   ├── useCart.tsx
│   │   ├── use-cart.ts
│   │   ├── cart-context.ts
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── useLogin.ts
│   │   ├── useRegister.ts
│   │   └── index.ts
│   │
│   ├── ui/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── index.ts
│   │
│   ├── navigation/
│   │   ├── useScrollDirection.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── context/
│   ├── AuthContext.tsx
│   ├── AuthContext-definition.ts
│   ├── useAuth.ts
│   └── index.ts
│
├── lib/
│   ├── api.ts
│   ├── data.ts
│   ├── utils.ts
│   └── constants.ts
│
├── types/
│   └── midtrans.d.ts
│
├── styles/
│   ├── index.css
│   ├── theme-enhancements.css
│   ├── App.css
│   └── variables.css
│
├── assets/
│   └── logo/
│
├── svg/
│   └── socialmedia.txt
│
├── main.tsx
├── vite-env.d.ts
└── App.tsx

KEUNTUNGAN:
✅ Clear separation of concerns
✅ Easy to find files (max 50 per folder)
✅ Logical grouping
✅ Easy to scale
✅ Good for team collaboration
✅ Better IDE navigation
```

## Import Comparison

### Sebelum
```typescript
// ❌ Long relative paths
import { Button } from "../../../components/ui/button"
import { ProductCard } from "../../../components/ui/ProductCard"
import { useCart } from "../../../hooks/useCart"
import { productService } from "../../../services/productService"
import { formatPrice } from "../../../lib/utils"
```

### Sesudah
```typescript
// ✅ Clean absolute paths with aliases
import { Button } from "@/components/ui/buttons/button"
import { ProductCard } from "@/components/ui/feature/ProductCard"
import { useCart } from "@/hooks/cart"
import { productService } from "@/services/ecommerce/productService"
import { formatPrice } from "@/lib/utils"
```

## Dependency Flow (Best Practice)

```
┌─────────────────────────────────────────┐
│          Pages (Containers)             │
└──────────────┬──────────────────────────┘
               │ imports from
               ▼
┌─────────────────────────────────────────┐
│        Components (Presentational)      │
└──────────────┬──────────────────────────┘
               │ imports from
               ▼
┌─────────────────────────────────────────┐
│           Hooks (Logic)                 │
└──────────────┬──────────────────────────┘
               │ imports from
               ▼
┌─────────────────────────────────────────┐
│       Services (API/Business Logic)     │
└──────────────┬──────────────────────────┘
               │ imports from
               ▼
┌─────────────────────────────────────────┐
│  Lib/Utils/Types (Pure Functions)       │
└─────────────────────────────────────────┘

RULE: Files dapat import dari layer di bawah, TIDAK boleh dari atas!
Pages > Components > Hooks > Services > Lib/Utils
```

## Folder Tree (Compact View)

```
src/
├── components/
│   ├── auth/
│   ├── layout/
│   │   └── sections/
│   ├── product/
│   │   ├── ProductDetail/
│   │   ├── ProductCard/
│   │   ├── selectors/
│   │   ├── categories/
│   │   └── banners/
│   ├── ui/
│   │   ├── buttons/
│   │   ├── forms/
│   │   ├── dialogs/
│   │   ├── menus/
│   │   ├── feedback/
│   │   ├── data/
│   │   ├── layout-ui/
│   │   ├── utils/
│   │   └── feature/
│   ├── modals/
│   ├── context-providers/
│   └── hero/
├── pages/
│   ├── auth/
│   ├── shopping/
│   ├── info/
│   └── error/
├── services/
│   ├── auth/
│   ├── ecommerce/
│   ├── shipping/
│   ├── options/
│   └── admin/
├── hooks/
│   ├── cart/
│   ├── auth/
│   ├── ui/
│   └── navigation/
├── context/
├── lib/
├── types/
├── styles/
├── assets/
└── svg/
```

## Stats Comparison

| Metric | Sebelum | Sesudah |
|--------|---------|---------|
| Max files per folder | 60+ (ui/) | 15-20 |
| Folder depth | 2-3 | 3-4 |
| Import complexity | High | Low |
| Navigation ease | Hard | Easy |
| New dev ramp-up | 2-3 days | 1 day |
| Maintenance | Difficult | Easy |
| Scalability | Limited | Excellent |

## Migration Path

```
Week 1:
- Monday: Read docs & plan
- Tuesday: Create new folder structure
- Wednesday: Move & organize components
- Thursday: Update imports
- Friday: Test & merge

Result: Well-organized project structure ✅
```

