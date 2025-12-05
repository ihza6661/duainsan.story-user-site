import { Heart, ShoppingBag, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSharedWishlist } from '@/features/wishlist/hooks/useWishlist';
import { WishlistItem } from '@/features/wishlist/components/WishlistItem';

export const SharedWishlistPage = () => {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = useSharedWishlist(token || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading wishlist...</p>
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
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Wishlist Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This wishlist link is invalid or has expired.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Browse Products</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const wishlistItems = data?.data?.items || [];
  const userName = data?.data?.user_name;
  const isEmpty = wishlistItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {userName ? `${userName}'s Wishlist` : 'Shared Wishlist'}
              </h1>
              {userName && (
                <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Shared by {userName}</span>
                </div>
              )}
            </div>
          </div>
          
          {!isEmpty && (
            <p className="text-gray-600 dark:text-gray-400">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in this wishlist
            </p>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            You're viewing a shared wishlist. Click on any item to view details and make a purchase!
          </p>
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <Heart className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              This wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
              The owner hasn't added any items yet. Check back later!
            </p>
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Browse Our Products</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <WishlistItem key={item.id} item={item} showRemoveButton={false} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
