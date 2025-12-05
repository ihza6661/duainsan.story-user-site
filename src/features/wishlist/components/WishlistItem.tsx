import { X, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { WishlistItem as WishlistItemType } from '../services/wishlistService';
import { useRemoveFromWishlist, useAddToWishlist } from '../hooks/useWishlist';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/dialogs/alert-dialog';
import { useToast } from '@/hooks/ui/use-toast';
import { ToastAction } from '@/components/ui/feedback/toast';

interface WishlistItemProps {
  item: WishlistItemType;
  showRemoveButton?: boolean;
}

export const WishlistItem = ({ item, showRemoveButton = true }: WishlistItemProps) => {
  const removeMutation = useRemoveFromWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    setShowDeleteDialog(false);
    
    try {
      // Capture item data in closure before component unmounts
      const itemToRemove = {
        product_id: item.product_id,
        product_name: item.product.name,
      };
      
      await removeMutation.mutateAsync(item.id);
      
      // Show success toast with undo action
      // The handleUndo function is defined inline so it captures itemToRemove in its closure
      toast({
        title: 'Dihapus dari Wishlist',
        description: `"${itemToRemove.product_name}" telah dihapus dari wishlist Anda.`,
        action: (
          <ToastAction 
            altText="Urungkan penghapusan" 
            onClick={async () => {
              try {
                await addToWishlistMutation.mutateAsync(itemToRemove.product_id);
                toast({
                  title: 'Berhasil Dikembalikan',
                  description: `"${itemToRemove.product_name}" telah dikembalikan ke wishlist Anda.`,
                });
              } catch (error) {
                console.error('Failed to undo removal:', error);
                toast({
                  title: 'Gagal Mengembalikan',
                  description: 'Terjadi kesalahan saat mengembalikan item ke wishlist.',
                  variant: 'destructive',
                });
              }
            }}
          >
            Urungkan
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({
        title: 'Gagal Menghapus',
        description: 'Terjadi kesalahan saat menghapus item dari wishlist.',
        variant: 'destructive',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const handleMoveToCart = () => {
    // AlertDialogAction automatically closes the dialog
    // Navigate to product page where user can select variant and add to cart
    navigate(`/product/${item.product.slug}`);
  };

  const product = item.product;
  const imageUrl = product.featured_image?.image_url || '/placeholder.svg';
  const productLink = `/product/${product.slug}`;

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
      {/* Remove Button - Positioned outside Link */}
      {showRemoveButton && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <button
              disabled={isRemoving}
              className="
                absolute top-2 right-2 z-10
                w-8 h-8 flex items-center justify-center
                bg-white dark:bg-gray-800 rounded-full
                shadow-md hover:shadow-lg
                md:opacity-0 md:group-hover:opacity-100
                transition-all duration-200
                hover:bg-red-50 dark:hover:bg-red-900/20
                hover:text-red-500
                disabled:opacity-50
              "
              aria-label="Hapus dari wishlist"
            >
              <X className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus dari Wishlist?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus <strong>"{product.name}"</strong> dari wishlist Anda?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMoveToCart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                Lihat & Tambah ke Keranjang
              </AlertDialogAction>
              <AlertDialogAction
                onClick={handleRemove}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Product Link - Clickable card */}
      <Link to={productLink} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
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
            
            <div className="
              flex items-center gap-1
              text-xs text-primary-600 dark:text-primary-400
              group-hover:text-primary-700 dark:group-hover:text-primary-300
              transition-colors
            ">
              <ShoppingCart className="w-4 h-4" />
              <span>Lihat</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
