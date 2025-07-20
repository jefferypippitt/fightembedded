import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "flag-icons/css/flag-icons.min.css";

interface AthleteAvatarProps {
  imageUrl?: string;
  countryCode?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  xs: "h-10 w-10 md:h-12 md:w-12",
  sm: "h-12 w-12 md:h-16 md:w-16",
  md: "h-20 w-20 md:h-24 md:w-24",
  lg: "h-24 w-24 md:h-32 md:w-32",
};

const imageSizes = {
  xs: { mobile: 80, desktop: 96 },
  sm: { mobile: 96, desktop: 128 },
  md: { mobile: 160, desktop: 192 },
  lg: { mobile: 192, desktop: 256 },
};

export function AthleteAvatar({
  imageUrl,
  countryCode,
  size = "md",
  className = "",
  priority = false,
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
            width={imageSize.desktop}
            height={imageSize.desktop}
            className={cn(
              sizeMap[size],
              "rounded-full object-cover opacity-100",
              "absolute inset-0"
            )}
            priority={priority}
            quality={75}
            sizes={`(max-width: 768px) ${imageSize.mobile}px, ${imageSize.desktop}px`}
          />
        </div>
      )}

      {/* Athlete Image */}
      <Avatar
        className={cn(
          sizeMap[size],
          "ring-1 ring-border relative z-10 overflow-hidden",
          className
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className="object-cover"
            priority={priority}
            quality={75}
            sizes={`(max-width: 768px) ${imageSize.mobile}px, ${imageSize.desktop}px`}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
            <Image
              src="/placeholder/SILHOUETTE.avif"
              alt="Profile placeholder"
              fill
              className="object-cover"
              priority={priority}
              quality={75}
              sizes={`(max-width: 768px) ${imageSize.mobile}px, ${imageSize.desktop}px`}
            />
          </div>
        )}
      </Avatar>
    </div>
  );
}
