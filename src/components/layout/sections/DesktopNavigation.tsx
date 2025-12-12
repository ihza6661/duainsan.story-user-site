import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/menus/navigation-menu";
import { fetchCategories } from "@/features/product/services/productService";
import type { ProductCategory } from "@/features/product/services/productService";
import { cn } from "@/lib/utils";

const DesktopNavigation = () => {
  const location = useLocation();

  // Fetch categories from API
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<ProductCategory[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Gallery dummy links
  const galleryLinks = [
    { name: "Lookbook", path: "/gallery?filter=lookbook" },
    { name: "Wedding Invitations", path: "/gallery?filter=wedding" },
    { name: "Guestbook Gallery", path: "/gallery?filter=guestbook" },
    { name: "Customer Stories", path: "/gallery?filter=stories" },
  ];

  // Info/Company links
  const infoLinks = [
    { name: "Cara Memesan", path: "/CaraPesan" },
    { name: "Info Pemesanan Cetak", path: "/info-pemesanan-cetak" },
    { name: "Syarat & Ketentuan", path: "/syarat-ketentuan" },
    { name: "Kebijakan Privasi", path: "/kebijakan-privasi" },
    { name: "Pengembalian & Refund", path: "/pengembalian-refund" },
  ];

  return (
    <NavigationMenu className="hidden tablet-custom:flex">
      <NavigationMenuList className="space-x-2">
        {/* Solusi Dropdown with Categories and Digital Invitations */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm uppercase tracking-normal bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50">
            Solusi
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[600px] p-4">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 bg-muted animate-pulse rounded-md"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="p-4 text-center text-sm text-destructive">
                  Gagal memuat kategori produk
                </div>
              ) : (
                <ul className="grid grid-cols-2 gap-3">
                  {/* Semua Produk - First Item */}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/products"
                        className={cn(
                          "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
                          location.pathname === "/products" && "bg-accent/30",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <svg
                              className="w-8 h-8 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none mb-1">
                              Semua Produk
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              Lihat semua koleksi
                            </p>
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  {/* Dynamic Categories */}
                  {categories?.map((category) => (
                    <li key={category.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={`/products/category/${category.slug}`}
                          className={cn(
                            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
                            location.pathname ===
                              `/products/category/${category.slug}` &&
                              "bg-accent/30",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {category.image_url ? (
                                <img
                                  src={category.image_url}
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <svg
                                  className="w-8 h-8 text-muted-foreground"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium leading-none mb-1">
                                {category.name}
                              </div>
                              {category.description && (
                                <p className="text-xs leading-snug text-muted-foreground line-clamp-2">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}

                  {/* Divider */}
                  <li className="col-span-2">
                    <div className="border-t border-border my-2"></div>
                  </li>

                  {/* Undangan Digital Section Header */}
                  <li className="col-span-2">
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Undangan Digital
                      </h3>
                    </div>
                  </li>

                  {/* Template Undangan */}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/digital-templates"
                        className={cn(
                          "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
                          location.pathname === "/digital-templates" && "bg-accent/30",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <svg
                              className="w-8 h-8 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none mb-1">
                              Template Undangan
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              Browse template undangan digital
                            </p>
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  {/* Undangan Saya */}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/my-invitations"
                        className={cn(
                          "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
                          location.pathname === "/my-invitations" && "bg-accent/30",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <svg
                              className="w-8 h-8 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none mb-1">
                              Undangan Saya
                            </div>
                            <p className="text-xs leading-snug text-muted-foreground">
                              Kelola undangan Anda
                            </p>
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Galeri Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm uppercase tracking-normal bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50">
            Galeri
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              {galleryLinks.map((link) => (
                <li key={link.path}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={link.path}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        location.pathname === link.path && "bg-accent/30",
                      )}
                    >
                      <div className="text-sm font-medium leading-none">
                        {link.name}
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        Jelajahi koleksi {link.name.toLowerCase()}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Info Dropdown */}
        {/* <NavigationMenuItem> */}
        {/*   <NavigationMenuTrigger className="text-sm uppercase tracking-normal bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50"> */}
        {/*     Info */}
        {/*   </NavigationMenuTrigger> */}
        {/*   <NavigationMenuContent> */}
        {/*     <ul className="grid w-[400px] gap-3 p-4"> */}
        {/*       {infoLinks.map((link) => ( */}
        {/*         <li key={link.path}> */}
        {/*           <NavigationMenuLink asChild> */}
        {/*             <Link */}
        {/*               to={link.path} */}
        {/*               className={cn( */}
        {/*                 "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", */}
        {/*                 location.pathname === link.path && "bg-accent/30", */}
        {/*               )} */}
        {/*             > */}
        {/*               <div className="text-sm font-medium leading-none"> */}
        {/*                 {link.name} */}
        {/*               </div> */}
        {/*               <p className="line-clamp-2 text-xs leading-snug text-muted-foreground"> */}
        {/*                 Informasi tentang {link.name.toLowerCase()} */}
        {/*               </p> */}
        {/*             </Link> */}
        {/*           </NavigationMenuLink> */}
        {/*         </li> */}
        {/*       ))} */}
        {/*     </ul> */}
        {/*   </NavigationMenuContent> */}
        {/* </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigation;
