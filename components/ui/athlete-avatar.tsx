"use client";

import Image from "next/image";
import { cn, getCachedImageUrl } from "@/lib/utils";

interface AthleteAvatarProps {
  imageUrl?: string;
  updatedAt?: Date | string;
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
  xs: "96px", // 48px * 2 for device pixel ratio
  sm: "112px", // 56px * 2 for device pixel ratio
  md: "128px", // 64px * 2 for device pixel ratio
  lg: "224px", // 112px * 2 for device pixel ratio
};

export function AthleteAvatar({
  imageUrl,
  updatedAt,
  countryCode,
  size = "md",
  className,
  priority = false,
}: AthleteAvatarProps) {
  const sizeValue = imageSizes[size];

  // Get cached image URL with version parameter for cache busting
  const cachedImageUrl = getCachedImageUrl(imageUrl || null, updatedAt);

  // Validate country code
  const validCountryCode =
    countryCode && countryCode.length >= 2 && countryCode.length <= 10
      ? countryCode.toLowerCase()
      : null;

  const flagSrc = validCountryCode ? `https://flagcdn.com/${validCountryCode}.svg` : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm",
        sizeMap[size],
        className
      )}
    >
      {/* Flag Background */}
      {flagSrc && (
        <div className="absolute inset-0 z-0">
          <Image
            src={flagSrc}
            alt={`${validCountryCode} flag`}
            fill
            className="object-cover opacity-80"
            priority={priority}
            quality={90}
            sizes={sizeValue}
            unoptimized={true}
          />
        </div>
      )}

      {/* Athlete Image */}
      <div className="absolute inset-0 z-10">
        {cachedImageUrl ? (
          <Image
            src={cachedImageUrl}
            alt="Profile"
            fill
            className="object-cover"
            priority={priority}
            quality={90}
            sizes={sizeValue}
          />
        ) : (
          <div className="h-full w-full bg-muted/20 flex items-center justify-center">
            <Image
              src="/placeholder/SILHOUETTE.avif"
              alt="Profile placeholder"
              fill
              className="object-cover opacity-85"
              priority={priority}
              quality={90}
              sizes={sizeValue}
            />
          </div>
        )}
      </div>
    </div>
  );
}
