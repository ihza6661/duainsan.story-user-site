import { X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WishlistItem as WishlistItemType } from '../services/wishlistService';
import { useRemoveFromWishlist } from '../hooks/useWishlist';
import { useState } from 'react';

interface WishlistItemProps {
  item: WishlistItemType;
  showRemoveButton?: boolean;
}

export const WishlistItem = ({ item, showRemoveButton = true }: WishlistItemProps) => {
  const removeMutation = useRemoveFromWishlist();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm('Remove this item from your wishlist?')) {
      setIsRemoving(true);
      try {
        await removeMutation.mutateAsync(item.id);
      } catch (error) {
        console.error('Failed to remove item:', error);
      } finally {
        setIsRemoving(false);
      }
    }
  };

  const product = item.product;
  const imageUrl = product.featured_image?.image_url || '/placeholder.svg';
  const productLink = `/products/${product.slug}`;

  return (
    <div
      className={`
        relative group
        bg-white dark:bg-gray-800 
        rounded-lg shadow-sm hover:shadow-md 
        transition-all duration-200
        border border-gray-200 dark:border-gray-700
        overflow-hidden
        ${isRemoving ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <Link to={productLink} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Remove Button */}
          {showRemoveButton && (
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="
                absolute top-2 right-2
                w-8 h-8 flex items-center justify-center
                bg-white dark:bg-gray-800 rounded-full
                shadow-md hover:shadow-lg
                opacity-0 group-hover:opacity-100
                transition-all duration-200
                hover:bg-red-50 dark:hover:bg-red-900/20
                hover:text-red-500
                disabled:opacity-50
              "
              aria-label="Remove from wishlist"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
              Rp {product.base_price.toLocaleString('id-ID')}
            </div>
            
            <Link
              to={productLink}
              className="
                flex items-center gap-1
                text-xs text-primary-600 dark:text-primary-400
                hover:text-primary-700 dark:hover:text-primary-300
                transition-colors
              "
              aria-label="View product details"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>View</span>
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};
