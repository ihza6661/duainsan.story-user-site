# 📋 Checklist Reorganisasi & Cleanup

## Pre-Reorganisasi (Persiapan)

### 1. Backup & Version Control
- [ ] Commit semua changes ke git
- [ ] Buat branch baru untuk reorganisasi: `git checkout -b refactor/project-structure`
- [ ] Backup folder `src/` secara manual (optional tapi recommended)

### 2. Audit Dependencies
- [ ] Check imports yang salah atau tidak terpakai
- [ ] Jalankan ESLint: `npm run lint`
- [ ] Lihat warning/error yang ada

```bash
npm run lint
# Jika ada masalah unused imports, fix dulu sebelum reorganisasi
```

### 3. Test Suite
- [ ] Pastikan semua tests pass
- [ ] Jalankan build test: `npm run build`

```bash
npm run build
# Pastikan tidak ada error build
```

## Fase Reorganisasi

### Step 1: Pindahkan Folder
```bash
# Buat struktur folder baru
bash reorganize-project.sh

# Atau lakukan manually untuk kontrol lebih:
# 1. Buat folder-folder
# 2. Pindahkan file satu per satu
# 3. Update imports
```

### Step 2: Update Imports
- [ ] Gunakan Find & Replace untuk mass import updates
- [ ] Manual review file-file penting
- [ ] Cek circular dependencies

#### Script untuk find circular dependencies:
```bash
npm install -D dpdm
npx dpdm --output ./circular-deps.html src/main.tsx
# Buka circular-deps.html untuk lihat hasilnya
```

### Step 3: Update Configuration Files

#### `tsconfig.json`
- [ ] Add path aliases
- [ ] Verify `baseUrl` is set to `.`
- [ ] Check `include` mencakup semua source files

#### `vite.config.ts`
- [ ] Add resolve.alias untuk path aliases
- [ ] Test development server: `npm run dev`

#### `.eslintrc` atau `eslint.config.js`
- [ ] Update import resolver settings

### Step 4: Verifikasi
- [ ] Buka dev server: `npm run dev`
- [ ] Test beberapa halaman kunci:
  - [ ] Home page
  - [ ] Product detail
  - [ ] Cart page
  - [ ] Checkout page
  - [ ] Login/Register
- [ ] Check browser console untuk errors
- [ ] Test fitur yang critical:
  - [ ] Add to cart
  - [ ] Checkout flow
  - [ ] Authentication
  - [ ] Navigation

### Step 5: Build & Test Production
- [ ] Run build: `npm run build`
- [ ] Tidak ada error atau warning?
- [ ] Preview build: `npm run preview`
- [ ] Test navigasi di production build

## Post-Reorganisasi (Cleanup & Optimization)

### 1. Barrel Exports (Recommended)

Buat `index.ts` di folder-folder utama:

#### `src/components/ui/buttons/index.ts`
```typescript
export { Button, buttonVariants } from './button'
export { toggle, toggleVariants } from './toggle'
export { toggleGroup } from './toggle-group'
```

#### `src/hooks/cart/index.ts`
```typescript
export { useCart } from './useCart'
export { CartProvider } from './cart-context'
```

- [ ] Buat barrel exports untuk sub-folders
- [ ] Test imports dengan new syntax
- [ ] Update existing imports ke barrel exports

### 2. Unused Imports & Dead Code

```bash
# Install tools untuk detect unused
npm install -D unimported

# Scan untuk unused imports
npx unimported

# Fix unused imports
npx unimported --remove
```

### 3. Code Coverage & Analysis

```bash
# Check bundle size
npm run build
npm install -D rollup-plugin-bundle-size
npm run build -- --plugin bundle-size

# Analyze bundle
npm install -D webpack-bundle-analyzer
```

### 4. Update Documentation

- [ ] Update `README.md` dengan struktur folder baru
- [ ] Update deployment docs
- [ ] Update contribution guidelines
- [ ] Add folder structure diagram

### 5. Linting & Formatting

```bash
# Linting
npm run lint -- --fix

# Format code (jika menggunakan prettier)
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"
```

### 6. Performance Optimization

- [ ] Review dan optimize imports
- [ ] Check untuk unused dependencies di `package.json`
- [ ] Tree-shaking verification

```bash
npm ls --depth=0  # Check top-level dependencies
```

## Checklist File Structure

Verifikasi struktur folder:

### Components
- [ ] `src/components/auth/` - Auth components
- [ ] `src/components/layout/` - Layout dengan sub-folder `sections/`
- [ ] `src/components/product/` - Product dengan sub-folders
- [ ] `src/components/ui/` - UI components terorganisir per kategori
- [ ] `src/components/modals/` - Modal components
- [ ] `src/components/context-providers/` - Provider components

### Pages
- [ ] `src/pages/auth/` - Auth pages
- [ ] `src/pages/shopping/` - Shopping pages
- [ ] `src/pages/info/` - Info pages
- [ ] `src/pages/error/` - Error pages

### Services
- [ ] `src/services/auth/` - Auth services
- [ ] `src/services/ecommerce/` - E-commerce services
- [ ] `src/services/shipping/` - Shipping services
- [ ] `src/services/options/` - Options services
- [ ] `src/services/admin/` - Admin services

### Hooks
- [ ] `src/hooks/cart/` - Cart hooks
- [ ] `src/hooks/auth/` - Auth hooks
- [ ] `src/hooks/ui/` - UI hooks
- [ ] `src/hooks/navigation/` - Navigation hooks

### Lainnya
- [ ] `src/lib/` - Utilities dan API setup
- [ ] `src/context/` - React Context
- [ ] `src/types/` - TypeScript types
- [ ] `src/styles/` - Global styles
- [ ] `src/assets/` - Static assets

## Git Workflow

### Commit Strategy

```bash
# Step 1: Reorganisasi struktur
git add src/
git commit -m "refactor: reorganize project structure"

# Step 2: Update imports
git add src/
git commit -m "refactor: update imports to path aliases"

# Step 3: Configuration
git add tsconfig.json vite.config.ts
git commit -m "config: add path aliases to tsconfig and vite"

# Step 4: Documentation
git add PROJECT_STRUCTURE.md IMPORT_PATHS_GUIDE.md
git commit -m "docs: add structure and import guide"
```

### Create Pull Request

```bash
git push origin refactor/project-structure
# Create PR di GitHub dengan description lengkap
```

## Rollback Strategy

Jika ada masalah serius:

```bash
# Restore dari backup
cp -r backups/<timestamp>/src_backup ./src

# Atau reset ke commit sebelumnya
git reset --hard HEAD~4  # Sesuaikan jumlah commits
```

## Maintenance Checklist (Post-Merge)

- [ ] Monitor build times - apakah lebih cepat?
- [ ] Check bundle size - apakah lebih kecil?
- [ ] Review performance metrics
- [ ] Update team documentation
- [ ] Share struktur baru dengan team
- [ ] Update IDE settings jika diperlukan

## Success Criteria

✅ Semua tests pass  
✅ No breaking changes di features  
✅ Bundle size tidak meningkat  
✅ Build time tetap sama atau lebih cepat  
✅ Zero console errors di browser  
✅ Imports lebih readable dan maintainable  
✅ Team bisa navigasi struktur dengan mudah  
✅ Documentation updated  

## Common Pitfalls & Solutions

| Masalah | Solusi |
|---------|--------|
| Import error setelah reorganisasi | Cek path benar, case-sensitive |
| Path aliases tidak bekerja | Restart IDE, cek tsconfig.json & vite.config.ts |
| Build error | Check circular dependencies, unused imports |
| Performance degradation | Check bundle analyzer, optimize lazy loading |
| Git merge conflicts | Manual merge atau reset dan redo |

## Timeline Rekomendasi

```
Day 1:
- [ ] Backup & preparation
- [ ] Create feature branch
- [ ] Manual structure planning

Day 2-3:
- [ ] Execute reorganization script
- [ ] Update imports (mass + manual)
- [ ] Configuration updates

Day 4:
- [ ] Testing & verification
- [ ] Cleanup & optimization
- [ ] Documentation

Day 5:
- [ ] Code review & merge
- [ ] Monitor production
- [ ] Team training
```

## Resources

- [Project Structure Guide](./PROJECT_STRUCTURE.md)
- [Import Paths Guide](./IMPORT_PATHS_GUIDE.md)
- [Vite Configuration](https://vitejs.dev/config/)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig/)

## Questions & Support

Jika ada pertanyaan atau menemukan issue:
1. Check documentation dulu
2. Cek git history untuk context
3. Review error message dengan detail
4. Ask team lead untuk guidance

---

**Last Updated:** November 2025  
**Status:** Ready for Implementation  

