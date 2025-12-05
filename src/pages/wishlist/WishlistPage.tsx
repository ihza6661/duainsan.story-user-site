import { Heart, Share2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { WishlistItem } from '@/features/wishlist/components/WishlistItem';
import { ShareWishlistButton } from '@/features/wishlist/components/ShareWishlistButton';

export const WishlistPage = () => {
  const { data, isLoading, error } = useWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Error Loading Wishlist
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error instanceof Error ? error.message : 'Something went wrong'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Wishlist
              </h1>
            </div>
            
            {!isEmpty && shareableLink && (
              <ShareWishlistButton shareableLink={shareableLink} />
            )}
          </div>
          
          {!isEmpty && (
            <p className="text-gray-600 dark:text-gray-400">
              You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          )}
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <Heart className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
              Start adding products you love to your wishlist. You can share it with friends and family!
            </p>
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Browse Products</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Share Info Banner */}
            {shareableLink && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Share Your Wishlist
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Click the "Share Wishlist" button to copy a link. Anyone with this link can view your wishlist!
                  </p>
                </div>
              </div>
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
