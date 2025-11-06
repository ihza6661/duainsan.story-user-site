// src/components/layout/Sidebar.tsx

import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/ecommerce/productService";
import type { ProductCategory } from "@/services/ecommerce/productService";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [productsOpen, setProductsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  // --- Perbaikan: Mengambil Kategori dari API ---
  const { data: categories, isLoading, isError } = useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const companyItems = [
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Info Pemesanan Undangan Cetak", path: "/info-pemesanan-cetak" },
    { name: "Cara Memesan", path: "/CaraPesan" },
    { name: "Pengiriman", path: "/shipping" },
  ];

  const renderDropdown = (
    label: string,
    isOpen: boolean,
    toggleOpen: () => void,
    items: { name: string; path: string }[]
  ) => (
    <div className="border-b border-border py-4">
      <button
        className={`text-foreground w-full text-left text-base uppercase tracking-widest flex items-center justify-between ${isOpen ? "text-muted-foreground" : ""
          }`}
        onClick={toggleOpen}
      >
        {label}
        <span
          className="text-lg transform transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>
      <div
        className={`space-y-4 overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
      >
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block text-sm text-foreground"
            onClick={onClose}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );

  const productLinks = categories?.map(cat => ({
    name: cat.name,
    path: `/products/category/${cat.slug}`,
  })) || [];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[500px] bg-background z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-lg text-foreground uppercase tracking-wider">Menu</h2>
            <button onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 tracking-widest">
            {isLoading ? (
              <p>Memuat kategori...</p>
            ) : isError ? (
              <p className="text-destructive">Gagal memuat kategori.</p>
            ) : (
              renderDropdown(
                "Products",
                productsOpen,
                () => setProductsOpen(!productsOpen),
                productLinks
              )
            )}
            {renderDropdown(
              "Company",
              companyOpen,
              () => setCompanyOpen(!companyOpen),
              companyItems
            )}
          </nav>



          {/* Footer (Login/Logout) */}
          <div className="mt-8 space-y-3 text-sm">
            {user ? (
              <div>
                <span>Hi, {user.full_name}</span>
                <button onClick={() => { logout(); onClose(); }} className="block w-full text-left mt-2">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="block" onClick={onClose}>
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
