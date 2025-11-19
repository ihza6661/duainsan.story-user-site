
import { Skeleton } from "@/components/ui/utils/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div>
          <Skeleton className="w-full h-[400px] md:h-[500px] rounded-lg" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="w-16 h-16 rounded-md" />
            <Skeleton className="w-16 h-16 rounded-md" />
            <Skeleton className="w-16 h-16 rounded-md" />
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col pt-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-6" />

          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
