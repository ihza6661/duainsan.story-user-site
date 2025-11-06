import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import PinterestIcon from "@/components/icons/PinterestIcon";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/ecommerce/productService";
import type { ProductCategory } from "@/services/ecommerce/productService";
import "@/styles/index.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Fetch product categories from the API
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<ProductCategory[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-background pt-8 sm:pt-16 pb-8 border-t border-border">
      <div className="px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 mb-12 gap-4 sm:gap-8">
          {/* Products Section (Now Dynamic) */}
          <div>
            <button
              className="sm:border-none border-b pb-8 sm:pb-0 border-border w-full flex items-center justify-between text-left text-lg uppercase mb-4 font-normal tracking-widest md:cursor-default md:pointer-events-none text-foreground"
              onClick={() => toggleSection("products")}
            >
              Produk
              <span className="text-4xl text-muted-foreground font-thin md:hidden ml-2">
                {openSection === "products" ? "−" : "+"}
              </span>
            </button>
            <ul
              className={`transition-all ease-in-out duration-1000 overflow-hidden md:block ${
                openSection === "products"
                  ? "max-h-96"
                  : "max-h-0 md:max-h-full"
              }`}
            >
              {isLoading && (
                <li>
                  <span className="text-muted-foreground text-sm">
                    Loading...
                  </span>
                </li>
              )}
              {isError && (
                <li>
                  <span className="text-destructive text-sm">
                    Error loading categories.
                  </span>
                </li>
              )}
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products/category/${category.slug}`}
                    className="text-muted-foreground text-sm block py-1 hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Section (Static) */}
          <div>
            <button
              className="sm:border-none border-b pb-8 sm:pb-0 border-border w-full flex items-center justify-between text-left text-lg uppercase mb-4 font-normal tracking-widest md:cursor-default md:pointer-events-none text-foreground"
              onClick={() => toggleSection("service")}
            >
              Layanan
              <span className="text-4xl text-muted-foreground font-thin md:hidden ml-2">
                {openSection === "service" ? "−" : "+"}
              </span>
            </button>
            <ul
              className={`transition-all duration-300 overflow-hidden md:block ${
                openSection === "service" ? "max-h-96" : "max-h-0 md:max-h-full"
              }`}
            >
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground text-sm block py-1 hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-muted-foreground text-sm block py-1 hover:text-foreground"
                >
                  Pengiriman
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground text-sm block py-1 hover:text-foreground"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Section (Static) */}
          <div>
            <button
              className="sm:border-none border-b pb-8 sm:pb-0 border-border w-full flex items-center justify-between text-left text-lg uppercase mb-4 font-normal tracking-widest md:cursor-default md:pointer-events-none text-foreground"
              onClick={() => toggleSection("info")}
            >
              Informasi
              <span className="text-4xl text-muted-foreground font-thin md:hidden ml-2">
                {openSection === "info" ? "−" : "+"}
              </span>
            </button>
            <ul
              className={`transition-all duration-300 overflow-hidden md:block ${
                openSection === "info" ? "max-h-96" : "max-h-0 md:max-h-full"
              }`}
            >
              <li>
                <Link
                  to="/syarat-ketentuan"
                  className="text-muted-foreground text-sm block py-1 hover:text-foreground"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  to="/kebijakan-privasi"
                  className="text-muted-foreground text-sm block py-1 hover:text-foreground"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  to="/pengembalian-refund"
                  className="text-muted-foreground text-sm block py-1 hover:text-foreground"
                >
                  Pengembalian & Refund
                </Link>
              </li>
              <li>
                <Link
                  to="/info-pemesanan-cetak"
                  className="text-muted-foreground text-sm block py-1 hover:text-foreground"
                >
                  Pemesanan Undangan Cetak
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section (Static) */}
          <div>
            <h3 className="text-lg uppercase mb-4 font-normal tracking-widest text-foreground">
              Sosial Media
            </h3>
            {/* TODO: Add correct social media links */}
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FacebookIcon />
              </a>

              <a
                href="https://www.instagram.com/duainsan.story/"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <PinterestIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} DuaInsan.Story. All rights reserved.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            to="/"
            className="text-xl md:text-3xl font-semibold font-fancy tracking-widest text-start italic text-foreground"
          >
            DuaInsan.Story
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
