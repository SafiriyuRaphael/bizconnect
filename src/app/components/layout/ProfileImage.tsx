import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import React from "react";

type Props = {
  logo?: string | null;
  user: { businessName?: string; fullName?: string | null };
  className: string;
};

export default function ProfileImage({ logo, className, user }: Props) {
  const generateDefaultLogoDataUrl = (name: string): string => {
    const svg = generateDefaultLogo(name);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const fallbackAlt = user?.businessName || user?.fullName || "User";
  const fallbackSrc = generateDefaultLogoDataUrl(fallbackAlt);
  return (
    <>
      {logo ? (
        <CldImage
          alt={fallbackAlt}
          src={logo}
          width={40}
          height={40}
          className={className}
          crop={{
            type: "thumb",
            source: true,
          }}
        />
      ) : (
        <Image
          src={fallbackSrc}
          alt={fallbackAlt}
          width={40}
          height={40}
          className={className}
        />
      )}
    </>
  );
}
