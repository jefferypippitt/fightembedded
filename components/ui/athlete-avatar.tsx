import Image from "next/image";
import { cn } from "@/lib/utils";

interface AthleteAvatarProps {
  imageUrl?: string;
  countryCode?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  xs: "h-12 w-12",
  sm: "h-14 w-14",
  md: "h-16 w-16",
  lg: "h-28 w-28",
};

const imageSizes = {
  xs: { mobile: 48, desktop: 48 },
  sm: { mobile: 56, desktop: 56 },
  md: { mobile: 64, desktop: 64 },
  lg: { mobile: 112, desktop: 112 },
};

export function AthleteAvatar({
  imageUrl,
  countryCode,
  size = "md",
  className,
  priority = false,
}: AthleteAvatarProps) {
  const imageSize = imageSizes[size];

  // Validate country code
  const validCountryCode =
    countryCode && countryCode.length >= 2 && countryCode.length <= 10
      ? countryCode.toLowerCase()
      : null;

  const flagSrc = `https://flagcdn.com/${validCountryCode}.svg`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm",
        sizeMap[size],
        className
      )}
    >
      {/* Flag Background */}
      {validCountryCode && (
        <div className="absolute inset-0 z-0">
          <Image
            src={flagSrc}
            alt={`${validCountryCode} flag`}
            fill
            className="object-cover opacity-80"
            priority={priority}
            quality={75}
            sizes={`(max-width: 768px) ${imageSize.mobile}px, ${imageSize.desktop}px`}
            unoptimized={true}
          />
          {/* Vignette effect on flag */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.35)_100%)]" />
        </div>
      )}

      {/* Athlete Image */}
      <div className="absolute inset-0 z-10 brightness-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className="object-cover brightness-100"
            priority={priority}
            quality={75}
            sizes={`(max-width: 768px) ${imageSize.mobile}px, ${imageSize.desktop}px`}
          />
        ) : (
          <div className="h-full w-full bg-muted/20 flex items-center justify-center">
            <Image
              src="/placeholder/SILHOUETTE.avif"
              alt="Profile placeholder"
              fill
              className="object-cover opacity-85 brightness-100"
              priority={priority}
              quality={75}
              sizes={`(max-width: 768px) ${imageSize.mobile}px, ${imageSize.desktop}px`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
