import { ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  webpSrc?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

/**
 * OptimizedImage Component
 * 
 * Provides automatic:
 * - WebP format with fallback to original
 * - Native lazy loading
 * - Loading state with blur effect
 * - Error handling with fallback
 * 
 * Usage:
 * <OptimizedImage 
 *   src="/products/image.jpg" 
 *   alt="Product" 
 *   className="w-full"
 *   loading="lazy"
 * />
 */
export function OptimizedImage({
  src,
  alt,
  webpSrc,
  className,
  loading = 'lazy',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Auto-detect WebP version if not provided
  // Skip webp conversion for absolute URLs (backend-served images) unless explicitly provided
  const isAbsoluteUrl = src.startsWith('http://') || src.startsWith('https://');
  const webpSource = webpSrc || (isAbsoluteUrl ? null : src.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
  
  // Use eager loading for priority images (above fold)
  const loadingStrategy = priority ? 'eager' : loading;

  return (
    <picture className={cn('block', className)}>
      {/* WebP source for modern browsers (only if webpSource is provided) */}
      {!hasError && webpSource && (
        <source 
          srcSet={webpSource} 
          type="image/webp"
        />
      )}
      
      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        loading={loadingStrategy}
        decoding={priority ? 'sync' : 'async'}
        className={cn(
          'transition-all duration-300',
          !imageLoaded && 'blur-sm opacity-50',
          imageLoaded && 'blur-0 opacity-100',
          className
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setHasError(true);
          setImageLoaded(true);
        }}
        {...props}
      />
    </picture>
  );
}

/**
 * BackgroundImage Component
 * 
 * Optimized background image with WebP support
 * 
 * Usage:
 * <BackgroundImage 
 *   src="/hero/bg.jpg" 
 *   className="h-screen"
 * >
 *   <div>Content</div>
 * </BackgroundImage>
 */
export function BackgroundImage({
  src,
  webpSrc,
  children,
  className,
  ...props
}: {
  src: string;
  webpSrc?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const webpSource = webpSrc || src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return (
    <div
      className={cn('relative bg-cover bg-center bg-no-repeat', className)}
      style={{
        // Modern browsers will use WebP if available via image-set
        backgroundImage: `image-set(
          url('${webpSource}') type('image/webp'),
          url('${src}')
        )`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
