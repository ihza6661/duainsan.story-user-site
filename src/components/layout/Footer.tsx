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
                  <span className="text-muted-foreground text-sm">Loading...</span>
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
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/duainsan.story/"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm.003 1.44h.006c2.013 0 2.253.008 3.057.044.738.034 1.22.175 1.51.287.333.13.65.301.957.569.269.269.41.555.539.857.112.288.213.739.267 1.434.034.788.042 1.036.042 3.05 0 2.014-.008 2.261-.044 3.05-.033.697-.135 1.188-.267 1.477-.12.32-.262.605-.54.875a2.32 2.32 0 0 1-.85.549c-.292.112-.742.213-1.46.247-.808.034-1.052.042-3.09.042-2.037 0-2.283-.008-3.09-.042-.7-.034-1.15-.135-1.45-.247a2.41 2.41 0 0 1-.89-.57l-.55-.857c-.111-.29-.213-.74-.267-1.436-.034-.788-.042-1.036-.042-3.05 0-2.014.008-2.261.044-3.05.033-.697.135-1.188.267-1.477.12-.32.262-.605.54-.875a2.32 2.32 0 0 1 .85-.549c.292-.112.742-.213 1.46-.247.696-.032 1.008-.042 2.488-.042" />
                  <path d="M8 3.892a4.108 4.108 0 1 0 0 8.216 4.108 4.108 0 0 0 0-8.216m0 6.776a2.668 2.668 0 1 1 0-5.336 2.668 2.668 0 0 1 0 5.336" />
                  <circle cx="12.145" cy="3.855" r=".96" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.287-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0" />
                </svg>
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