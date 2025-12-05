import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// --- Imports from Service Layer & Contexts ---
import { fetchProductBySlug } from "@/features/product/services/productService";
import type { ProductDetail as ProductDetailType } from "@/features/product/services/productService";
import { useCart } from "@/features/cart/hooks/cart/use-cart";
import type { AddToCartPayload } from "@/features/cart/services/cartService";
import { toast } from "@/hooks/ui/use-toast";

// --- Import UI & Layout Components ---
import { ArrowLeftIcon } from "lucide-react";
import ActualBrandSlider from "@/components/ui/ActualBrandSlider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/utils/breadcrumb";
import { Button } from "@/components/ui/buttons/button";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProductHero from "@/features/product/components/ProductDetail/ProductHero";
import ProductServices from "@/features/product/components/ProductDetail/ProductServices";
import RelatedProducts from "@/features/product/components/ProductDetail/RelatedProducts";
import ProductDetailSkeleton from "@/features/product/components/ProductDetail/ProductDetailSkeleton";
import { ProductReviewsSection } from "@/features/reviews/components/ProductReviewsSection";
import { RecommendedProducts } from "@/features/recommendations";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  // Fetch product data from the API using React Query
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<ProductDetailType>({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
    retry: false,
  });

  // Handler to add the product to the cart, passed down to ProductHero
  const handleAddToCart = (payload: AddToCartPayload) => {
    if (!product) return;

    if (payload.quantity < product.min_order_quantity) {
      toast({
        title: `Minimal pemesanan ${product.min_order_quantity} lembar`,
        variant: "destructive",
      });
      return;
    }

    addToCart(payload, {
      onSuccess: () => {
        // Optional: You can add success actions here, e.g., opening a cart drawer
      },
    });
  };

  // ================= RENDER LOGIC =================

  // 1. Display skeleton while data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-grow">
          <ProductDetailSkeleton />
        </main>
      </div>
    );
  }

  // 2. Display error message if fetching fails or product is not found
  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-grow py-16">
          <div className="container text-center">
            <h1 className="text-3xl font-medium mb-6 text-foreground">
              Produk Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground mb-8">
              {error instanceof Error
                ? error.message
                : "Kami tidak dapat menemukan produk yang Anda cari."}
            </p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Kembali ke Halaman Produk
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // 3. Display the main content if data is loaded successfully
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <ProductHero product={product} onAddToCart={handleAddToCart} />
        <ProductServices />
        <ProductReviewsSection 
          productId={product.id} 
          productName={product.name} 
        />
        <RecommendedProducts 
          type="similar" 
          productId={product.id} 
          title="Produk Serupa" 
          limit={4} 
        />
        <RelatedProducts
          categorySlug={product.category.slug}
          currentProductId={product.id}
        />
        <div className=" py-4 px-4 sm:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to="/products"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Products
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <ActualBrandSlider />
      </main>
    </div>
  );
};

export default ProductDetail;
