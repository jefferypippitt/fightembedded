'use client';

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

export function AthleteAvatar({ 
  imageUrl, 
  countryCode, 
  size = 'md',
  className = '',
  priority = false
}: AthleteAvatarProps) {
  return (
    <div className="relative">
      {/* Flag Background */}
      {countryCode && (
        <div className="relative">
          <Image
            src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
            alt={`${countryCode} flag`}
            width={size === 'xs' ? 40 : size === 'sm' ? 64 : size === 'md' ? 96 : 128}
            height={size === 'xs' ? 40 : size === 'sm' ? 64 : size === 'md' ? 96 : 128}
            className={cn(
              sizeMap[size],
              "rounded-full object-cover opacity-80",
              "absolute inset-0"
            )}
            priority={priority}
          />
        </div>
      )}
      
      {/* Gradient Overlay for better image visibility */}
      <div 
        className={`absolute inset-0 ${sizeMap[size]} rounded-full`}
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
          zIndex: 1
        }}
      />

      {/* Athlete Image */}
      <Avatar 
        className={`${sizeMap[size]} ring-1 ring-border ${className} relative`}
        style={{ zIndex: 2 }}
      >
        {imageUrl ? (
          <AvatarImage
            src={imageUrl}
            alt="Profile"
            className="object-cover"
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
            <Image
              src="/placeholder/SILHOUETTE.avif"
              alt="Profile placeholder"
              width={100}
              height={100}
              className="h-24 w-24 object-cover"
         
            />
          </div>
        )}
      </Avatar>
    </div>
  );
} 