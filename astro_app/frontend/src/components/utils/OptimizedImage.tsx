import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  srcSet?: string;
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  sizes,
  srcSet,
  fallbackSrc
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setImageError(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && !imageError) {
      setImageSrc(fallbackSrc);
      setImageError(true);
    }
  };

  // Generate WebP srcset if not provided
  const generateSrcSet = (baseSrc: string) => {
    if (srcSet) return srcSet;
    
    // Convert to WebP format
    const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    return `
      ${webpSrc} 1x,
      ${webpSrc.replace(/\.webp$/i, '@2x.webp')} 2x,
      ${webpSrc.replace(/\.webp$/i, '@3x.webp')} 3x
    `.trim();
  };

  // Responsive sizes for different screen sizes
  const defaultSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 768px) 50vw,
    (max-width: 1024px) 33vw,
    25vw
  `.trim();

  return (
    <picture>
      {/* WebP format with fallbacks */}
      <source
        srcSet={generateSrcSet(imageSrc)}
        type="image/webp"
        sizes={defaultSizes}
      />
      
      {/* Original format as fallback */}
      <source
        srcSet={imageSrc}
        sizes={defaultSizes}
      />
      
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
        onError={handleError}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
    </picture>
  );
};

export default OptimizedImage;