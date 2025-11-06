
import { useState, useEffect } from "react";
import { Product, getFeaturedProducts } from "@/lib/data";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const products = getFeaturedProducts();
    setFeaturedProducts(products);
  }, []);
  
  return (
    <section className="py-12 bg-shop-light-gray">
      <div className="container">
        <h2 className="text-2xl font-medium mb-8 text-center uppercase tracking-wider">Featured Products</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard product={product} featured />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
