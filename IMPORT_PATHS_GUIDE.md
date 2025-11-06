# Import Path Modernization Guide

## Status: ✅ COMPLETED

All imports in the project have been updated to use path aliases!

```typescript
// ✅ Clean absolute paths
import { Button } from "@/components/ui/buttons/button"
import { useCart } from "@/hooks/cart/useCart"
import { productService } from "@/services/ecommerce/productService"
```

## Implementation Reference

### tsconfig.json Configuration

Path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForModuleExtension": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/context/*": ["./src/context/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/utils/*": ["./src/lib/utils.ts"],
      "@/api/*": ["./src/lib/api.ts"]
    }
  }
}
```

### Vite Configuration

Vite is configured to recognize path aliases in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/context': path.resolve(__dirname, './src/context'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/utils': path.resolve(__dirname, './src/lib/utils'),
      '@/api': path.resolve(__dirname, './src/lib/api'),
    },
  },
})
```

### TypeScript/JavaScript Configuration

For JavaScript files, path aliases are configured in `tsconfig.json` or `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```

## Current Usage

All imports now use the clean path alias format:

```typescript
// src/pages/shopping/ProductDetail.tsx
import { ProductCard } from "@/components/ui/feature/ProductCard"
import { useCart } from "@/hooks/cart/useCart"
import { productService } from "@/services/ecommerce/productService"
import { formatCurrency } from "@/utils"
```

## Benefits

✅ **Highly readable** - Clear import origins  
✅ **Easy refactoring** - No need to update imports when moving files  
✅ **Consistency** - All imports use the same format  
✅ **IDE Support** - Auto-complete and navigation work perfectly  
✅ **Production-ready** - Build system handles it optimally  

## Find & Replace Reference (For Future Updates)

If you need to update imports in new files, use Find & Replace in VS Code (`Ctrl+H`):

### Components
```
Find:    from ["']\.\.\/\.\.\/\.\.\/components\/([^"']+)["']
Replace: from "@/components/$1"
```

### Pages
```
Find:    from ["']\.\.\/\.\.\/\.\.\/pages\/([^"']+)["']
Replace: from "@/pages/$1"
```

### Services
```
Find:    from ["']\.\.\/\.\.\/\.\.\/services\/([^"']+)["']
Replace: from "@/services/$1"
```

### Hooks
```
Find:    from ["']\.\.\/\.\.\/\.\.\/hooks\/([^"']+)["']
Replace: from "@/hooks/$1"
```

Enable "Use Regular Expression" mode (toggle `.*` button)

## Barrel Exports (Optional tapi Recommended)

Buat `index.ts` di setiap folder untuk export mudah:

### `src/components/ui/feature/index.ts`
```typescript
export { CartItem } from './CartItem'
export { ThemeSwitcher } from './ThemeSwitcher'
export { WhatsAppFloat } from './WhatsAppFloat'
export { Newsletter } from './Newsletter'
export { SocialShare } from './SocialShare'
```

### Penggunaan
```typescript
// Sebelum
import { CartItem } from "@/components/ui/feature/CartItem"
import { Newsletter } from "@/components/ui/feature/Newsletter"

// Sesudah
import { CartItem, Newsletter } from "@/components/ui/feature"
```

## Tips & Tricks

### 1. Alias untuk Library yang Sering Digunakan
```json
{
  "paths": {
    "@/api": ["./src/lib/api.ts"],
    "@/utils": ["./src/lib/utils.ts"],
    "@/cn": ["./src/lib/utils.ts"]  // untuk clsx/cn function
  }
}
```

### 2. Environment-specific Imports
```json
{
  "paths": {
    "@/config": ["./src/config/config.ts"]
  }
}
```

### 3. Linter Configuration (ESLint)

Add to `eslint.config.js` atau `.eslintrc`:
```javascript
{
  "import/resolver": {
    "alias": {
      "map": [
        ["@/*", "./src/*"],
        ["@/components", "./src/components"],
        ["@/pages", "./src/pages"]
      ]
    }
  }
}
```

## Common Issues

### ❌ Path alias tidak bekerja di IDE
- ✅ Restart VS Code
- ✅ Pastikan TypeScript version match
- ✅ Check `tsconfig.json` sudah update

### ❌ Build error dengan vite
- ✅ Update `vite.config.ts` dengan alias
- ✅ Install `@types/node` jika belum: `npm install -D @types/node`

### ❌ Module not found saat development
- ✅ Pastikan path benar (case-sensitive di Linux/Mac)
- ✅ Cek kembali file path di `src/` folder

## Checklist Implementasi

- [x] Update `tsconfig.json` dengan paths
- [x] Update `vite.config.ts` dengan resolve.alias
- [x] Restart VS Code / IDE
- [x] Test dengan import baru: `import { Button } from "@/components/ui/buttons/button"`
- [x] Migrate existing imports (gunakan Find & Replace)
- [x] Run `npm run build` untuk validasi
- [ ] Test aplikasi berjalan normal
- [x] Commit changes ke git

