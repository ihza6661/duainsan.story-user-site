# 🎯 Best Practices untuk Struktur Proyek React

## 1. Naming Conventions

### Components
```typescript
// ✅ Good
components/
├── Header.tsx          # PascalCase untuk component
├── footer.tsx          # (jika lowercase acceptable)
├── ProductCard.tsx
├── AddToCart Button.tsx  // jika multi-word jelas

// ❌ Avoid
components/
├── header.tsx          # inconsistent casing
├── product_card.tsx    # snake_case
├── addtocartbutton.tsx # hard to read
```

### Folders
```typescript
// ✅ Good - kebab-case or camelCase
src/
├── components/
├── auth-pages/
├── product-detail/
├── use-cart/           # hooks
├── auth-service/       # services

// ❌ Avoid
src/
├── COMPONENTS/         # UPPERCASE
├── Auth_Pages/         # Mixed case
├── productDetail/      # camelCase (less common for folders)
```

### Constants & Types
```typescript
// ✅ Good
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  USERS: '/api/users',
}

type ProductProps = {
  id: string
  name: string
}

interface IUser {
  id: string
  name: string
}

// ❌ Avoid
const api_endpoints = {}  // snake_case for constants
type productProps = {}    // lowercase
```

## 2. File Organization

### Single Responsibility Principle

```typescript
// ✅ Good - one responsibility per file
src/components/
├── Button/
│   ├── Button.tsx       # Component only
│   ├── Button.test.tsx  # Tests
│   ├── Button.css       # Styles
│   ├── Button.stories.tsx # Storybook
│   └── index.ts         # Export

// ❌ Avoid - too much in one file
src/components/
├── Button.tsx           # Component + tests + stories all mixed
```

### Component Structure with Related Files

```typescript
// ✅ Good
src/components/product/ProductCard/
├── ProductCard.tsx           # Main component
├── ProductCard.module.css    # Scoped styles
├── ProductCard.test.tsx      # Tests
├── ProductCard.types.ts      # Type definitions
├── ProductCard.stories.tsx   # Storybook
├── useProductCard.ts         # Related hook
└── index.ts                  # Barrel export

// Usage
export { ProductCard } from './ProductCard'
export type { ProductCardProps } from './ProductCard.types'
export { useProductCard } from './useProductCard'
```

## 3. Folder Size Guidelines

```typescript
// ✅ Recommended - manageable folder sizes
components/
├── ui/                  # 50-100 components (base UI)
├── product/             # 20-30 product-related
├── layout/              # 5-10 layout components
├── auth/                # 3-5 auth components

// ❌ Avoid - too large
components/
├── ui/                  # 300+ components (hard to navigate)
├── product/             # 80+ files (mixed concerns)
```

## 4. Import Patterns

### Absolute vs Relative

```typescript
// ✅ Preferred - Absolute imports (dengan path aliases)
import { Button } from '@/components/ui/buttons/button'
import { useCart } from '@/hooks/cart'
import { productService } from '@/services/ecommerce/productService'

// ⚠️ Acceptable - Relative imports (untuk adjacent files)
import { ProductCardSkeleton } from './ProductCardSkeleton'
import { formatPrice } from '../utils'

// ❌ Avoid - Complex relative imports
import { Button } from '../../../../../../../components/ui/button'
import { useCart } from '../../../../../../hooks/cart'
```

### Import Organization

```typescript
// ✅ Good - Organized imports
import React from 'react'                          // 1. External libraries
import { useState } from 'react'

import { Button } from '@/components/ui/buttons'  // 2. Project imports
import { useCart } from '@/hooks'
import { productService } from '@/services'

import { formatPrice } from './utils'             // 3. Relative imports
import styles from './ProductCard.module.css'     // 4. Styles

// ❌ Avoid - Random order
import styles from './ProductCard.css'
import React from 'react'
import { productService } from '@/services'
import { useState } from 'react'
import { Button } from '@/components/ui/buttons'
```

## 5. Index Files (Barrel Exports)

### Structure

```typescript
// src/components/ui/buttons/index.ts
export { Button } from './Button'
export { buttonVariants } from './Button'
export type { ButtonProps, ButtonVariants } from './Button'

export { Toggle } from './Toggle'
export type { ToggleProps } from './Toggle'

export { ToggleGroup } from './ToggleGroup'
export type { ToggleGroupProps } from './ToggleGroup'
```

### Usage

```typescript
// ✅ Clean
import { Button, buttonVariants } from '@/components/ui/buttons'

// ❌ Verbose
import { Button } from '@/components/ui/buttons/Button'
import { buttonVariants } from '@/components/ui/buttons/Button'
```

## 6. Shared Components vs Feature Components

```typescript
// ✅ Good separation

src/components/
├── ui/                       # Reusable UI components
│   ├── buttons/
│   ├── forms/
│   ├── dialogs/
│   └── ...
│
├── product/                  # Product-specific components
│   ├── ProductCard.tsx
│   ├── ProductGallery.tsx
│   └── ProductHero.tsx
│
└── common/                   # Global shared (optional)
    ├── Header.tsx
    ├── Footer.tsx
    └── Sidebar.tsx


// Usage
// Product page
import { ProductCard } from '@/components/product'
import { Button } from '@/components/ui/buttons'

// Other pages
import { Button } from '@/components/ui/buttons'
```

## 7. Service Layer Organization

```typescript
// ✅ Good - Organized by domain
src/services/
├── auth/
│   ├── authService.ts      # Login, logout, register
│   ├── tokenService.ts     # JWT token management
│   └── index.ts            # Exports
│
├── ecommerce/
│   ├── productService.ts
│   ├── cartService.ts
│   ├── orderService.ts
│   └── index.ts
│
├── shipping/
│   ├── rajaOngkirService.ts
│   └── index.ts
│
└── api.ts                  # Base API client

// Usage
import { authService, productService } from '@/services'
// or
import { authService } from '@/services/auth'
```

## 8. Hooks Organization

```typescript
// ✅ Good - Organized by purpose
src/hooks/
├── cart/
│   ├── useCart.ts          # Main cart hook
│   ├── useCartItems.ts     # Derived hook
│   └── index.ts
│
├── auth/
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── index.ts
│
├── ui/
│   ├── useMediaQuery.ts
│   ├── useMobile.ts
│   └── index.ts
│
└── index.ts               # Main export

// Usage
import { useCart, useUser } from '@/hooks'
import { useCart } from '@/hooks/cart'
```

## 9. Avoid Common Mistakes

### ❌ Don't Mix Concerns

```typescript
// ❌ BAD - Mixed concerns
src/components/
├── ProductCard.tsx    # Contains API call, business logic, styling, display

// ✅ GOOD - Separated concerns
src/components/product/
├── ProductCard.tsx          # Display only
src/hooks/
├── useProduct.ts            # Business logic
src/services/ecommerce/
├── productService.ts        # API calls
```

### ❌ Don't Create Too Many Levels

```typescript
// ❌ BAD - Too deep
src/features/products/components/detail/sections/gallery/carousel/items/

// ✅ GOOD - Reasonable depth
src/components/product/ProductDetail/ProductGallery.tsx
```

### ❌ Don't Have Circular Dependencies

```typescript
// ❌ BAD - Circular
// file-a.ts imports from file-b.ts
// file-b.ts imports from file-a.ts

// ✅ GOOD - Unidirectional
// UI components don't import from pages
// Pages import from components
// Services don't import from pages/components
```

## 10. Version Control & Git

### Folder-level Commits

```bash
# ✅ Good - Specific changes
git commit -m "refactor(components/ui): reorganize button variants"
git commit -m "feat(services/auth): add token refresh logic"

# ❌ Avoid - Too broad
git commit -m "refactor: moved files around"
```

## 11. Testing Structure

### Test File Location

```typescript
// ✅ Option 1 - Co-located with source
src/components/Button/
├── Button.tsx
├── Button.test.tsx
└── index.ts

// ✅ Option 2 - Separate __tests__ folder
src/components/Button/
├── Button.tsx
├── __tests__/
│   └── Button.test.tsx
└── index.ts

// ✅ Option 3 - Separate tests folder at root
src/
├── components/
├── services/
tests/
├── components/
├── services/
└── ...
```

### Test Organization

```typescript
// ✅ Good
describe('ProductCard', () => {
  describe('rendering', () => {
    it('should render product name')
    it('should render product price')
  })
  
  describe('interactions', () => {
    it('should handle add to cart click')
    it('should handle favorite toggle')
  })
})
```

## 12. Documentation

### README per Folder

```typescript
// src/components/README.md
# Components

## Organization

- **ui/**: Reusable UI components (buttons, forms, dialogs, etc.)
- **product/**: Product-specific components
- **layout/**: Layout components (header, footer, sidebar)
- **auth/**: Authentication-related components

## Adding New Component

1. Create folder with component name
2. Add component file, types, tests, styles
3. Export from index.ts
4. Update parent index.ts if needed
```

## 13. Scalability Checklist

As project grows:

- [ ] Keep folder size manageable (< 50 files per folder)
- [ ] Move related features to separate folders
- [ ] Create shared utilities as needed
- [ ] Extract repeated patterns to hooks
- [ ] Create service layers for business logic
- [ ] Document folder purposes
- [ ] Regular refactoring (quarterly)
- [ ] Monitor bundle size
- [ ] Track component usage
- [ ] Update team documentation

## 14. Code Splitting & Lazy Loading

```typescript
// ✅ Good - Code split heavy pages
import { lazy, Suspense } from 'react'

const ProductDetail = lazy(() => import('@/pages/shopping/ProductDetail'))
const Checkout = lazy(() => import('@/pages/shopping/Checkout'))

// In Router
<Suspense fallback={<LoadingSpinner />}>
  <ProductDetail />
</Suspense>
```

## Summary

| Aspek | Best Practice |
|-------|----------------|
| **Naming** | PascalCase components, kebab-case folders, UPPERCASE constants |
| **Organization** | By feature/domain, not by type |
| **Imports** | Absolute paths dengan aliases |
| **Size** | Max 50 files per folder |
| **Depth** | Max 3-4 levels |
| **Dependencies** | Unidirectional, no circular |
| **Exports** | Barrel exports dari index.ts |
| **Testing** | Co-located with source |
| **Documentation** | README per folder utama |
| **Scalability** | Regular refactoring |

---

**Remember:** Structure yang baik adalah yang mudah dipahami dan dimaintain oleh seluruh team!

