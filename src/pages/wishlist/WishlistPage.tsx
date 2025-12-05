import { Heart, Share2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { WishlistItem } from '@/features/wishlist/components/WishlistItem';
import { ShareWishlistButton } from '@/features/wishlist/components/ShareWishlistButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/feedback/alert';

export const WishlistPage = () => {
  const { data, isLoading, error } = useWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat wishlist Anda...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Heart className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Gagal Memuat Wishlist
              </h2>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Terjadi kesalahan'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const wishlistItems = data?.data?.items || [];
  const shareableLink = data?.data?.shareable_link;
  const isEmpty = wishlistItems.length === 0;

  return (
    <div className="min-h-screen bg-background py-20 sm:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-destructive fill-current" />
              <h1 className="text-3xl font-bold text-foreground">
                Wishlist Saya
              </h1>
            </div>
            
            {!isEmpty && shareableLink && (
              <ShareWishlistButton shareableLink={shareableLink} />
            )}
          </div>
          
          {!isEmpty && (
            <p className="text-muted-foreground">
              Anda memiliki {wishlistItems.length} {wishlistItems.length === 1 ? 'produk' : 'produk'} dalam wishlist
            </p>
          )}
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-lg shadow-sm p-8">
            <Heart className="w-24 h-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Wishlist Anda Kosong
            </h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Mulai tambahkan produk favorit Anda ke wishlist. Anda juga dapat membagikannya dengan teman dan keluarga!
            </p>
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Jelajahi Produk</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Share Info Banner */}
            {shareableLink && (
              <Alert className="mb-6 flex items-start gap-3">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <AlertTitle className="font-medium mb-1">
                    Bagikan Wishlist Anda
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    Klik tombol "Bagikan Wishlist" untuk menyalin link. Siapa saja dengan link ini dapat melihat wishlist Anda!
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <WishlistItem key={item.id} item={item} showRemoveButton={true} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
