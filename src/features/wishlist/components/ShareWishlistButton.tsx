import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { useCopyShareableLink } from '../hooks/useWishlist';

interface ShareWishlistButtonProps {
  shareableLink: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const ShareWishlistButton = ({
  shareableLink,
  variant = 'default',
  size = 'md',
  showText = true,
  className = '',
}: ShareWishlistButtonProps) => {
  const [copied, setCopied] = useState(false);
  const copyMutation = useCopyShareableLink();

  const handleShare = async () => {
    try {
      await copyMutation.mutateAsync(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      button: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      button: 'px-6 py-3 text-lg',
      icon: 'w-6 h-6',
    },
  };

  // Variant configurations
  const variantConfig = {
    default:
      'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    ghost:
      'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  };

  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  return (
    <button
      onClick={handleShare}
      disabled={copyMutation.isPending || copied}
      className={`
        ${sizeStyles.button}
        ${variantStyles}
        flex items-center gap-2
        rounded-lg
        font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label="Share wishlist"
    >
      {copied ? (
        <Check className={`${sizeStyles.icon} text-green-500`} />
      ) : (
        <>
          {copyMutation.isPending ? (
            <Copy className={`${sizeStyles.icon} animate-pulse`} />
          ) : (
            <Share2 className={sizeStyles.icon} />
          )}
        </>
      )}
      {showText && (
        <span>
          {copied ? 'Link Copied!' : 'Share Wishlist'}
        </span>
      )}
    </button>
  );
};
