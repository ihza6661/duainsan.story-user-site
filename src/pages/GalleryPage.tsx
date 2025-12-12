import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import ugcService from "@/services/api/ugcService";
import { UGCGalleryGrid } from "@/components/gallery/UGCGalleryGrid";
import { Button } from "@/components/ui/buttons/button";
import { MetaTags } from "@/components/seo/MetaTags";

const GalleryPage = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ugc", page, filter],
    queryFn: () =>
      ugcService.getApproved({
        page,
        per_page: 12,
        featured: filter === "featured" ? true : undefined,
      }),
  });

  const ugcItems = data?.data.data || [];
  const pagination = data?.data;

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Gallery - DuaInsan.Story"
        description="Lihat koleksi foto dari pelanggan kami yang telah menggunakan produk undangan pernikahan DuaInsan.Story"
        type="website"
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ImageIcon className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Customer Gallery
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Lihat momen indah dari pelanggan kami yang telah menggunakan produk
            undangan pernikahan DuaInsan.Story
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-b">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex gap-4 py-4">
            <button
              onClick={() => {
                setFilter("all");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Photos
            </button>
            <button
              onClick={() => {
                setFilter("featured");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "featured"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Featured
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">Gagal memuat galeri</p>
              <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
            </div>
          )}

          {!isLoading && !isError && ugcItems.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filter === "featured"
                  ? "Belum ada foto featured"
                  : "Belum ada foto di galeri"}
              </p>
            </div>
          )}

          {!isLoading && !isError && ugcItems.length > 0 && (
            <>
              <UGCGalleryGrid items={ugcItems} />

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-muted-foreground">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.last_page, p + 1))
                    }
                    disabled={page === pagination.last_page}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bagikan Momen Anda Bersama Kami!
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Sudah menggunakan produk kami? Bagikan foto Anda dan jadilah bagian
            dari galeri kami. Tag kami di Instagram @duainsan.story dengan
            hashtag #duainsanstory
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              <a href="/products">Lihat Produk Kami</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <a
                href="https://www.instagram.com/duainsan.story/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow di Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
