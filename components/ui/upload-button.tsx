"use client";

import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";

interface AthleteImageUploadProps {
  onUploadComplete?: (url: string) => void;
}

export function AthleteImageUpload({ onUploadComplete }: AthleteImageUploadProps) {
  return (
    <div className="w-full">
      <UploadButton
        endpoint="athleteImage"
        onClientUploadComplete={(res) => {
          if (res?.[0]) {
            toast.success("Image uploaded successfully");
            onUploadComplete?.(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`Error uploading image: ${error.message}`);
        }}
        className="ut-button ut-readying ut-uploading ut-button:bg-blue-500 ut-button:hover:bg-blue-600 ut-button:text-white"
      />
    </div>
  );
} 