import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGalleryItems } from "@/features/gallery/services/galleryService";
import Newsletter from "@/components/ui/Newsletter";
import ExploreTheNewestTrend from "@/components/layout/sections/ExploreTheNewestTrend";
import { Skeleton } from "@/components/ui/utils/skeleton";
import { Button } from "@/components/ui/buttons/button";
import React from "react";
import { getImageUrl } from "@/lib/utils";

export default function GalleryPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["galleryItems"],
    queryFn: ({ pageParam }) => fetchGalleryItems({ pageParam }),
    initialPageParam: "/customer/gallery-items",
    getNextPageParam: (lastPage) => lastPage.links.next, // Gunakan URL dari link 'next' untuk halaman berikutnya
  });

  React.useEffect(() => {
    if (data) {
      console.log("API Response Data:", JSON.stringify(data, null, 2));
    }
  }, [data]);

  const galleryItems = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="pt-28 w-full bg-background">
      <div className="text-center space-y-4">
        <h1 className="pb-24 font-normal tracking-wide">Galeri</h1>
      </div>

      {isLoading && (
        <div className="container mx-auto px-4">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-96 w-full mb-4 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-red-500">
          Terjadi kesalahan saat memuat galeri: {error?.message}
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden mb-4 break-inside-avoid"
            >
              <img
                src={getImageUrl(item.file_url)}
                alt={item.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="absolute top-4 right-4 bg-white p-2 cursor-pointer rounded-full shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M12 5v14m7-7H5"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center my-8">
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
          </Button>
        )}
      </div>

      {!isLoading && !isError && galleryItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">
            Tidak ada gambar di galeri saat ini.
          </p>
        </div>
      )}

      <ExploreTheNewestTrend />
      <Newsletter />
    </div>
  );
}
