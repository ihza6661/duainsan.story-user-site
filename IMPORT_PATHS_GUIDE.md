# Import Path Modernization Guide

## Masalah Saat Ini

Proyek ini masih menggunakan relative imports yang panjang:

```typescript
// ❌ Sulit dibaca dan tidak maintainable
import { Button } from "../../../components/ui/button"
import { useCart } from "../../../hooks/cart/useCart"
import { productService } from "../../../services/ecommerce/productService"
```

## Solusi: Path Aliases

### Step 1: Update `tsconfig.json`

Tambahkan atau update bagian `compilerOptions.paths`:

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

### Step 2: Update `vite.config.ts`

Sesuaikan Vite agar mengenali path aliases:

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

### Step 3: Update `jsconfig.json` atau `tsconfig.json` (untuk JS files)

Jika ada file `.jsx`, tambahkan atau update di root:

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

## Contoh Penggunaan

### Sebelum (Relative Imports)
```typescript
// src/pages/shopping/ProductDetail.tsx
import { ProductCard } from "../../../components/ui/feature/ProductCard"
import { useCart } from "../../../hooks/cart/useCart"
import { productService } from "../../../services/ecommerce/productService"
import { formatCurrency } from "../../../lib/utils"
```

### Sesudah (Path Aliases)
```typescript
// src/pages/shopping/ProductDetail.tsx
import { ProductCard } from "@/components/ui/feature/ProductCard"
import { useCart } from "@/hooks/cart/useCart"
import { productService } from "@/services/ecommerce/productService"
import { formatCurrency } from "@/utils"
```

## Keuntungan

✅ **Lebih readable** - Jelas dari mana modul diimport  
✅ **Refactoring lebih mudah** - Tidak perlu ubah semua imports saat move file  
✅ **Consistency** - Semua imports menggunakan format yang sama  
✅ **IDE Support** - Auto-complete dan navigation bekerja sempurna  
✅ **Production-ready** - Build system menangani dengan optimal  

## Migration Strategy

### Gunakan Find & Replace di VS Code

1. Buka Find & Replace (`Ctrl+H`)
2. Gunakan regex untuk mass replacement

#### Contoh 1: Components
```
Find:    from ["']\.\.\/\.\.\/\.\.\/components\/([^"']+)["']
Replace: from "@/components/$1"
```

#### Contoh 2: Pages
```
Find:    from ["']\.\.\/\.\.\/\.\.\/pages\/([^"']+)["']
Replace: from "@/pages/$1"
```

#### Contoh 3: Services
```
Find:    from ["']\.\.\/\.\.\/\.\.\/services\/([^"']+)["']
Replace: from "@/services/$1"
```

#### Contoh 4: Hooks
```
Find:    from ["']\.\.\/\.\.\/\.\.\/hooks\/([^"']+)["']
Replace: from "@/hooks/$1"
```

Pastikan toggle "Use Regular Expression" aktif (tombol `.*`)

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

- [ ] Update `tsconfig.json` dengan paths
- [ ] Update `vite.config.ts` dengan resolve.alias
- [ ] Restart VS Code / IDE
- [ ] Test dengan import baru: `import { Button } from "@/components/ui/buttons/button"`
- [ ] Migrate existing imports (gunakan Find & Replace)
- [ ] Run `npm run build` untuk validasi
- [ ] Test aplikasi berjalan normal
- [ ] Commit changes ke git

