# 📁 Struktur Proyek - Duainsan Story User Site

## Organisasi Folder

Struktur ini diorganisir berdasarkan fitur (`features`) untuk mengelompokkan fungsionalitas terkait dan komponen bersama (`components`) untuk elemen UI yang dapat digunakan kembali.

```
src/
├── assets/                     # Aset statis (gambar, font) yang diproses oleh Vite
│   ├── metode-pembayaran.webp
│   └── logo/
├── components/                  # Komponen React bersama yang dapat digunakan kembali
│   ├── ThemeProvider.tsx
│   ├── context-providers/      # Komponen wrapper untuk context provider
│   ├── icons/                  # Komponen ikon SVG
│   │   ├── FacebookIcon.tsx
│   │   ├── InstagramIcon.tsx
│   │   └── PinterestIcon.tsx
│   ├── layout/                 # Komponen tata letak utama (Header, Footer, Sidebar)
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── Sidebar.tsx
│   │   └── sections/           # Bagian besar halaman yang dapat digunakan kembali
│   ├── modals/                 # Komponen modal
│   └── ui/                     # Komponen UI generik (Button, Card, Input, dll.)
│       ├── ActualBrandSlider.tsx
│       ├── CategoryGrid.tsx
│       ├── FeaturedProducts.tsx
│       ├── Newsletter.tsx
│       ├── SocialShare.tsx
│       └── ThemeSwitcher.tsx
│
├── features/                   # Modul berbasis fitur (logika domain-spesifik)
│   ├── auth/                   # Fitur autentikasi (komponen, hook, service)
│   ├── cart/                   # Fitur keranjang belanja
│   ├── gallery/                # Fitur galeri
│   ├── home/                   # Komponen & logika spesifik halaman beranda
│   ├── info/                   # Fitur untuk halaman informasional
│   ├── order/                  # Fitur proses pemesanan
│   └── product/                # Fitur terkait produk
│
├── hooks/                      # Custom React Hooks
│   ├── navigation/             # Hook terkait navigasi
│   └── ui/                     # Hook terkait interaksi UI
│
├── lib/                        # Pustaka dan fungsi utilitas
│   ├── api.ts                  # Konfigurasi klien API (misalnya, Axios)
│   ├── constants.ts            # Nilai konstan yang digunakan di seluruh aplikasi
│   ├── data.ts                 # Data statis atau mock
│   └── utils.ts                # Fungsi utilitas umum
│
├── pages/                      # Komponen halaman yang dipetakan ke rute
│   ├── auth/                   # Halaman autentikasi (Login, Register)
│   ├── error/                  # Halaman error (misalnya, 404 Not Found)
│   ├── info/                   # Halaman informasional (Tentang Kami, Kontak)
│   └── shopping/               # Halaman e-commerce (Daftar Produk, Detail Produk, Keranjang)
│
├── services/                   # Layanan API dan logika bisnis
│   ├── homeService.ts
│   ├── admin/
│   ├── options/
│   └── shipping/
│
├── styles/                     # File styling global
│   ├── App.css
│   ├── index.css
│   └── theme-enhancements.css
│
├── svg/                        # Aset SVG yang akan digunakan sebagai komponen React
│   ├── menu.svg
│   ├── search.svg
│   ├── shopping-bag.svg
│   ├── socialmedia.txt
│   └── user.svg
│
├── types/                      # Definisi tipe TypeScript global
│   └── midtrans.d.ts
│
├── App.tsx                     # Komponen aplikasi utama
├── main.tsx                    # Titik masuk aplikasi (entry point)
└── vite-env.d.ts               # Definisi tipe untuk lingkungan Vite
```

## Penjelasan Struktur

### 📦 `features/`
Ini adalah inti dari arsitektur. Setiap folder di dalam `features` mewakili domain fungsionalitas tertentu dalam aplikasi (misalnya, `auth`, `product`, `cart`). Setiap folder fitur dapat berisi komponen, hook, dan service-nya sendiri yang spesifik untuk domain tersebut.

###  reusable `components/`
Folder ini berisi komponen yang sepenuhnya generik dan dapat digunakan di berbagai fitur.
- **layout/**: Komponen struktural seperti `Header`, `Footer`, dan `Sidebar`.
- **ui/**: Komponen UI kecil dan murni seperti `Button`, `Input`, `Card`, yang sering kali berasal dari library seperti Shadcn/UI.
- **icons/**: Komponen ikon SVG.

### 📄 `pages/`
Komponen ini mewakili halaman lengkap dan bertanggung jawab untuk menyusun komponen dari `features` dan `components` untuk membentuk tampilan yang sesuai dengan rute tertentu.

### 🔧 `services/`
Berisi logika untuk berkomunikasi dengan API eksternal. File-file ini memisahkan logika pengambilan data dari komponen UI.

### 🪝 `hooks/`
Berisi custom React hooks yang dapat digunakan kembali di seluruh aplikasi dan tidak spesifik untuk satu fitur.

### 📚 `lib/`
Kumpulan fungsi utilitas, konfigurasi instance API, dan konstanta.

## Path Aliases (Recommended)

Untuk menjaga impor tetap bersih dan mudah dikelola, gunakan path aliases yang dikonfigurasi di `tsconfig.json`.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

Ini memungkinkan impor yang lebih bersih:
```typescript
// Daripada menggunakan path relatif yang panjang:
import { Button } from "../../../components/ui/button";

// Gunakan alias yang rapi:
import { Button } from "@/components/ui/button";
```