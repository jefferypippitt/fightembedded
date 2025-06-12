import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import 'flag-icons/css/flag-icons.min.css';

interface AthleteAvatarProps {
  imageUrl?: string;
  countryCode?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  xs: 'h-10 w-10',
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
};

const imageSizes = {
  xs: 40,
  sm: 64,
  md: 96,
  lg: 128,
};

export function AthleteAvatar({ 
  imageUrl, 
  countryCode, 
  size = 'md',
  className = '',
  priority = false
}: AthleteAvatarProps) {
  const imageSize = imageSizes[size];

  return (
    <div className="relative">
      {/* Flag Background */}
      {countryCode && (
        <div className="absolute inset-0 z-0">
          <Image
            src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
            alt={`${countryCode} flag`}
            width={imageSize}
            height={imageSize}
            className={cn(
              sizeMap[size],
              "rounded-full object-cover opacity-100",
              "absolute inset-0"
            )}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes={`(max-width: 768px) ${imageSize}px, ${imageSize}px`}
          />
        </div>
      )}

      {/* Athlete Image */}
      <Avatar
        className={`${sizeMap[size]} ring-1 ring-border ${className} relative z-10`}
      >
        {imageUrl ? (
          <AvatarImage
            src={imageUrl}
            alt="Profile"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
            <Image
              src="/placeholder/SILHOUETTE.avif"
              alt="Profile placeholder"
              width={imageSize}
              height={imageSize}
              className="h-24 w-24 object-cover"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              sizes={`(max-width: 768px) ${imageSize}px, ${imageSize}px`}
            />
          </div>
        )}
      </Avatar>
    </div>
  );
} 