"use client";

import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AthleteAvatarProps {
  imageUrl?: string;
  countryCode?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  xs: "h-12 w-12 md:h-12 md:w-12",
  sm: "h-16 w-16 md:h-16 md:w-16",
  md: "h-24 w-24 md:h-24 md:w-24",
  lg: "h-32 w-32 md:h-32 md:w-32",
};

const imageSizes = {
  xs: { mobile: 96, desktop: 96 },
  sm: { mobile: 128, desktop: 128 },
  md: { mobile: 192, desktop: 192 },
  lg: { mobile: 256, desktop: 256 },
};

export function AthleteAvatar({
  imageUrl,
  countryCode,
  size = "md",
  className = "",
  priority = false,
}: AthleteAvatarProps) {
  const imageSize = imageSizes[size];
  const [imageError, setImageError] = useState(false);

  // Validate country code
  const validCountryCode =
    countryCode && countryCode.length >= 2 && countryCode.length <= 10
      ? countryCode.toLowerCase()
      : null;

  const flagSrc = `https://flagcdn.com/${validCountryCode}.svg`;

  return (
    <div className="relative">
      {/* Flag Background */}
      {validCountryCode && (
        <div className="absolute inset-0 z-0">
          <Image
            src={flagSrc}
            alt={`${validCountryCode} flag`}
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
            unoptimized={true}
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
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className="object-cover"
            priority={priority}
            quality={75}
            sizes={`(max-width: 768px) ${imageSize.mobile}px, ${imageSize.desktop}px`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-muted/20 flex items-center justify-center">
            <Image
              src="/placeholder/SILHOUETTE.avif"
              alt="Profile placeholder"
              fill
              className="object-cover opacity-60"
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
