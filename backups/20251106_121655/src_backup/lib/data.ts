export interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
  bestseller?: boolean;
  variants?: ProductVariant[];
  type?: "guestbook" | "invitation" | "envelope" | "other";
  weight?: number;
}

export interface ProductVariant {
  type: string; // e.g., "Regular" or "Popup"
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
}

export const products: Product[] = [
  {
    id: "20",
    name: "Tradisional Jawa Modern",
    description:
    "Jenis Bahan:\n- Amplop : Jasmine 200 gsm\n- isi : Jasmine 200 gsm\n-  Ukuran: 10 x 19 cm\n",

    price: 1000,

    images: [
      "/products/tema-jawa-modern/1.jpg",
      "/products/tema-jawa-modern/2.jpg",
      "/products/tema-jawa-modern/3.jpg",
      "/products/tema-jawa-modern/4.jpg",
    ],
    category: "Wedding",
    featured: true,
    inStock: true,
    bestseller: true,
  },
  {
    id: "21",
    name: "Alice in Wonderland",
    description:
    "Jenis Bahan:\n- Amplop : Jasmine 200 gsm\n- isi : Jasmine 200 gsm\n-  Ukuran: 10 x 19 cm\n",
    
    price: 1000,
    
    images: [
      "/products/alice-wonderland-theme/1.jpg",
      "/products/alice-wonderland-theme/2.jpg",
      "/products/alice-wonderland-theme/3.jpg",
      "/products/alice-wonderland-theme/4.jpg",
      "/products/alice-wonderland-theme/5.jpg",
    ],
    category: "Wedding",
    featured: true,
    inStock: true,
    bestseller: true,
  },
  {
    id: "22",
    name: "Fairy Tale",
    description:
    "Jenis Bahan:\n- Amplop : Jasmine 200 gsm\n- isi : Jasmine 200 gsm\n-  Ukuran: 10 x 19 cm\n",
    
    price: 1000,
    
    images: [
      "/products/fairy-tale/1.jpg",
      "/products/fairy-tale/2.jpg",
      "/products/fairy-tale/3.jpg",
    ],
    category: "Wedding",
    featured: true,
    inStock: true,
    bestseller: true,
  },
  {
    id: "23",
    name: "Blue on Blue",
    description:
    "Jenis Bahan:\n- Amplop : Jasmine 200 gsm\n- isi : Jasmine 200 gsm\n-  Ukuran: 10 x 19 cm\n",
    
    price: 1000,
    
    images: [
      "/products/blue-on-blue/1.jpg",
      "/products/blue-on-blue/2.jpg",
      "/products/blue-on-blue/3.jpg",
    ],
    category: "Wedding",
    featured: true,
    inStock: true,
    bestseller: true,
  },
  {
    id: "24",
    name: "Romantic Purple",
    description:
    "Jenis Bahan:\n- Amplop : Jasmine 200 gsm\n- isi : Jasmine 200 gsm\n-  Ukuran: 10 x 19 cm\n",
    
    price: 1000,
    
    images: [
      "/products/romantic-purple/1.jpg",
      "/products/romantic-purple/2.jpg",
      "/products/romantic-purple/3.jpg",
    ],
    category: "Wedding",
    featured: true,
    inStock: true,
    bestseller: true,
  },
  // {
    //   id: "2",
    //   name: "AP.002",
  //   description:
  //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
  
  //   price: 1200,
  
  //   images: ["/products/detail-produk/ap.002.png"],
  //   category: "Wedding",
  //   featured: true,
  //   inStock: true,
  //   bestseller: true,
  // },
  // {
    //   id: "3",
    //   name: "AP.003",
    //   description:
    //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
    
    //   price: 1000,
    
    //   images: ["/products/detail-produk/ap.003.png"],
    //   category: "Wedding",
    //   featured: true,
    //   inStock: true,
    //   bestseller: true,
    // },
    // {
  //   id: "4",
  //   name: "AP.004",
  //   description:
  //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
  
  //   price: 1000,
  
  //   images: ["/products/detail-produk/ap.004.png"],
  //   category: "Wedding",
  //   featured: true,
  //   inStock: true,
  //   bestseller: true,
  // },
  // {
    //   id: "5",
    //   name: "LP.001",
    //   description:
    //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
    
    //   price: 1000,
    
    //   images: ["/products/detail-produk/lp.001.png"],
    //   category: "Wedding",
    //   featured: true,
    //   inStock: true,
    //   bestseller: true,
    // },
    // {
  //   id: "6",
  //   name: "LP.002",
  //   description:
  //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
  
  //   price: 1000,
  
  //   images: ["/products/detail-produk/lp.002.png"],
  //   category: "Wedding",
  //   featured: true,
  //   inStock: true,
  //   bestseller: true,
  // },
  // {
  //   id: "7",
  //   name: "LP.003",
  //   description:
  //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
  
  //   price: 1000,
  
  //   images: ["/products/detail-produk/lp.003.png"],
  //   category: "Wedding",
  //   featured: true,
  //   inStock: true,
  //   bestseller: true,
  // },
  // {
    //   id: "8",
    //   name: "LP.004",
    //   description:
    //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
    
    //   price: 1000,
    
    //   images: ["/products/detail-produk/lp.004.png"],
    //   category: "Wedding",
    //   featured: true,
    //   inStock: true,
    //   bestseller: true,
  // },
  // {
    //   id: "9",
    //   name: "LP.005",
    //   description:
    //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
    
    //   price: 1000,

    //   images: ["/products/detail-produk/lp.005.png"],
    //   category: "Wedding",
    //   featured: true,
  //   inStock: true,
  //   bestseller: true,
  // },
  // {
    //   id: "10",
  //   name: "RS.001",
  //   description:
  //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
  
  //   price: 1000,
  
  //   images: ["/products/detail-produk/rs.001.png"],
  //   category: "Wedding",
  //   featured: true,
  //   inStock: true,
  //   bestseller: true,
  // },
  // {
  //   id: "11",
  //   name: "LP.002",
  //   description:
  //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
  
  //   price: 1000,
  
  //   images: ["/products/detail-produk/rs.002.png"],
  //   category: "Wedding",
  //   featured: true,
  //   inStock: true,
  //   bestseller: true,
  // },
  // {
    //   id: "12",
    //   name: "RS.003",
    //   description:
    //     "Jenis Bahan:\n- isi : Linen White 200gsm\n- Hardboard: Yellow Board k.40\n- Ukuran: 10 x 19 cm\nLama Pengerjaan:\n- Desain Awal: 3-7 hari kerja\n - Persetujuan: Maksimal 5 kali persetujuan desain\n - Produksi: -+30 hari kerja (tidak termasuk tgl merah)\n - Pemesanan dibawah 50 hubungi WA.",
    
    //   price: 1000,
    
    //   images: ["/products/detail-produk/rs.003.png"],
    //   category: "Wedding",
    //   featured: true,
    //   inStock: true,
    //   bestseller: true,
    // },
    // {
    //   id: "1",
    //   name: "AP.001",
    //   description:
    //     "Jenis Bahan:\n- Amplop : Jasmine 200 gsm\n- isi : Jasmine 200 gsm\n-  Ukuran: 10 x 19 cm\n",
  
    //   price: 1000,
  
    //   images: ["/products/detail-produk/ap.001.png"],
    //   category: "Wedding",
    //   featured: true,
    //   inStock: true,
    //   bestseller: true,
    // },
    {
      id: "13",
    name: "GB.001",
    description:
      "Jenis Bahan:\n- Linen White 200 gsm\n- Ukuran: 21 x 29 cm\n- Kapasitas: 300 nama.",
      category: "guestbook",
      type: "guestbook",
      images: ["/products/detail-produk/g1.png"],
      featured: true,
    inStock: true,
    bestseller: true,
    variants: [
      {
        type: "Popup",
        price: 12000,
      },
      {
        type: "Regular",
        price: 10000,
      },
    ],
  },
];

export const categories = ["Wedding", "Guestbook"];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((product) => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}
