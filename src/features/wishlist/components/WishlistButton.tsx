import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAddToWishlist, useRemoveFromWishlist, useCheckWishlist } from '../hooks/useWishlist';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/ui/use-toast';

interface WishlistButtonProps {
  productId: number;
  variant?: 'default' | 'small' | 'large';
  showText?: boolean;
  className?: string;
}

export const WishlistButton = ({
  productId,
  variant = 'default',
  showText = false,
  className = '',
}: WishlistButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: checkData, isLoading: isChecking } = useCheckWishlist(productId);
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const isInWishlist = checkData?.data?.in_wishlist ?? false;
  const wishlistId = checkData?.data?.wishlist_id;

  const isLoading = isChecking || addMutation.isPending || removeMutation.isPending;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      if (isInWishlist && wishlistId) {
        await removeMutation.mutateAsync(wishlistId);
        toast({
          title: "Dihapus dari wishlist",
          description: "Produk telah dihapus dari wishlist Anda",
        });
      } else {
        await addMutation.mutateAsync(productId);
        toast({
          title: "Ditambahkan ke wishlist",
          description: "Produk telah ditambahkan ke wishlist Anda",
        });
      }
    } catch (error) {
      console.error('Wishlist action failed:', error);
      toast({
        title: "Aksi gagal",
        description: "Tidak dapat memperbarui wishlist. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  // Size configurations
  const sizeConfig = {
    small: {
      button: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-xs',
    },
    default: {
      button: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-sm',
    },
    large: {
      button: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-base',
    },
  };

  const size = sizeConfig[variant];

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${showText ? 'flex items-center gap-2 px-4 py-2' : `${size.button} flex items-center justify-center`}
        rounded-full
        transition-all duration-200
        ${isInWishlist 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
        }
        ${isAnimating ? 'scale-110' : 'scale-100'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}
        ${className}
      `}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`
          ${size.icon}
          transition-all duration-200
          ${isInWishlist ? 'fill-current' : ''}
          ${isAnimating ? 'animate-pulse' : ''}
        `}
      />
      {showText && (
        <span className={size.text}>
          {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};
