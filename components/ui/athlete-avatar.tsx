'use client';

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
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
        <div 
          className={`absolute inset-0 ${sizeMap[size]} rounded-full overflow-hidden`}
          style={{
            background: `center / cover no-repeat url(https://flagcdn.com/${countryCode.toLowerCase()}.svg)`,
            opacity: '0.8',
          }}
        />
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
            className="object-cover transition-all duration-300"
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
            <Image
              src="/placeholder/image-photography-icon.png"
              alt="Profile placeholder"
              width={32}
              height={32}
              className="h-8 w-8 dark:invert"
              priority={priority}
            />
          </div>
        )}
      </Avatar>
    </div>
  );
} 